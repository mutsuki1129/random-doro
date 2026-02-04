// index.js (Render 穩定版)
const keepAlive = require('./keep_alive');
require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch'); // 確保已運行 npm install node-fetch@2

const DISCORD_TOKEN = process.env.DISCORD_TOKEN; 
const DORO_API_URL = 'https://www.doro.asia/api/random-sticker';

// 檢查環境變數
if (!DISCORD_TOKEN) {
    console.error("❌ 錯誤：找不到 DISCORD_TOKEN。請在 Render 的 Environment Variables 中設定它。");
    // 不要在這裡退出，讓 Web Server 仍能啟動以便查看 Logs
}

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

// 當機器人準備就緒時
client.on('ready', () => {
    console.log(`✅ 成功！機器人已上線為 ${client.user.tag}!`);
    console.log("💡 提示：若指令未出現，請確保已運行過 node deploy-commands.js 並等待同步。");
});

// 監聽斜線指令
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'doro') {
        console.log(`收到來自 ${interaction.user.tag} 的 /doro 指令`);

        // 1. 立即延遲回覆，避免 3 秒超時
        await interaction.deferReply(); 

        try {
            // 2. 獲取隨機 Doro
            const response = await fetch(DORO_API_URL);
            
            if (!response.ok) {
                console.error(`API 請求失敗: ${response.status}`);
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
                    .setFooter({ text: 'Doro Asia API', iconURL: url })
                    .setTimestamp();
                
                // 3. 回傳結果
                await interaction.editReply({ embeds: [embed] });
                console.log("✅ Doro 已成功送出！");

            } else {
                await interaction.editReply('Oops! 格式解析失敗。');
            }
        } catch (error) {
            console.error('❌ 執行過程發生錯誤:', error);
            await interaction.editReply('🥺 處理指令時發生錯誤，請聯絡開發者。');
        }
    }
});

// 啟動 Web Server (讓 Render 保持 Live)
keepAlive();

// 執行登入並補捉錯誤
console.log("正在嘗試連線至 Discord...");
client.login(DISCORD_TOKEN).catch(err => {
    console.error("❌ 無法登入 Discord。原因：", err.message);
    console.error("請確認您的 Token 是否正確，且已在 Render 後台設定環境變數。");
});
