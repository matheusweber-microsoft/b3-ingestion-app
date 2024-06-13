# Introduction

The Documents Ingestion application is built using a standard client/server architecture. The Frontend application is a Javascript written using React and Typescript, the backend API is built using Python Quart framework, the data gets stored in a simple NoSQL MongoDB. The purpose of this application is to allow B3 users who authorized to access it to manage the data sources of the AI assistant and organize the data ingested into various themes.
 
Please refer to the following section for more information on how to deploy the application

## Deploying the Documents Ingestion Application to AKS

The Documents Ingestion Application is deployed on 2 different containers, one container hosts the backend API, and another container hosts the Frontend UI. Two docker images to be created and pushed to Azure Container Registry before deploying them to AKS cluster.

To build the two image and push them to ACR from a developer machine which has access to the code, we can do the following using PowerShell:

```PS
$RESOURCE_GROUP="azr-rg-tech-ia-b3gpt-dev-n"
$ACR_NAME="azracrtechian"
$FE_APPNAME= "ingestion-fe"
$API_APPNAME ="ingestion-api"
$AKS_CLUSTER="azr-aks-tech-ia-n"

#Build and push the backend API image
cd <local path>\ti-ea-ingestion-b3gpt\api
az acr build --registry $ACR_NAME --image "$($API_APPNAME):latest" --file 'dockerfile' .

#Build and push the frontend UI image
cd <local path>\ti-ea-ingestion-b3gpt\frontend
az acr build --registry $ACR_NAME --image "$($FE_APPNAME):latest" --file 'dockerfile' .
```

Once the images are built and pushed to ACR, we can deploy the two containers using the `deployment` yaml files which exists in the directory `deploy`

To deploy the backend API, you can run the below command:
```
kubectl apply -f "deploy/api-deployment.yml" -n copilotob3gpt
```

To deploy the frontend UI, you can run the below command:
```
kubectl apply -f "deploy/fe-deployment.yml" -n copilotob3gpt
```

## Environment variables
The two container relies on the following environment variables for its configuration:

### Backend API variables
- `MONGODB_CONN_STRING`: The MongoDB connection string, this value is obtained from Azure Key Vault as a secret reference using Container Storage Interface for secret stores.
- `AZURE_STORAGE_ACCOUNT_CONN_STRING`: The Azure Storage Account connection string, this value is obtained from Azure Key Vault as a secret reference using Container Storage Interface for secret stores.
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: The Application Insights connection string, this value is obtained from Azure Key Vault as a secret reference using Container Storage Interface for secret stores.
- `DATABASE_NAME`: The MongoDB database name which documents ingestion application store documents metadata into.
- `DOCUMENTS_QUEUE`: The Azure Storage Queue name which used to receive messages published from the documents ingestion application
- `TENANT_ID`: The Azure Tenant ID used for authentication Entra ID users
- `MSAL_API_AUDIENCE`: The API audience (defines the intended consumer of the token)
- `MSAL_CLIENT_ID`: The Client ID of the application named `B3 | Copilot B3GPT` registered into Entra ID
- `MSAL_ISSUER`: The named system that provides identity and API access


### Frontend UI variables
- `VITE_BACKEND_API_URL`: The backend URI for the Ingestion API
- `VITE_MSAL_CLIENT_ID`: The Client ID of the application named `B3 | Copilot B3GPT` registered into Entra ID
- `VITE_MSAL_AUTHORITY`: The authority parameter indicates the URL to request tokens from
- `VITE_MSAL_REDIRECT_URI`: The redirect URI which used to send the token to the app. This redirect URI is registered with the Microsoft Entra application.
- `VITE_MSAL_SCOPE`: The permission allowed for the API
- `VITE_DOCUMENTS_LANGUAGE`: For future use if documents are in languages other than Portuguese are used. Default value is `port`
