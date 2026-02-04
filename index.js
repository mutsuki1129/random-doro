// index.js (搬家前的原始穩定版)
const keepAlive = require('./keep_alive');
require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch'); // 請確認使用的是 node-fetch@2

const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const DORO_API_URL = 'https://www.doro.asia/api/random-sticker';

// 檢查 Token 是否存在
if (!DISCORD_TOKEN) {
    console.error("錯誤：找不到 DISCORD_TOKEN。請檢查您的環境變數。");
    process.exit(1); 
}

const client = new Client({ 
    // 斜線指令基本只需要 Guilds
    intents: [GatewayIntentBits.Guilds] 
});

client.on('ready', () => {
    console.log(`機器人已上線為 ${client.user.tag}!`);
    console.log("請確保您已運行 deploy-commands.js 來註冊斜線指令！");
});

// 📌 核心邏輯：監聽指令互動
client.on('interactionCreate', async interaction => {
    // 檢查互動是否為斜線指令
    if (!interaction.isChatInputCommand()) return;

    // 檢查指令名稱是否為 doro
    if (interaction.commandName === 'doro') {
        
        // 1. 延遲回覆 (Defer Reply)：防止 3 秒超時
        await interaction.deferReply(); 

        try {
            // 2. 調用 Doro API 獲取隨機貼圖
            const response = await fetch(DORO_API_URL);
            const data = await response.json();

            // 3. 檢查 API 響應是否成功
            if (data.success && data.sticker && data.sticker.url) {
                const stickerUrl = data.sticker.url;
                const description = data.sticker.description || "隨機 Doro 表情包";
                
                const embed = new EmbedBuilder()
                    .setTitle('💖 隨機 Doro 出現！')
                    .setDescription(`描述: ${description}`)
                    .setColor(0xFFA07A) 
                    .setImage(stickerUrl)
                    .setTimestamp();
                
                // 4. 使用 editReply 發送結果
                await interaction.editReply({ embeds: [embed] });

            } else {
                // 處理 API 回傳失敗
                await interaction.editReply('Oops! 無法獲取 Doro 表情包數據。請稍後再試。');
            }
        } catch (error) {
            console.error('調用 Doro API 發生錯誤:', error);
            // 處理連線錯誤
            await interaction.editReply('🥺 對不起，連線到 Doro 伺服器時發生了錯誤。');
        }
    }
});

// 啟動 Keep Alive 伺服器
keepAlive();

// 登入 Discord
client.login(DISCORD_TOKEN);