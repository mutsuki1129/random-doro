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
    // 檢查互動是否為斜線指令
    if (!interaction.isChatInputCommand()) return;

    // 檢查指令名稱是否為 doro
    if (interaction.commandName === 'doro') {
        
        // 1. 延遲回覆 (Defer Reply)：讓使用者知道機器人正在處理請求
        await interaction.deferReply(); 

        try {
            // 2. 調用 API
            const response = await fetch(DORO_API_URL);
            const data = await response.json();

            // 3. 檢查 API 響應
            if (data.success && data.sticker && data.sticker.url) {
                const stickerUrl = data.sticker.url;
                const description = data.sticker.description || "隨機 Doro 表情包";
                
                const embed = new EmbedBuilder()
                    .setTitle('💖 隨機 Doro 出現！')
                    .setDescription(`描述: ${description}`)
                    .setColor(0xFFA07A) 
                    .setImage(stickerUrl)
                    .setTimestamp();
                
                // 4. 使用 editReply 編輯延遲的回覆
                await interaction.editReply({ embeds: [embed] });

            } else {
                // 處理 API 失敗
                await interaction.editReply('Oops! 無法獲取 Doro 表情包數據。請稍後再試。');
            }
        } catch (error) {
            console.error('調用 Doro API 發生錯誤:', error);
            // 處理連線錯誤
            await interaction.editReply('🥺 對不起，連線到 Doro 服務器時發生了錯誤。');
        }
    }
});

keepAlive();
client.login(DISCORD_TOKEN);
