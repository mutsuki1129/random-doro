// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

// 取得環境變數
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
// ⚠️ 請替換為您的機器人 Client ID
const CLIENT_ID = '1443896595069538344'; 
// ⚠️ 您可以先註冊到一個測試伺服器 (Guild ID)
const GUILD_ID = '1368498762728865804'; 

// 定義您的 /doro 指令結構
const commands = [
    new SlashCommandBuilder()
        .setName('doro')
        .setDescription('發送一個隨機的 Doro 表情包。'),
].map(command => command.toJSON());

// 執行註冊
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`開始刷新 ${commands.length} 個 (/) 應用程式指令...`);

        // 將指令註冊到單個伺服器 (開發時推薦)
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log(`成功重新載入 ${data.length} 個 (/) 應用程式指令！`);
    } catch (error) {
        console.error("註冊指令時發生錯誤:", error);
    }
})();