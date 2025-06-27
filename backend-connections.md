# Appraise Backend Connection Guide

This document outlines the critical connection points between the Next.js frontend and the Python/Flask backend. It serves as the single source of truth for API contracts and data structures.

---

## 1. Authentication

- **Method:** Firebase Authentication (Client-Side SDK)
- **Requirement:** All authenticated requests to the backend **MUST** include a Firebase ID token.
- **Implementation:**
  1. The frontend uses the Firebase Auth SDK to sign in/sign up the user.
  2. On successful login, the frontend retrieves the user's ID token using `user.getIdToken()`.
  3. This token is sent in the `Authorization` header for all API calls.
  - **Format:** `Authorization: Bearer <ID_TOKEN>`

---

## 2. API Endpoints

### File Upload & Analysis Initiation

This is the primary endpoint for starting the appraisal analysis.

- **Endpoint:** `POST /api/upload`
- **Description:** Accepts a PDF file and user data, uploads it to Cloud Storage, and triggers the asynchronous multi-agent analysis pipeline.
- **Request Body:** `multipart/form-data`

| Field Name      | Type   | Required | Description                                           |
| --------------- | ------ | -------- | ----------------------------------------------------- |
| `file`          | File   | Yes      | The user's appraisal report. Must be a PDF. Max 15MB. |
| `expectedValue` | String | Yes      | The property value the user expects.                   |
| `fullName`      | String | Yes      | The user's full name, used for the dispute letter.    |

- **Headers:**
  - `Authorization: Bearer <ID_TOKEN>` (Required)

- **Success Response (200 OK):**
  - A JSON object confirming the process has started. The `fileId` is crucial for the frontend to listen for real-time updates.
  ```json
  {
    "message": "File uploaded successfully, analysis started.",
    "fileId": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
  }
  ```

- **Error Responses:**
  - `400 Bad Request`: Missing file, invalid file type, or file too large.
  - `401 Unauthorized`: Invalid or missing Firebase ID token.
  - `500 Internal Server Error`: General server-side error.

---

## 3. Real-Time Data Streaming (Firestore)

Once a file is uploaded, the frontend **MUST** listen for real-time updates from Firestore to display the live analysis progress.

- **Service:** Cloud Firestore
- **Collection:** `reports`
- **Document ID:** The `fileId` received from the `/api/upload` endpoint.

### Listening for Updates

The frontend should attach a real-time listener to the specific report document:
`onSnapshot(doc(db, "reports", fileId), (doc) => { ... });`

### Report Document Schema

The document will be populated with new fields as the agentic pipeline runs. The frontend should be prepared to render UI components based on the presence and content of these fields.

```javascript
{
  // --- Initial Data ---
  "uid": "string", // User's Firebase UID
  "fileId": "string", // The document's ID
  "timestamp": "Timestamp", // Firestore server timestamp
  "expected_value": "string",
  "email": "string",
  "fullName": "string",

  // --- Agent 1: Data Extraction ---
  "property_info": {
    "Property Address": "string",
    "Neighborhood Name": "string",
    "County": "string",
    "City": "string"
  },
  "structured_data": { /* ... complex object with comps data ... */ },

  // --- Agent 2: Red Flag Analysis ---
  "red_flags": [
    {
      "rule_name": "string", // e.g., "Outdated Comparables"
      "status": "string", // "Flagged" or "Not Matched"
      "details": "string" // Explanation
    }
  ],

  // --- Agent 3: Qualitative Review ---
  "qualitative_analysis_findings": [
    "string", // "The report's narrative appears to rely on boilerplate language..."
    "string"
  ],

  // --- Agent 4: Financial Impact ---
  "dollar_impact_summary": {
    "estimated_impact_range": [ "number", "number" ],
    "summary_of_impact": "string",
    "key_contributing_factors": [ "string", "string" ]
  },

  // --- Agent 5: Legal Citation ---
  "cited_red_flags": [
    {
      "flag": { /* ... a red_flag object ... */ },
      "citation": "string", // e.g., "USPAP Standards Rule 1-1(a)"
      "explanation": "string"
    }
  ],

  // --- Agent 6: Final Synthesis ---
  "executive_summary": "string",
  "strategic_recommendations": [ "string", "string" ],

  // --- Agent 7: Dispute Letter & Compliance ---
  "dispute_letter": "string", // The full text of the generated letter
  "compliance_review": {
    "dispute_strength_score": "number", // 1-10
    "strengths": [ "string" ],
    "weaknesses": [ "string" ]
  }
}