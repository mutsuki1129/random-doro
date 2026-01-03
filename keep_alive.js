const express = require('express');
const server = express();
// Render 會透過環境變數提供 PORT，預設通常是 10000
const PORT = process.env.PORT || 3000; 

server.all('/', (req, res) => {
  res.send('Doro Bot is alive and running on Render!');
});

function keepAlive() {
  server.listen(PORT, () => {
    console.log(`伺服器已準備就緒，監聽連接埠：${PORT}`);
  });
}

module.exports = keepAlive;
