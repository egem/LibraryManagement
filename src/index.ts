import dotenv from 'dotenv';

import { startServer } from 'Apps/StartServer';
import { SecretService } from 'Services/SecretService/Filesystem';
import { ConsoleLogService } from 'Services/LogService/Console';

dotenv.config();

const logService = new ConsoleLogService();
logService.log((process.env.PORT || ''));

startServer(
  new SecretService(),
  logService
);
