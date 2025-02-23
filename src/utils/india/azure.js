import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_STORAGE_ACCOUNT_NAME = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_SAS_TOKEN = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN; // Use SAS for security

// Initialize BlobServiceClient
const blobServiceClient = new BlobServiceClient(
  `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${AZURE_STORAGE_SAS_TOKEN}`
);

export { blobServiceClient };
