import {
  Channel,
  Client,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
} from 'discord.js';
import { AppConfigs } from '../configs/app.configs';

export class DiscordClient {
  client: Client;
  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
  }
  login() {
    console.log(AppConfigs);
    this.client.login(AppConfigs.discord_token);
  }

  getChannel(id: string): Channel {
    const channel: Channel = this.client.channels.cache.get(id);
    console.log(`getChannel - ${id}: `, channel);
    if (!channel) {
      throw new Error(`Channel discord not found - ${id}`);
    }
    return channel;
  }

  async logError(error) {
    // const logMessage = `Error Timestamp: ${new Date().toISOString()}\nError Name: ${error.name}\nError Message: ${error.message}\nStack Trace: ${error.stack}`;
    const channel = this.getChannel('1237424501248102477');
    if (channel && channel.isTextBased()) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error Logged')
        .setDescription('A new error has been logged.')
        .addFields(
          { name: 'Timestamp', value: new Date().toISOString() },
          {
            name: 'Error Message',
            value: `\`\`\`${error?.message || 'hmmm!'}\`\`\``,
          },
        )
        .setFooter({
          text: 'Error Logger',
          iconURL: this.client.user.displayAvatarURL(),
        })
        .setTimestamp();
      await (channel as TextChannel).send({ embeds: [embed] });
      throw new Error(error.message);
    }
  }
}
