from firebase_functions import (
    https_fn,
    storage_fn,
    firestore_fn,
    pubsub_fn,
    options
)
from firebase_functions.pubsub_fn import on_message_published
from firebase_functions.firestore_fn import on_document_updated, Change
from cloudevents.http import CloudEvent
import os
import json
import base64
import logging
import re
from functools import lru_cache

# Lazy-loaded dependencies
_firebase_admin = None
_firestore = None
_storage = None
_auth = None
_pubsub_v1 = None
_genai = None
_pymupdf4llm = None

# --- Lazy Initialization Helpers ---
def get_firebase_admin():
    global _firebase_admin
    if _firebase_admin is None:
        import firebase_admin
        _firebase_admin = firebase_admin
        _firebase_admin.initialize_app()
    return _firebase_admin

def get_firestore():
    global _firestore
    if _firestore is None:
        from firebase_admin import firestore
        _firestore = firestore
    return _firestore

def get_storage():
    global _storage
    if _storage is None:
        from firebase_admin import storage
        _storage = storage
    return _storage

def get_pubsub():
    global _pubsub_v1
    if _pubsub_v1 is None:
        from google.cloud import pubsub_v1
        _pubsub_v1 = pubsub_v1
    return _pubsub_v1

def get_genai():
    global _genai
    if _genai is None:
        import google.generativeai as genai
        _genai = genai
        _genai.configure(api_key=os.getenv("LLM_API_KEY"))
    return _genai

def get_pymupdf():
    global _pymupdf4llm
    if _pymupdf4llm is None:
        import pymupdf4llm
        _pymupdf4llm = pymupdf4llm
    return _pymupdf4llm

# --- Clients ---
@lru_cache(maxsize=None)
def get_db():
    return get_firestore().client()

@lru_cache(maxsize=None)
def get_publisher():
    return get_pubsub().PublisherClient()

@lru_cache(maxsize=None)
def get_storage_client():
    project_id = os.getenv('GCP_PROJECT') or get_firebase_admin().get_app().project_id
    return get_storage().bucket(f"{project_id}.appspot.com")

logging.basicConfig(level=logging.INFO)

# Get project ID from environment or Firebase
project_id = os.getenv('GCP_PROJECT') or get_firebase_admin().get_app().project_id

# --- Topic Paths ---
pdf_uploaded_topic_path = get_publisher().topic_path(project_id, 'pdf-uploaded')
text_extracted_topic_path = get_publisher().topic_path(project_id, 'text-extracted')
run_agent_topic_path = get_publisher().topic_path(project_id, 'run-agent')

# --- Function 1: Upload Trigger ---
@storage_fn.on_object_finalized()
def upload_trigger_v2(event):
    """
    Triggered by a new file upload to Cloud Storage.
    Validates the upload, creates a Firestore document, and publishes a Pub/Sub message.
    """
    bucket_name = event.data.bucket
    file_path = event.data.name

    if not file_path.lower().endswith('.pdf') or len(file_path.split('/')) != 2:
        logging.info(f"Ignoring non-PDF file upload: {file_path}")
        return

    try:
        uid, file_name = os.path.split(file_path)
        file_id = os.path.splitext(file_name)[0]
    except ValueError:
        logging.error(f"Invalid file path format, cannot extract uid/file_id: {file_path}")
        return

    log_prefix = f"[{file_id}]"
    logging.info(f"{log_prefix} Starting upload trigger processing for user '{uid}'.")

    if not event.data.metadata or not event.data.metadata.get('firebaseStorageDownloadTokens'):
        logging.warning(f"{log_prefix} Upload is missing authentication token. Aborting.")
        return

    logging.info(f"{log_prefix} Creating initial Firestore document...")
    report_ref = get_db().collection('reports').document(file_id)
    
    initial_stages = {
        "parsing": "pending", "property_info": "pending", "red_flags": "pending",
        "qualitative_analysis": "pending", "dollar_impact": "pending", "citations": "pending",
        "compilation": "pending", "dispute_letter": "pending", "compliance": "pending"
    }

    report_data = {
        "uid": uid, "name": file_name, "status": "processing",
        "timestamp": firestore.SERVER_TIMESTAMP, "stages": initial_stages
    }
    
    try:
        report_ref.set(report_data)
        logging.info(f"{log_prefix} Successfully created Firestore document.")
    except Exception as e:
        logging.error(f"{log_prefix} Failed to create Firestore document: {e}", exc_info=True)
        return

    logging.info(f"{log_prefix} Publishing message to 'pdf-uploaded' topic...")
    message_data = {"fileId": file_id, "uid": uid, "filePath": file_path}
    message_bytes = json.dumps(message_data).encode('utf-8')

    try:
        future = publisher.publish(pdf_uploaded_topic_path, data=message_bytes)
        future.result()
        logging.info(f"{log_prefix} Successfully published message.")
    except Exception as e:
        logging.error(f"{log_prefix} Failed to publish message: {e}", exc_info=True)

    logging.info(f"{log_prefix} Upload trigger processing complete.")
    return

# --- Function 2: PDF Parser ---
@on_message_published(topic="pdf-uploaded")
def pdf_parser_v2(event):
    """
    Triggered by a Pub/Sub message on the 'pdf-uploaded' topic.
    Parses the PDF to Markdown and triggers the next step.
    """
    try:
        message_data = json.loads(base64.b64decode(event.data.message["data"]).decode('utf-8'))
        file_id = message_data['fileId']
        uid = message_data['uid']
        file_path = message_data['filePath']
    except (json.JSONDecodeError, KeyError) as e:
        logging.error(f"Failed to decode Pub/Sub message: {e}", exc_info=True)
        return

    log_prefix = f"[{file_id}]"
    logging.info(f"{log_prefix} Starting PDF parsing for user '{uid}'.")
    report_ref = get_db().collection('reports').document(file_id)

    try:
        logging.info(f"{log_prefix} Updating Firestore stage: parsing -> running.")
        report_ref.set({'stages': {'parsing': 'running'}}, merge=True)

        logging.info(f"{log_prefix} Downloading '{file_path}' from Cloud Storage...")
        blob = get_storage_client().blob(file_path)
        pdf_bytes = blob.download_as_bytes()
        logging.info(f"{log_prefix} Download complete.")

        logging.info(f"{log_prefix} Converting PDF to Markdown...")
        md_text = get_pymupdf().to_markdown(pdf_bytes)
        logging.info(f"{log_prefix} Conversion to Markdown successful.")

        md_file_path = f"parsed-text/{file_id}.md"
        logging.info(f"{log_prefix} Uploading Markdown to '{md_file_path}'...")
        md_blob = get_storage_client().blob(md_file_path)
        md_blob.upload_from_string(md_text, content_type='text/markdown')
        logging.info(f"{log_prefix} Markdown upload complete.")

        logging.info(f"{log_prefix} Updating Firestore stage: parsing -> complete.")
        report_ref.set({
            'stages': {'parsing': 'complete'},
            'parsedTextPath': md_file_path
        }, merge=True)

        logging.info(f"{log_prefix} Publishing message to 'text-extracted' topic...")
        next_message_data = {
            "fileId": file_id, "uid": uid, "parsedTextPath": md_file_path
        }
        message_bytes = json.dumps(next_message_data).encode('utf-8')
        future = get_publisher().publish(text_extracted_topic_path, data=message_bytes)
        future.result()
        logging.info(f"{log_prefix} Successfully published message.")

    except Exception as e:
        logging.error(f"{log_prefix} An error occurred during PDF parsing: {e}", exc_info=True)
        report_ref.set({
            'status': 'error', 'error_message': f"PDF parsing failed: {str(e)}",
            'stages': {'parsing': 'failed'}
        }, merge=True)

    logging.info(f"{log_prefix} PDF parsing processing complete.")
    return

# --- Function 3: Analysis Dispatcher ---

# --- Agent Group Definitions ---
GROUP_1_AGENTS = ["run_property_info_agent", "run_sales_comp_agent", "run_qualitative_analysis"]
GROUP_1_STAGES = ["property_info", "structured_data", "qualitative_analysis"]
GROUP_2_AGENTS = ["run_red_flag_agent", "run_dollar_impact_agent"]
GROUP_2_STAGES = ["red_flags", "dollar_impact"]
GROUP_3_AGENTS = ["run_compilation_agent", "run_citation_agent", "run_dispute_letter_agent", "run_compliance_agent"]
GROUP_3_STAGES = ["compilation", "citations", "dispute_letter", "compliance"]

def all_stages_complete(stages, stage_list):
    """Checks if all stages in a given list are marked 'complete'."""
    return all(stages.get(s) == 'complete' for s in stage_list)

def dispatch_agents(agents, file_id, uid, parsed_text_path):
    """Publishes a message to the 'run-agent' topic for each agent in a list."""
    log_prefix = f"[{file_id}]"
    logging.info(f"{log_prefix} Dispatching agents for user '{uid}': {agents}")

    for agent_name in agents:
        try:
            logging.info(f"{log_prefix} Publishing task for agent: {agent_name}...")
            message_to_publish = {
                "fileId": file_id,
                "uid": uid,
                "parsedTextPath": parsed_text_path,
                "agentName": agent_name
            }
            message_bytes = json.dumps(message_to_publish).encode('utf-8')
            
            future = get_publisher().publish(run_agent_topic_path, data=message_bytes)
            future.result() # Ensures the message is sent
            
            logging.info(f"{log_prefix} Successfully dispatched '{agent_name}'.")

        except Exception as e:
            logging.error(f"{log_prefix} Failed to dispatch '{agent_name}': {e}", exc_info=True)

@on_document_updated(document="reports/{fileId}")
def analysis_dispatcher_v2(event: Change):
    """
    Triggered by updates to a report document. Orchestrates the entire analysis pipeline
    by dispatching agents in the correct order based on dependencies.
    """
    file_id = event.params['fileId']
    
    before_data = event.data.before.to_dict()
    after_data = event.data.after.to_dict()
    
    before_stages = before_data.get("stages", {})
    after_stages = after_data.get("stages", {})

    if before_stages == after_stages:
        return

    if after_data.get("status") == "complete":
        return

    uid = after_data.get("uid")
    parsed_text_path = after_data.get("parsedTextPath")
    log_prefix = f"[{file_id}]"

    if after_stages.get("parsing") == "complete" and before_stages.get("parsing") != "complete":
        logging.info(f"{log_prefix} Parsing complete. Dispatching Group 1 agents: {GROUP_1_AGENTS}")
        dispatch_agents(GROUP_1_AGENTS, file_id, uid, parsed_text_path)
        return

    if all_stages_complete(after_stages, GROUP_1_STAGES) and not all_stages_complete(before_stages, GROUP_1_STAGES):
        logging.info(f"{log_prefix} Group 1 complete. Dispatching Group 2 agents: {GROUP_2_AGENTS}")
        dispatch_agents(GROUP_2_AGENTS, file_id, uid, parsed_text_path)
        return

    if all_stages_complete(after_stages, GROUP_2_STAGES) and not all_stages_complete(before_stages, GROUP_2_STAGES):
        logging.info(f"{log_prefix} Group 2 complete. Dispatching Group 3 agents: {GROUP_3_AGENTS}")
        dispatch_agents(GROUP_3_AGENTS, file_id, uid, parsed_text_path)
        return

# --- Function 4: Agent Executor ---

def run_property_info_agent(analysis_context):
    """Extracts structured property information from the text."""
    file_id = analysis_context['file_id']
    parsed_text = analysis_context['parsed_text']
    logging.info(f"[{file_id}] Running property_info_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = "..." # (prompt from original implementation)
    response = model.generate_content(f"{prompt}\n\n--- Appraisal Text ---\n{parsed_text}")
    try:
        clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
        return json.loads(clean_response)
    except (json.JSONDecodeError, AttributeError) as e:
        logging.error(f"[{file_id}] Failed to parse JSON from property_info_agent: {e}")
        return {"error": "Failed to extract property information."}

def run_sales_comp_agent(analysis_context):
    """Extracts the sales comparison approach data grid."""
    file_id = analysis_context['file_id']
    parsed_text = analysis_context['parsed_text']
    logging.info(f"[{file_id}] Running sales_comp_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = """
    You are a highly accurate data extraction agent. From the following "Sales Comparison Approach" text, extract the structured data for the **Subject Property** and all **Comparable Sales**.
    **JSON Schema:**
    Your output **MUST** be a single, valid JSON object conforming to this schema:
    ```json
    {
      "subject_property": { "gla_sqft": <number>, "lot_size_sqft": <number>, "sale_price": <number> },
      "comparables": [
        {
          "id": <number>, "address": "<string>", "distance_to_subject_miles": <number>, "sale_price": <number>, "sale_date": "<string>", "gla_sqft": <number>, "lot_size_sqft": <number>,
          "adjustments": { "location": <number>, "site": <number>, "view": <number>, "design_appeal": <number>, "quality": <number>, "age": <number>, "condition": <number>, "gla": <number>, "basement": <number>, "garage_carport": <number>, "porch_patio_deck": <number> },
          "net_adjustment_total": <number>, "adjusted_sale_price": <number>
        }
      ],
      "sales_comparison_value": <number>
    }
    ```
    **Instructions:**
    1. Your output MUST be a single, valid JSON object and nothing else.
    2. If a value is not present, use `null`.
    """
    response = model.generate_content(f"{prompt}\n\n--- Appraisal Text ---\n{parsed_text}")
    try:
        clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
        return json.loads(clean_response)
    except (json.JSONDecodeError, AttributeError) as e:
        logging.error(f"[{file_id}] Failed to parse JSON from sales_comp_agent: {e}")
        return {"error": "Failed to extract sales comparison data."}

def run_qualitative_analysis(analysis_context):
    """Performs a qualitative analysis of the appraisal narrative."""
    file_id = analysis_context['file_id']
    parsed_text = analysis_context['parsed_text']
    logging.info(f"[{file_id}] Running qualitative_analysis_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = """
    You are a **Senior Appraisal Reviewer**. Your task is to conduct a qualitative analysis of the provided appraisal text.
    **Analysis Directives:**
    1.  **Identify Flaws:** Scrutinize the text for logical fallacies, unsupported conclusions, and inconsistencies.
    2.  **Detect Bias:** Look for subtle language or patterns that could indicate bias.
    3.  **Assess Professionalism:** Evaluate the overall quality of the narrative.
    **Output Structure:**
    Provide your analysis as a JSON array of strings. Each string should be a single, concise sentence.
    Example: `["The report uses boilerplate language.", "The adjustments for the comparables are not well-supported."]`
    """
    response = model.generate_content(f"{prompt}\n\n--- Appraisal Text ---\n{parsed_text}")
    try:
        clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
        return json.loads(clean_response)
    except (json.JSONDecodeError, AttributeError) as e:
        logging.error(f"[{file_id}] Failed to parse JSON from qualitative_analysis_agent: {e}")
        return ["Error generating qualitative analysis."]

def run_red_flag_agent(analysis_context):
    """Identifies red flags based on predefined rules and structured data."""
    file_id = analysis_context['file_id']
    structured_data = analysis_context.get('structured_data', {})
    logging.info(f"[{file_id}] Running red_flag_agent...")
    if not structured_data or "error" in structured_data:
        logging.warning(f"[{file_id}] Skipping Red Flag agent due to missing or invalid structured data.")
        return []
    rules = {"excessive_net_adjustment": {"rule_name": "Excessive Net Adjustments", "status": "Not Matched", "details": ""}}
    comparables = structured_data.get('comparables', [])
    for i, comp in enumerate(comparables, 1):
        sale_price = comp.get('sale_price')
        if not isinstance(sale_price, (int, float)) or sale_price == 0: continue
        net_adjustment = comp.get('net_adjustment_total', 0)
        if abs(net_adjustment) > (0.05 * sale_price):
            rules['excessive_net_adjustment']['status'] = 'Flagged'
            rules['excessive_net_adjustment']['details'] += f"Comp {i}, "
    logging.info(f"[{file_id}] Red Flag agent completed.")
    return list(rules.values())

def run_dollar_impact_agent(analysis_context):
    """Estimates the financial impact of the identified issues."""
    file_id = analysis_context['file_id']
    logging.info(f"[{file_id}] Running dollar_impact_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = f"""
    You are a **Forensic Accountant**. Based on the provided structured data and qualitative findings, estimate the potential financial impact.
    **Input:**
    - Structured Data: {json.dumps(analysis_context.get('structured_data', {}), indent=2)}
    - Qualitative Findings: {json.dumps(analysis_context.get('qualitative_analysis_findings', []), indent=2)}
    **Output:**
    Provide your analysis as a JSON object with "estimated_impact_range": [<number>, <number>], "summary_of_impact": "<string>", and "key_contributing_factors": ["<string>"].
    """
    response = model.generate_content(prompt)
    try:
        clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
        return json.loads(clean_response)
    except (json.JSONDecodeError, AttributeError) as e:
        logging.error(f"[{file_id}] Failed to parse JSON from dollar_impact_agent: {e}")
        return {"error": "Failed to generate dollar impact analysis."}

def run_compilation_agent(analysis_context):
    """Compiles the executive summary and strategic recommendations."""
    file_id = analysis_context['file_id']
    logging.info(f"[{file_id}] Running compilation_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = f"""
    You are a **Lead Appraisal Analyst**. Synthesize the findings into a coherent summary.
    **Input:**
    - Qualitative Findings: {json.dumps(analysis_context.get('qualitative_analysis_findings', []), indent=2)}
    **Output:**
    Provide your analysis as a JSON object with "executive_summary": "<string>" and "strategic_recommendations": ["<string>"].
    """
    response = model.generate_content(prompt)
    try:
        clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
        return json.loads(clean_response)
    except (json.JSONDecodeError, AttributeError) as e:
        logging.error(f"[{file_id}] Failed to parse JSON from compilation_agent: {e}")
        return {"error": "Failed to generate compilation."}

def run_citation_agent(analysis_context):
    """Finds legal or statutory citations for red flags."""
    file_id = analysis_context['file_id']
    red_flags = analysis_context.get('red_flags', [])
    logging.info(f"[{file_id}] Running citation_agent...")
    cited_flags = []
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    for flag in red_flags:
        if flag.get('status') != 'Flagged': continue
        prompt = f"""
        You are a **Paralegal**. For the following red flag, provide a specific legal or statutory citation it may violate (e.g., USPAP, Fannie Mae Selling Guide).
        **Red Flag:** {json.dumps(flag)}
        **Output:**
        Provide your analysis as a JSON object with "citation": "<string>" and "explanation": "<string>".
        """
        response = model.generate_content(prompt)
        try:
            clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
            citation_data = json.loads(clean_response)
            cited_flags.append({"flag": flag, "citation": citation_data})
        except (json.JSONDecodeError, AttributeError):
            cited_flags.append({"flag": flag, "citation": {"error": "Failed to generate citation."}})
    return cited_flags

def run_dispute_letter_agent(analysis_context):
    """Generates a draft of the dispute letter."""
    file_id = analysis_context['file_id']
    logging.info(f"[{file_id}] Running dispute_letter_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = f"""
    You are the **borrower**. Write a formal Reconsideration of Value letter based on the provided information.
    **Key Issues:** {json.dumps(analysis_context.get('citations', []), indent=2)}
    **Property Info:** {json.dumps(analysis_context.get('property_info', {}), indent=2)}
    **Appraised Value:** {analysis_context.get('structured_data', {}).get('sales_comparison_value')}
    **Instructions:**
    - Write a firm, evidence-based letter.
    - Do not suggest an alternative value.
    - Keep it concise.
    **Output:**
    Return only the text of the letter as a single string.
    """
    response = model.generate_content(prompt)
    return response.text

def run_compliance_agent(analysis_context):
    """Reviews the generated dispute letter for compliance."""
    file_id = analysis_context['file_id']
    logging.info(f"[{file_id}] Running compliance_agent...")
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    prompt = f"""
    You are a **Compliance Agent**. Review the following dispute letter and provide a strength score and feedback.
    **Letter:** {analysis_context.get('dispute_letter', '')}
    **Output:**
    Provide your analysis as a JSON object with "dispute_strength_score": <number>, "strengths": ["<string>"], and "weaknesses": ["<string>"].
    """
    response = model.generate_content(prompt)
    try:
        clean_response = re.sub(r'^```json\s*|\s*```$', '', response.text.strip())
        return json.loads(clean_response)
    except (json.JSONDecodeError, AttributeError) as e:
        logging.error(f"[{file_id}] Failed to parse JSON from compliance_agent: {e}")
        return {"error": "Failed to generate compliance review."}

AGENT_MAP = {
    "run_property_info_agent": (run_property_info_agent, "property_info", ["parsed_text"]),
    "run_sales_comp_agent": (run_sales_comp_agent, "structured_data", ["parsed_text"]),
    "run_qualitative_analysis": (run_qualitative_analysis, "qualitative_analysis_findings", ["parsed_text"]),
    "run_red_flag_agent": (run_red_flag_agent, "red_flags", ["structured_data"]),
    "run_dollar_impact_agent": (run_dollar_impact_agent, "dollar_impact", ["structured_data", "qualitative_analysis_findings"]),
    "run_compilation_agent": (run_compilation_agent, "compilation", ["qualitative_analysis_findings"]),
    "run_citation_agent": (run_citation_agent, "citations", ["red_flags"]),
    "run_dispute_letter_agent": (run_dispute_letter_agent, "dispute_letter", ["cited_red_flags", "property_info", "structured_data"]),
    "run_compliance_agent": (run_compliance_agent, "compliance", ["dispute_letter"])
}

@on_message_published(topic="run-agent")
def agent_executor_v2(event):
    """
    Triggered by a message on 'run-agent'. Fetches necessary data,
    then executes the specified agent.
    """
    try:
        message_data = json.loads(base64.b64decode(event.data.message["data"]).decode('utf-8'))
        file_id = message_data['fileId']
        agent_name = message_data['agentName']
        parsed_text_path = message_data['parsedTextPath']
    except (json.JSONDecodeError, KeyError) as e:
        logging.error(f"Failed to parse Pub/Sub message: {e}", exc_info=True)
        return

    if agent_name not in AGENT_MAP:
        logging.error(f"[{file_id}] Unknown agent requested: {agent_name}")
        return

    agent_function, firestore_field, dependencies = AGENT_MAP[agent_name]
    report_ref = get_db().collection('reports').document(file_id)
    log_prefix = f"[{file_id}][{agent_name}]"
    
    try:
        logging.info(f"{log_prefix} Updating stage to 'running'.")
        report_ref.set({'stages': {firestore_field: 'running'}}, merge=True)

        logging.info(f"{log_prefix} Fetching report document for dependencies: {dependencies}")
        report_doc = report_ref.get()
        if not report_doc.exists:
            raise FileNotFoundError(f"Report document {file_id} not found.")
        report_data = report_doc.to_dict()
        logging.info(f"{log_prefix} Report document fetched successfully.")

        analysis_context = {"file_id": file_id}
        for dep in dependencies:
            if dep == "parsed_text":
                logging.info(f"{log_prefix} Downloading parsed text from '{parsed_text_path}'...")
                blob = get_storage_client().blob(parsed_text_path)
                analysis_context["parsed_text"] = blob.download_as_string().decode('utf-8')
                logging.info(f"{log_prefix} Parsed text downloaded.")
            else:
                analysis_context[dep] = report_data.get(dep)
        
        logging.info(f"{log_prefix} Executing agent function...")
        result = agent_function(analysis_context)
        logging.info(f"{log_prefix} Agent execution complete.")

        logging.info(f"{log_prefix} Saving result to Firestore field '{firestore_field}'...")
        report_ref.set({firestore_field: result}, merge=True)
        
        logging.info(f"{log_prefix} Updating stage to 'complete'.")
        report_ref.set({'stages': {firestore_field: 'complete'}}, merge=True)
        logging.info(f"{log_prefix} Agent processing finished successfully.")

    except Exception as e:
        logging.error(f"{log_prefix} An error occurred: {e}", exc_info=True)
        report_ref.set({
            'stages': {firestore_field: 'failed'},
            'error_message': f"Agent '{agent_name}' failed: {str(e)}"
        }, merge=True)

    return

# --- Function 5: Report Compiler ---
@on_document_updated(document="reports/{fileId}")
def report_compiler_v2(event: Change):
    """
    Triggered by updates to a report document. When all analysis stages are complete,
    this function marks the entire report as 'complete'.
    """
    file_id = event.params['fileId']
    
    after_data = event.data.after.to_dict()
    stages = after_data.get("stages", {})
    log_prefix = f"[{file_id}]"

    if after_data.get("status") == "complete":
        logging.info(f"{log_prefix} Report already marked as complete. Ignoring update.")
        return

    if all_stages_complete(stages, GROUP_1_STAGES + GROUP_2_STAGES + GROUP_3_STAGES):
        logging.info(f"{log_prefix} All analysis stages are complete. Finalizing report.")
        
        report_ref = get_db().collection('reports').document(file_id)
        try:
            report_ref.set({
                'status': 'complete',
                'finalized_timestamp': firestore.SERVER_TIMESTAMP
            }, merge=True)
            logging.info(f"{log_prefix} Report has been successfully marked as complete.")
        except Exception as e:
            logging.error(f"{log_prefix} Failed to mark report as complete: {e}", exc_info=True)
    
    return
