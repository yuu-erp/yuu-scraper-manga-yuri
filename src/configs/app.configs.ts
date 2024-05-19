import { IAppConfigs } from './type.configs';
import 'dotenv/config';

export const AppConfigs: IAppConfigs = {
  discord_token: process.env.DISCORD_TOKEN || '',
  discord_logger_channel_id: process.env.DISCORD_LOGGER_CHANNEL_ID || '',
  discord_webhook_url: process.env.DISCORD_WEBHOOK_URL || '',

  port: Number(process.env.PORT || 3000),
};
