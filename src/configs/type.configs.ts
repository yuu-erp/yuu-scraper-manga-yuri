export interface IAppConfigs {
  discord_token: string;
  discord_logger_channel_id: string;
}

export interface IDatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}
