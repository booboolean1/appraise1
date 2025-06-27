# New Backend Architecture: Real-Time Appraisal Analysis Engine

## 1. Objective

The primary goal is to re-architect the backend for the appraisal analysis application into a robust, scalable, and resilient system. The new architecture must support real-time progress streaming to the `/dashboard` page, providing a seamless and transparent user experience. It will replace the previous monolithic Cloud Function, which proved difficult to debug and scale.

## 2. Core Requirements

-   **Scalability**: The system must handle multiple concurrent document uploads and analyses without timing out or slowing down.
-   **Resilience**: Errors in one part of the analysis pipeline (e.g., a single agent failing) must not cause the entire process to fail. The system should support automatic retries for transient errors.
-   **Observability**: The status of each step in the analysis pipeline must be clearly visible, both for debugging purposes (logs) and for the end-user (dashboard UI).
-   **Maintainability**: The architecture should be modular, allowing individual components (e.g., analysis agents) to be updated or replaced independently without requiring a full system redeployment.
-   **Real-Time Feedback**: The frontend must receive live updates as the analysis progresses through its various stages.

## 3. Key Technology Choices

-   **Cloud Platform**: Google Cloud Platform (GCP) / Firebase
-   **Compute**: Google Cloud Functions (2nd Gen) - Python 3.11
-   **Database**: Firestore for real-time updates and storing report data.
-   **Storage**: Google Cloud Storage for PDF uploads and storing intermediate artifacts (like parsed text).
-   **Messaging/Eventing**: Google Cloud Pub/Sub to connect the functions and create a resilient, event-driven workflow.
-   **PDF Parsing**: **PyMuPDF4LLM**. This library is chosen over the base `PyMuPDF` because it is specifically designed to convert PDF content into structured Markdown, which is a vastly superior input format for LLMs. This will significantly improve the accuracy and reliability of the data extraction agents.

## 4. Proposed Architecture: The "Analysis Assembly Line"

The new backend will be a distributed system of small, specialized functions connected by Pub/Sub topics. This creates an "assembly line" where each station performs a single, well-defined task.

![Architecture Diagram](https://storage.googleapis.com/gweb-cloudblog-publish/images/event-driven-architecture-example.max-1600x1600.png)
*(Conceptual Diagram: Our implementation will use Cloud Functions instead of Cloud Run, but the event-driven flow is the same.)*

### Function 1: `upload-trigger`
-   **Trigger**: Cloud Storage `on_object_finalized`
-   **Responsibilities**:
    1.  Fires when a new PDF is uploaded by a user.
    2.  Validates the user's authentication context.
    3.  Creates the initial report document in Firestore (`reports/{fileId}`).
    4.  **Crucially, it initializes the `stages` map in the Firestore document**, which the dashboard will listen to for real-time updates.
    5.  Publishes a message containing `{ "fileId": "...", "uid": "..." }` to the `pdf-uploaded` Pub/Sub topic.

### Function 2: `pdf-parser`
-   **Trigger**: Pub/Sub message on the `pdf-uploaded` topic.
-   **Responsibilities**:
    1.  Updates the Firestore document: `stages.parsing = "running"`.
    2.  Downloads the source PDF from Cloud Storage.
    3.  Uses **`PyMuPDF4LLM`** to convert the entire PDF into high-quality Markdown.
    4.  Saves the resulting Markdown to a new file in Cloud Storage (`parsed-text/{fileId}.md`). This is a key optimization to ensure we never parse the same PDF twice.
    5.  Updates Firestore: `stages.parsing = "complete"`.
    6.  Publishes a message with the `fileId` to the `text-extracted` Pub/Sub topic.

### Function 3: `analysis-dispatcher`
-   **Trigger**: Pub/Sub message on the `text-extracted` topic.
-   **Responsibilities**:
    1.  Acts as the "manager" for the analysis phase.
    2.  Reads the list of all required analysis agents (e.g., `property_info`, `red_flags`, `qualitative_analysis`, etc.).
    3.  For each agent, it publishes a *separate* message to the `run-agent` Pub/Sub topic. This message will contain `{ "fileId": "...", "agentName": "property_info" }`. This "fan-out" is what enables parallel processing.

### Function 4: `agent-executor`
-   **Trigger**: Pub/Sub message on the `run-agent` topic.
-   **Configuration**: This function will be configured with a high `maxInstances` value (e.g., 10) to allow for parallel execution.
-   **Responsibilities**:
    1.  Receives a task, e.g., "run `red_flags` agent for `fileId` X".
    2.  Updates Firestore: `stages.red_flags = "running"`.
    3.  Loads the parsed Markdown from `parsed-text/{fileId}.md`.
    4.  Executes *only* the Python logic for the specified agent.
    5.  Saves the agent's output directly to the corresponding field in the Firestore document (e.g., `red_flags: [...]`).
    6.  Updates Firestore: `stages.red_flags = "complete"`.

### Function 5: `report-compiler`
-   **Trigger**: Firestore `onUpdate` for any document in the `reports` collection.
-   **Responsibilities**:
    1.  When triggered, it first inspects the `stages` map in the updated document.
    2.  It checks if all required analysis stages are marked as `"complete"`. If not, it exits immediately.
    3.  If all analysis stages are complete, it updates its own stage: `stages.compiling = "running"`.
    4.  It runs the final agents that depend on all previous outputs (e.g., `run_compilation_agent`, `run_dispute_letter_agent`).
    5.  It saves the final data to the document and sets the overall `status: "complete"`.

## 5. Dashboard Compatibility & Firestore Data Model

This architecture is designed specifically to power the real-time UI in `/dashboard`. The frontend will listen to a specific `report` document in Firestore for live updates.

**Example Firestore Document (`/reports/{fileId}`):**

```json
{
  "uid": "user123",
  "name": "123_Main_St_Appraisal.pdf",
  "status": "processing",
  "timestamp": "2025-06-27T03:30:00Z",
  "stages": {
    "parsing": "complete",
    "property_info": "complete",
    "red_flags": "running",
    "qualitative_analysis": "pending",
    "dollar_impact": "pending",
    "citations": "pending",
    "compilation": "pending",
    "dispute_letter": "pending",
    "compliance": "pending"
  },
  "property_info": {
    "Property Address": "123 Main St",
    "County": "Anytown"
  },
  "red_flags": null,
  "//": "other agent outputs will be populated here"
}
```

The dashboard UI will:
1.  Use the `status` field to show the overall report status (e.g., "Processing", "Complete").
2.  Use the `stages` map to update the status icon and text for each of the 7 agent cards in the timeline.
3.  As each agent completes and populates its data field (e.g., `property_info`), the UI will render the results within the corresponding card.

### Frontend Card to Backend Stage Mapping

To ensure the dashboard UI is perfectly synchronized with the backend, the following mapping will be used:

-   **Card 1: Document Processing & Data Extraction**
    -   This card's status is a composite. It will be "running" if `stages.parsing`, `stages.property_info`, or `stages.sales_comp` is "running". It will be "complete" only when all three are "complete".
-   **Card 2: Identifying Red Flags**
    -   Maps directly to the `stages.red_flags` status.
-   **Card 3: Qualitative Narrative Analysis**
    -   Maps directly to the `stages.qualitative_analysis` status.
-   **Card 4: Estimating Financial Impact**
    -   Maps directly to the `stages.dollar_impact` status.
-   **Card 5: Citing Rules & Regulations**
    -   Maps directly to the `stages.citations` status.
-   **Card 6: Synthesizing Final Report**
    -   Maps directly to the `stages.compilation` status.
-   **Card 7: Generating Your Dispute Letter**
    -   This card's status is a composite. It will be "running" if `stages.dispute_letter` or `stages.compliance` is "running", and "complete" only when both are finished.

## 6. Agent Dependencies & Execution Flow

To maintain logical consistency while enabling parallel execution, the `analysis-dispatcher` and `report-compiler` must respect the following dependency graph.

-   **Group 1 (Run in Parallel First):** These agents only need the parsed Markdown text.
    -   `run_property_info_agent`
    -   `run_sales_comp_agent`
    -   `run_qualitative_analysis`

-   **Group 2 (Run after Group 1 is complete):** These agents depend on the outputs from Group 1.
    -   `run_red_flag_agent` (depends on `structured_data` from `run_sales_comp_agent`)
    -   `run_dollar_impact_agent` (depends on `structured_data` and `qualitative_analysis_findings`)

-   **Group 3 (Run by `report-compiler` after Groups 1 & 2 are complete):** These are the final compilation steps.
    -   `run_compilation_agent` (depends on `qualitative_analysis_findings`)
    -   `run_citation_agent` (depends on `red_flags`)
    -   `run_dispute_letter_agent` (depends on multiple outputs)
    -   `run_compliance_agent` (depends on `dispute_letter`)

The `analysis-dispatcher` will be responsible for triggering Group 1. The `report-compiler` will be responsible for checking for the completion of Group 1 and then triggering Group 2, and so on, until the final report is generated.

## 7. Dashboard Animation Logic

The frontend will implement the following animations based on the real-time data from Firestore:

-   **On Stage Change: `pending` -> `running`**
    -   The border of the corresponding agent card will begin a subtle, pulsing glow effect (e.g., `animate-pulse` with the agent's specific color).
    -   The `Clock` icon will begin a `spin` animation.

-   **On New Output Line**:
    -   The `agent-executor` function will be designed to append findings to the `output` array in Firestore one by one where possible.
    -   The frontend will use a `useEffect` hook that triggers on changes to the `output` array's length.
    -   When a new line is added, it will be animated into view with a "fade-in-up" effect, creating a live, streaming appearance.

-   **On Stage Change: `running` -> `complete`**
    -   The pulsing border animation will stop.
    -   The card will flash its color once brightly.
    -   The spinning `Clock` icon will be replaced by a `CheckCircle` icon, which will appear with a "pop" (scale-up/down) animation.

## 8. Implementation Plan (For Next Session)

1.  **Setup**:
    -   Delete the existing `analyze_document_on_upload` Cloud Function to start fresh.
    -   Create the required Pub/Sub topics: `pdf-uploaded`, `text-extracted`, `run-agent`.
2.  **Directory Structure**:
    -   Create a new directory structure within `functions/` to organize the code for each new function (e.g., `functions/src/upload_trigger`, `functions/src/pdf_parser`, etc.).
    -   Each function directory will have its own `main.py`.
3.  **Function Development (Step-by-Step)**:
    -   Implement and deploy `upload-trigger`.
    -   Implement and deploy `pdf-parser` using `PyMuPDF4LLM`.
    -   Implement and deploy `analysis-dispatcher`.
    -   Implement and deploy the multi-purpose `agent-executor`.
    -   Implement and deploy `report-compiler`.
4.  **Testing**:
    -   After each deployment, test the step by uploading a file and verifying the Firestore updates and Pub/Sub messages.
5.  **Frontend Integration**:
    -   Ensure the `/dashboard` page correctly listens to the new `stages` map in the Firestore document to display real-time progress.