## Singa API

## Tech Used

- AdonisJS
- PostgreSQL
- FFmpeg
- Redis

## API Documentation

[spec.md](./spec.md)

## Setup Instructions

1. Clone this repository

```sh
git clone https://github.com/Signa-Lingua/singa-api.git
```

2. Change directory

```sh
cd singa-api
```

## Build, Push the backend to Artifact Registry and deploy to Cloud Run

### Prerequisites

#### For Google Cloud Environment

1. You have a Google Cloud Platform account, Google Project, and have installed the Google Cloud SDK on your local machine.
2. Setup ADC (Application Default Credentials) on your local machine.

   ```sh
   gcloud auth application-default login
   ```

3. You have created a Postgresql instance on Cloud SQL, and have created a database and user for the application.
4. You have created a Memorystore Redis instance
5. You have created a Google Cloud Storage Bucket to store the logs.
6. You have created a service account to use for the Cloud Run and Cloud Build. It should have the following permission

   <details>
   <summary>Click to expand</summary>

   - Cloud Run Admin
   - Cloud SQL Instance User
   - Secret Manager Secret Accessor
   - Service Account User
   - Storage Object Admin
   - Cloud Build Service Account

   </details>

7. You have created a Cloud Storage bucket to store the logs.

   <details open>
   <summary>Do it manually from gcloud CLI</summary>

   ```sh
   gcloud builds submit --substitutions _VPC_CONNECTOR=<your-vpc-connector>,_SERVICE_ACCOUNT=<your-service-account>,_LOGBUCKET=<your-log-bucket-name>
   ```

   </details>
