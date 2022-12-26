import fs from 'fs';
import ngrok from 'ngrok';
import fetch from 'node-fetch';

const PORT = 3003;
const main = async () => {
  let localEnvLines: string[] = [];
  try {
    localEnvLines = fs.readFileSync('./.env.local', 'utf8').split(/\r?\n/);
  } catch (error) {}

  let currentBaseUrl;
  const indexBaseUrlIndex = localEnvLines.findIndex((item) => item.startsWith('BASE_URL='));
  let isBaseUrlError = false;
  if (indexBaseUrlIndex !== -1) {
    currentBaseUrl = localEnvLines[indexBaseUrlIndex].replace('BASE_URL=', '');
    console.info('Current base url: ', currentBaseUrl);
    try {
      const resBaseUrl = await fetch(currentBaseUrl);
      if (resBaseUrl.headers.get('ngrok-error-code') === 'ERR_NGROK_3200') {
        isBaseUrlError = true;
      }
    } catch (e) {
      console.error(e);
      isBaseUrlError = true;
    }
  }
  if (indexBaseUrlIndex !== -1 && !isBaseUrlError) {
    return;
  }
  const url = await ngrok.connect({
    authtoken: '2JRReyTosPqDzkjJemnvjQGvVnf_2yDmoWx28MQN1CMBTxtnX',
    addr: PORT,
  });
  const newBaseUrlConfig = `BASE_URL=${url}`;
  const newLocalConfig = localEnvLines.filter((item) => !item.startsWith('BASE_URL='));
  newLocalConfig.push(newBaseUrlConfig);
  console.info('Base url:', url);
  fs.writeFileSync('.env.local', newLocalConfig.join('\n'), 'utf8');
};

main();
