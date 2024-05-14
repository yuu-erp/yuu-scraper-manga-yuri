import axios from 'axios';
import fs from 'fs';

console.log('CLI Manga Yuri!');

// Đường dẫn đến tập tin để lưu ảnh
const filePath = './utils.png';

// URL của tấm ảnh bạn muốn tải về
const imageUrl = 'https://s135.truyenvua.com/11944/95/29.jpg?gt=hdfgdfg';

// Gọi Axios để tải tấm ảnh về
axios({
  method: 'get',
  url: imageUrl,
  responseType: 'stream', // Đặt responseType thành 'stream' để tải về dưới dạng luồng dữ liệu
  headers: {
    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
    Connection: 'keep-alive',
    Referer: 'https://truyenqqviet.com/',
    'Sec-Fetch-Dest': 'image',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'cross-site',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'sec-ch-ua':
      '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
  },
})
  .then(function (response) {
    // Lưu ảnh vào tập tin
    response.data.pipe(fs.createWriteStream(filePath));
  })
  .catch(function (error) {
    console.error('Error downloading image:', error);
  });
