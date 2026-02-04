// index.js (Render 強力除錯版)
const keepAlive = require('./keep_alive');
require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch'); // 確保 package.json 中是 "node-fetch": "^2.6.7"

const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const DORO_API_URL = 'https://www.doro.asia/api/random-sticker';

// 建立機器人客戶端
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// --- 事件監聽 ---

// 當機器人準備就緒時
client.on('ready', () => {
    console.log(`✅✅✅ 成功！機器人已正式上線：${client.user.tag}`);
    console.log("提示：若 Discord 仍無反應，請確認是否運行過 deploy-commands.js");
});

// 監聽斜線指令
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'doro') {
        console.log(`[指令觸發] 來自使用者: ${interaction.user.tag}`);

        // 1. 立即延遲回覆，避免 3 秒超時
        await interaction.deferReply(); 

        try {
            console.log("正在請求 Doro API...");
            const response = await fetch(DORO_API_URL);
            
            if (!response.ok) {
                console.error(`API 錯誤狀態碼: ${response.status}`);
                return await interaction.editReply('🥺 Doro 伺服器暫時沒有回應，請稍後再試。');
            }

            const data = await response.json();

            if (data.success && data.sticker && data.sticker.url) {
                const { url, description } = data.sticker;
                
                const embed = new EmbedBuilder()
                    .setTitle('💖 隨機 Doro 出現！')
                    .setDescription(`**描述:** ${description || "這是一隻神祕的 Doro"}`)
                    .setColor(0xFFA07A) 
                    .setImage(url)
                    .setFooter({ text: 'Doro Asia API' })
                    .setTimestamp();
                
                await interaction.editReply({ embeds: [embed] });
                console.log("✅ Doro 圖片已成功發送");

            } else {
                await interaction.editReply('Oops! 獲取到的數據格式有誤。');
            }
        } catch (error) {
            console.error('❌ 執行指令發生錯誤:', error);
            await interaction.editReply('🥺 處理指令時發生錯誤。');
        }
    }
});

// 捕捉連線錯誤
client.on('error', error => {
    console.error('❌ Discord Client 發生錯誤:', error);
});

// --- 啟動程序 ---

console.log("--- 系統啟動中 ---");

// 1. 啟動 Web Server (為了 Render 存活)
keepAlive();

// 2. 檢查並登入 Discord
console.log("正在檢查 Token 狀態...");
if (!DISCORD_TOKEN || DISCORD_TOKEN.trim() === "") {
    console.error("⛔ [嚴重錯誤] 找不到 DISCORD_TOKEN！");
    console.error("請確認 Render 的 Environment Variables 中 Key 是 'DISCORD_TOKEN' 且 Value 正確。");
} else {
    console.log(`Token 長度檢查: ${DISCORD_TOKEN.length} 字元`);
    console.log("嘗試登入 Discord...");
    
    client.login(DISCORD_TOKEN)
        .then(() => console.log("📡 已送出登入請求..."))
        .catch(err => {
            console.error("❌ 登入失敗！具體原因：", err.message);
        });
}
// ... 以上不變 ...

const loginTimer = setTimeout(() => {
    console.log("⚠️ 登入嘗試超過 15 秒仍無回應，可能是 Token 錯誤或 IP 被暫時封鎖。");
}, 15000);

client.login(DISCORD_TOKEN)
    .then(() => {
        clearTimeout(loginTimer);
        console.log("📡 已送出登入請求...");
    })
    .catch(err => {
        clearTimeout(loginTimer);
        console.error("❌ 登入失敗！具體原因：", err.message);
    });

