const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    
    // Set bot status
    client.user.setActivity('Nullforge Expanse', { type: 'PLAYING' });

    // Register slash commands
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
      try {
        console.log(`🔄 Registering ${commands.length} slash commands...`);

        await rest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
          ),
          { body: commands }
        );

        console.log('✅ Slash commands registered successfully!');
      } catch (error) {
        console.error('❌ Error registering commands:', error);
      }
    })();
  },
};
