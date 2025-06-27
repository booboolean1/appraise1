Hello, Roo.

We are starting a new session to build a robust, event-driven backend for our appraisal analysis application. The complete architectural plan and context can be found in the `new-backend-architecture.md` file in the root directory.

**Your first task is to begin the implementation of this new architecture.**

Please proceed with **Step 1** of the "Implementation Plan" outlined in the `new-backend-architecture.md` document: **Setup**.

This involves:
1.  Deleting the old, monolithic `analyze_document_on_upload` Cloud Function to ensure a clean slate.
2.  Creating the three necessary Pub/Sub topics: `pdf-uploaded`, `text-extracted`, and `run-agent`.

Please start by deleting the function.