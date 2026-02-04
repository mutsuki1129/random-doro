const keepAlive = require('./keep_alive');
// index.js (更新版)
require('dotenv').config();
// 引入所需的元件
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch'); // 確保 node-fetch@2 已安裝

const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const DORO_API_URL = 'https://www.doro.asia/api/random-sticker';

if (!DISCORD_TOKEN) {
    console.error("錯誤：找不到 DISCORD_TOKEN。請檢查您的 .env 檔案。");
    process.exit(1); 
}

const client = new Client({ 
    // 斜線指令只需要 Guilds 意圖
    intents: [GatewayIntentBits.Guilds] 
});

client.on('ready', () => {
    console.log(`機器人已上線為 ${client.user.tag}!`);
    // 💡 可以在這裡提醒用戶運行 deploy-commands.js
    console.log("請確保您已運行 deploy-commands.js 來註冊斜線指令！");
});

// 移除 messageCreate 監聽器

// 📌 核心變更：監聽 interactionCreate 事件
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'doro') {
        // 🚀 偵測點 A: 確認有收到互動
        console.log(`收到來自 ${interaction.user.tag} 的 /doro 指令！`);

        await interaction.deferReply(); 

        try {
            console.log("正在請求 Doro API..."); // 🚀 偵測點 B
            const response = await fetch(DORO_API_URL);
            
            if (!response.ok) {
                console.log(`API 回應失敗，狀態碼: ${response.status}`);
                return await interaction.editReply('API 暫時沒有回應，Doro 正在休息。');
            }

            const data = await response.json();
            console.log("API 數據獲取成功！"); // 🚀 偵測點 C

            if (data.success && data.sticker && data.sticker.url) {
                // ... 原本的 Embed 邏輯 ...
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.editReply('Oops! 數據格式錯誤。');
            }
        } catch (error) {
            console.error('❌ 發生錯誤:', error); // 🚀 偵測點 D
            await interaction.editReply('🥺 發生內部錯誤。');
        }
    }
});

keepAlive();
client.login(DISCORD_TOKEN);

