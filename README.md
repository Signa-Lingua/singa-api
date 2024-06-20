## Singa API

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

1. You have a Google Cloud Platform account and have installed the Google Cloud SDK on your local machine.
2. You have enabled the Cloud Run, Artifact Registry, and Cloud Build APIs.
3. You have created a service account to use for the Cloud Run service.
4. You have created a Cloud Storage bucket to store the logs.

<details open>
<summary>Do it manually from local machine</summary>

```sh
gcloud builds submit --substitutions _SERVICE_ACCOUNT=<your-service-account>,_LOGBUCKET=<your-log-bucket-name>
```

</details>

<!-- <details open>
<summary>Do it with Cloud Build trigger</summary>

1. Create a Cloud Build trigger

```sh
gcloud builds triggers create github \
--region=asia-southeast2 \
--repo-name singa-api \
--repo-owner Singa-Lingua \
--branch-pattern=master \
--build-config=cloudbuild.yaml \
--service-account=<your-service-account> \
--include-logs-with-status
```

2. Push the code to the repository

```sh
git push origin <your-branch>
```

</details> -->
