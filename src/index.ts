import dotenv from 'dotenv';

import { startServer } from 'Apps/StartServer';
import {
  logService,
  secretService
} from 'Config/Services';

dotenv.config();

startServer(
  secretService,
  logService
);
