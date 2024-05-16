import { IAppConfigs } from './type.configs';
import 'dotenv/config';

export const AppConfigs: IAppConfigs = {
  discord_token: process.env.DISCORD_TOKEN || '',
  discord_logger_channel_id: process.env.DISCORD_LOGGER_CHANNEL_ID || '',
};
