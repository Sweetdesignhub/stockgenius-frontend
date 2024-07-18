import { S3Client } from "@aws-sdk/client-s3";

//S3 client with environment credentials
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION_INDIA,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID_INDIA,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY_INDIA,
  },
});

export { s3Client };

// import { S3Client } from "@aws-sdk/client-s3";
// import { store } from "../../redux/store";

// let s3Client;

// const setupS3Client = (region) => {
//   let awsRegion;
//   let credentials;

//   // Set AWS region and credentials based on the region
//   switch (region) {
//     case "india":
//       awsRegion = import.meta.env.VITE_AWS_REGION_INDIA;
//       credentials = {
//         accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID_INDIA,
//         secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY_INDIA,
//       };
//       break;
//     case "usa":
//       awsRegion = import.meta.env.VITE_AWS_REGION_USA;
//       credentials = {
//         accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID_USA,
//         secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY_USA,
//       };
//       break;
//     default:
//       throw new Error("Unsupported region");
//   }

//   s3Client = new S3Client({
//     region: awsRegion,
//     credentials,
//   });
// };

// // const initialRegion = localStorage.getItem("region") || "india";
// // console.log('initialRegion', initialRegion);
// // setupS3Client(initialRegion);

// const initialRegion = store.getState().region;
// console.log("initialRegion", initialRegion);
// setupS3Client(initialRegion);

// // Function to update S3 client based on region change
// const updateS3Client = (newRegion) => {
//   setupS3Client(newRegion);
// };

// export { s3Client, setupS3Client, updateS3Client };
