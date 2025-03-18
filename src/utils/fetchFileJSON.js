const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
const sasToken = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN;

const fetchFileJSON = async (containerName, fileName) => {
  try {
    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;

    const response = await fetch(blobUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching file from Azure:", error);
    throw error;
  }
};

export default fetchFileJSON;
