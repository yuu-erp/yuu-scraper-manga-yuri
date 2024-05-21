import { IAppConfigs } from './type.configs';
import 'dotenv/config';

export const AppConfigs: IAppConfigs = {
  port: Number(process.env.PORT || 3000),
};
