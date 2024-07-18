import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./aws";

const fetchFile = async (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    const bodyContents = await streamToArrayBuffer(data.Body);
    return bodyContents;
  } catch (error) {
    console.error("Error fetching the file:", error);
    throw error;
  }
};

const streamToArrayBuffer = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];
  let done, value;

  while ((({ done, value } = await reader.read()), !done)) {
    chunks.push(value);
  }

  const arrayBuffer = new Uint8Array(
    chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
  ).buffer;
  return arrayBuffer;
};

export default fetchFile;
