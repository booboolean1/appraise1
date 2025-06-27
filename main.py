import os
import firebase_admin
from firebase_admin import credentials, storage, auth, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import uuid
import threading
from analysis import analyze_document

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': "gen-lang-client-0518678225.firebasestorage.app"
    })
except Exception as e:
    print(f"FATAL: Failed to initialize Firebase: {e}")
    # Optionally, re-raise the exception if you want the app to stop
    # raise e

# Configure Google Generative AI
genai.configure(api_key=os.getenv("LLM_API_KEY"))

@app.route("/")
def index():
    return "Backend is running."

@app.route("/api/upload", methods=['POST'])
def upload_file():
    try:
        # 1. Extract and verify Firebase ID token
        id_token = request.headers.get('Authorization').split('Bearer ')[1]
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email') # Get user's email

        # 2. File Handling
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Invalid file type, only PDF is allowed."}), 400
        
        # 15MB size limit
        if len(file.read()) > 15 * 1024 * 1024:
            return jsonify({"error": "File size exceeds 15MB limit."}), 400
        
        file.seek(0)


        # 3. Generate unique fileId
        fileId = str(uuid.uuid4())

        # 4. Upload to Firebase Storage
        bucket = storage.bucket()
        blob = bucket.blob(f"{uid}/{fileId}.pdf")
        
        blob.upload_from_file(file, content_type='application/pdf')

        # 5. Create Initial Firestore Document
        db = firestore.client()
        report_ref = db.collection('reports').document(fileId)
        report_ref.set({
            'uid': uid,
            'name': file.filename,
            'status': 'processing',
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        # 6. Start analysis in a separate thread
        expected_value = request.form.get('expectedValue')
        fullName = request.form.get('fullName')
        analysis_thread = threading.Thread(target=analyze_document, args=(fileId, uid, expected_value, email, fullName))
        analysis_thread.start()

        # 7. Return Success Response
        return jsonify({
            "message": "File uploaded successfully, analysis started.",
            "fileId": fileId
        }), 200

    except auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid ID token"}), 401
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)), debug=True)
