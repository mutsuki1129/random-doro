const express = require('express');
const app = express();

// 關鍵點：Render 會透過環境變數 process.env.PORT 給你一個連接埠
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Doro Bot is Online!');
});

function keepAlive() {
  app.listen(port, () => {
    console.log(`Web Server 正在監聽連接埠： ${port}`);
  });
}

module.exports = keepAlive;
