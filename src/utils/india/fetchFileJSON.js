import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./aws";

const fetchFileJSON = async (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    const bodyContents = await streamToText(data.Body);
    return JSON.parse(bodyContents); // Parse the JSON content
  } catch (error) {
    console.error("Error fetching the file:", error);
    throw error;
  }
};

const streamToText = async (stream) => {
  const reader = stream.getReader();
  let text = '';
  let done, value;

  while ((({ done, value } = await reader.read()), !done)) {
    text += new TextDecoder().decode(value);
  }

  return text;
};

export default fetchFileJSON;
