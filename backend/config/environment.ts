import dotenvFlow from 'dotenv-flow';
import fs from 'fs';

const ENV_FILE_PATHS = {
  local: ['.env', '.env.local'],
  development: ['.env', '.env.development'],
  staging: ['.env', '.env.staging'],
  production: ['.env', '.env.production'],
};

export const loadEnvironment = () => {
  const NODE_ENV: any = process.env.NODE_ENV || 'local';
  // @ts-ignore
  const envFiles = (ENV_FILE_PATHS[NODE_ENV] as any).filter((envFile: any) =>
    fs.existsSync(envFile),
  );
  console.info(`Load Environment: ${NODE_ENV} [${envFiles.join(' -> ')}]`);
  dotenvFlow.load(envFiles);
  // TODO valid env
};
