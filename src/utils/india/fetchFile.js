// import { GetObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "./aws";

// const fetchFile = async (bucketName, fileName) => {
//   const params = {
//     Bucket: bucketName,
//     Key: fileName,
//   };

//   try {
//     const data = await s3Client.send(new GetObjectCommand(params));
//     const bodyContents = await streamToArrayBuffer(data.Body);
//     return bodyContents;
//   } catch (error) {
//     console.error("Error fetching the file:", error);
//     throw error;
//   }
// };

// const streamToArrayBuffer = async (stream) => {
//   const reader = stream.getReader();
//   const chunks = [];
//   let done, value;

//   while ((({ done, value } = await reader.read()), !done)) {
//     chunks.push(value);
//   }

//   const arrayBuffer = new Uint8Array(
//     chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
//   ).buffer;
//   return arrayBuffer;
// };

// export default fetchFile;
import { blobServiceClient } from "./azure";

const fetchFile = async (containerName, blobName) => {
  const accountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME;
  const sasToken = import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN;

  if (!accountName || !sasToken) {
    throw new Error("Azure Storage credentials are missing in .env");
  }

  // Ensure the SAS token does not have duplicate '?'
  const formattedSasToken = sasToken.startsWith("?") ? sasToken : `?${sasToken}`;
  const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}${formattedSasToken}`;
  
  // console.log("Fetching from URL:", blobUrl);

  try {
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    // Convert response to ArrayBuffer
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Error fetching the file:", error);
    throw error;
  }
};

export default fetchFile;

