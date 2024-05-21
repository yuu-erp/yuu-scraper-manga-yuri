// import express from 'express';
// import fileUpload from 'express-fileupload';
// import cors from 'cors';
// import axios from 'axios';
// import { AppConfigs } from './configs/app.configs';
// import FormData from 'form-data';

// const app = express();

// app.use(
//   fileUpload({
//     limits: { fileSize: 8 * 1024 * 1024 },
//   }),
// );
// app.use(cors());

// app.use(express.urlencoded({ extended: true }));

// const uploadToDiscord = async (file) => {
//   if (!AppConfigs.discord_webhook_url)
//     throw new Error(
//       'Please specify your discord webhook in .env file by "DISCORD_WEBHOOK_URL" key',
//     );

//   const formData = new FormData();

//   if (Array.isArray(file)) {
//     file.forEach((file, index) => {
//       formData.append(`files[${index}]`, file.data, file.name);
//     });
//   } else {
//     formData.append('file', file.data, file.name);
//   }

//   const { data } = await axios.post(AppConfigs.discord_webhook_url, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });

//   if (!data?.attachments?.length) throw new Error('No attachments found');

//   return data?.attachments;
// };

// const urlToFile = async (url) => {
//   const filename = url
//     .substring(url.lastIndexOf('/') + 1)
//     .replace(/((\?|#).*)?$/, '');

//   const response = await axios.get(url, { responseType: 'arraybuffer' });
//   const buffer = Buffer.from(response.data, 'utf-8');

//   return {
//     name: filename,
//     data: buffer,
//   };
// };

// const urlsToFiles = async (url) => {
//   if (Array.isArray(url)) {
//     const promises = url.map((url) => urlToFile(url));

//     return Promise.all(promises);
//   }

//   return urlToFile(url);
// };

// app.get('/', (_, res) => {
//   res.send('Hello World!');
// });

// app.post('/upload', async (req, res) => {
//   try {
//     if (!req.files?.file && !req.body?.url) {
//       res.statusCode = 400;

//       res.json({
//         success: false,
//         error: 'Please specify files or urls',
//       });

//       return;
//     }

//     let attachments = [];

//     if (req.files?.file) {
//       attachments = await uploadToDiscord(req.files.file);
//     } else {
//       const files = await urlsToFiles(req.body.url);

//       attachments = await uploadToDiscord(files);
//     }
//     console.log('attachments: ', {
//       success: true,
//       attachments,
//     });
//     res.json({
//       success: true,
//       attachments,
//     });
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({
//       success: false,
//       error: err.message,
//     });
//   }
// });
// const imageUrl =
//   'https://nchcccl.pro/nettruyen/haite-kudasai-takamine-san/19/1.jpg';
// async function getImageAndUpload(imageUrl) {
//   try {
//     return;
//     // Call the image API
//     const response = await axios.get(imageUrl, {
//       responseType: 'arraybuffer',
//       headers: {
//         'sec-ch-ua':
//           '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
//         Referer: 'https://nettruyencc.com/',
//         'sec-ch-ua-mobile': '?0',
//         'User-Agent':
//           'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
//         'sec-ch-ua-platform': '"macOS"',
//       },
//     });
//     const form = new FormData();
//     const buffer = Buffer.from(response.data, 'binary');
//     const filename = imageUrl.split('/').pop();

//     form.append('file', buffer, filename);

//     const uploadResponse = await axios.post(
//       'http://localhost:3000/upload',
//       form,
//       {
//         headers: {
//           ...form.getHeaders(),
//         },
//       },
//     );

//     console.log('Upload response:', uploadResponse.data);
//   } catch (error) {
//     console.error('Error downloading or uploading image:', error);
//   }
// }

// app.listen(AppConfigs.port, () => {
//   console.log(`Example app listening on port ${AppConfigs.port}`);
// });
// getImageAndUpload(imageUrl);
console.log('CLI Scraper Manga!');
