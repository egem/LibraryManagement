import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import https from 'https';

import { InternalError } from 'Exceptions/InternalError.exception';
import { ISecretService } from 'Services/SecretService/Interface';
import { ILogService } from 'Services/LogService/Interface';
import { router } from 'Routes';

const LogPrefix = 'App:StartServer';

export const startServer = async (
  secretService: ISecretService,
  logService: ILogService
): Promise<void> => {
  try {
    const server: express.Application = express();

    const port = process.env.PORT || 3000;

    const httpEnable: boolean = process.env.HTTP_ENABLE === 'true';
    // const webApplicationRootPath = process.env.WEB_APPLICATION_ROOT_PATH || '';

    server.set('etag', false);
    server.set('trust proxy', 1);

    const self = '\'self\'';

    server.use(compression());

    server.disable('x-powered-by');
    server.use(nocache());
    server.use(
      helmet(
        {
          contentSecurityPolicy: {
            directives: {
              'default-src': self,
              'style-src': self,
              'script-src': self,
              'img-src': '* data:',
              'connect-src': self,
              'font-src': self
            }
          }
        }
      )
    );

    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    server.use(
      '',
      router
    );

    if (httpEnable) {
      server.listen(port, () => {
        logService.log(LogPrefix, `Http server is running at port ${port}`);
      });
    } else {
      const privateKey = await secretService.getHttpsPrivateKey();
      const certificate = await secretService.getHttpsCertificate();

      if (
        !privateKey ||
        !certificate
      ) {
        throw new InternalError('Https keys not found');
      }

      const credentials = { key: privateKey, cert: certificate };
      const httpsServer = https.createServer(credentials, server);

      httpsServer.listen(port, () => {
        logService.log(LogPrefix, `Https server is running at port ${port}`);
      });
    }

    return Promise.resolve();
  } catch (error) {
    const errorMessage = `Error while starting server: ${error}`;

    logService.log(LogPrefix, errorMessage);

    return Promise.reject(error);
  }
};
