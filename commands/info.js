const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about Nullforge Expanse')
    .addStringOption(option =>
      option
        .setName('topic')
        .setDescription('Choose a topic')
        .setRequired(false)
        .addChoices(
          { name: 'Biome', value: 'biome' },
          { name: 'Mobs', value: 'mobs' },
          { name: 'Boss', value: 'boss' },
          { name: 'Equipment', value: 'equipment' },
          { name: 'Overview', value: 'overview' }
        )
    ),
  async execute(interaction) {
    const topic = interaction.options.getString('topic') || 'overview';

    const embeds = {
      overview: new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🌌 Nullforge Expanse Overview')
        .setDescription('A cosmic void adventure in this expansion biome for Minecraft')
        .addFields(
          { name: '📍 World Type', value: 'Fractured dimension with floating islands', inline: true },
          { name: '⚡ Theme', value: 'Cosmic void + Ancient machines', inline: true },
          { name: '🎯 Goal', value: 'Defeat the Endforged Automaton boss', inline: false },
          { name: '📦 Key Features', value: '• Floating stone islands\n• Blue void crystals\n• Mechanical ruins\n• Hidden structures', inline: false }
        )
        .setThumbnail('https://via.placeholder.com/256?text=Nullforge'),

      biome: new EmbedBuilder()
        .setColor('#1a1a2e')
        .setTitle('🏜️ Nullforge Expanse Biome')
        .addFields(
          { name: 'Environment Features', value: '• Floating stone islands\n• Blue void crystals\n• Mechanical ruins\n• Gear embedded structures\n• Corrupted void fog', inline: false },
          { name: 'Atmosphere', value: 'Mysterious, ancient, and dangerous. Distant metallic echoes and mechanical sounds', inline: false },
          { name: 'Access', value: 'Unstable portals before defeating Ender Dragon\nPermanent gateway after defeat', inline: false }
        ),

      mobs: new EmbedBuilder()
        .setColor('#ff6b6b')
        .setTitle('👹 Nullforge Hostile Mobs')
        .addFields(
          { name: '⚙️ Scraplings', value: 'Small corrupted mechanical creatures\nDrop: Null Shards', inline: true },
          { name: '⏰ Chrono-Stalkers', value: 'Void phantoms that manipulate time\nDrop: Null Shards', inline: true },
          { name: '🔫 Void Sentries', value: 'Automated defense turrets\nDrop: Void Gear Cores', inline: true },
          { name: '🤖 Endforged Automaton', value: 'Boss mob - see /info boss for details', inline: true }
        ),

      boss: new EmbedBuilder()
        .setColor('#ffd700')
        .setTitle('🤖 Endforged Automaton - Boss Fight')
        .addFields(
          { name: 'Phase 1', value: 'Mechanical slam attacks & spinning blades', inline: false },
          { name: 'Phase 2', value: 'Gravity distortions & projectile barrages', inline: false },
          { name: 'Final Phase', value: 'Core becomes exposed, arena collapses', inline: false },
          { name: 'Boss Drops', value: '• Void Gear Core\n• Automaton Plating\n• Null Shards', inline: false },
          { name: '💡 Tip', value: 'Wear full Voidforged Armor and bring healing potions!', inline: false }
        ),

      equipment: new EmbedBuilder()
        .setColor('#00ff88')
        .setTitle('⚔️ Void Tech Equipment')
        .addFields(
          { name: 'Voidforged Armor', value: 'Upgradeable armor with modular attachments\nUpgrades: Auto repair, Glide booster, Void dash, Piston punch', inline: false },
          { name: '🗡️ Nullblade', value: 'Void energy sword with sweeping attacks', inline: true },
          { name: '🔨 Gearhammer', value: 'Heavy hammer causing shockwaves', inline: true },
          { name: '🏹 Chrono Bow', value: 'Slows enemies when hit', inline: true }
        )
    };

    const embed = embeds[topic] || embeds.overview;
    await interaction.reply({ embeds: [embed] });
  },
};