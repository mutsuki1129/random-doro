// deploy-commands.js (更新版)

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
// ⚠️ CLIENT_ID 仍然需要
const CLIENT_ID = '1443896595069538344'; 

// 移除 GUILD_ID，因為我們要註冊全域指令

const commands = [
    new SlashCommandBuilder()
        .setName('doro')
        .setDescription('發送一個隨機的 Doro 表情包。'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
    try {
        console.log(`開始刷新 ${commands.length} 個 (/) 應用程式指令（全域）...`);

        // 📌 核心變更：使用 Routes.applicationCommands 進行全域註冊
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID), // 移除了 GUILD_ID 參數
            { body: commands },
        );

        console.log(`成功重新載入 ${data.length} 個全域 (/) 應用程式指令！`);
    } catch (error) {
        console.error("註冊全域指令時發生錯誤:", error);
    }
})();
