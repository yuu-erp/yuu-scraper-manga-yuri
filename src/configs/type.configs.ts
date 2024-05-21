export interface IAppConfigs {
  port: number;
}

export interface IDatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export interface ICloudinaryConfigs {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}
