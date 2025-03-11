import fs from 'fs-extra';

import { InternalError } from 'Exceptions/InternalError.exception';
import { Config, ISecretService } from 'Services/SecretService/Interface';

export class SecretService implements ISecretService {
  private httpsPrivateKey: string | null = null;
  private httpsCertificate: string | null = null;

  async loadHttpsPrivateKey(): Promise<string> {
    try {
      const httpsPrivateKeyPath = process.env.HTTPS_PRIVATE_KEY_FILE_PATH || '';

      if (!httpsPrivateKeyPath) {
        throw new InternalError('Https private key path not found');
      }

      const privateKey = fs.readFile(httpsPrivateKeyPath, 'utf8');

      return Promise.resolve(privateKey);
    } catch (error) {
      return Promise.reject(
        new InternalError(
          `Error while loading https private key: ${error}`
        )
      );
    }
  }

  async getHttpsPrivateKey(config?: Config): Promise<string> {
    try {
      if (!this.httpsPrivateKey || config?.forceRead) {
        this.httpsPrivateKey = await this.loadHttpsPrivateKey();
      }

      return Promise.resolve(this.httpsPrivateKey);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async loadHttpsCertificate(): Promise<string> {
    try {
      const httpsCertificatePath = process.env.HTTPS_CERTIFICATE_FILE_PATH || '';

      if (!httpsCertificatePath) {
        throw new InternalError('Https certificate key path not found');
      }

      const certificate = fs.readFile(httpsCertificatePath, 'utf8');

      return Promise.resolve(certificate);
    } catch (error) {
      return Promise.reject(
        new InternalError(
          `Error while loading https certificate: ${error}`
        )
      );
    }
  }

  async getHttpsCertificate(config?: Config): Promise<string> {
    try {
      if (!this.httpsCertificate || config?.forceRead) {
        this.httpsCertificate = await this.loadHttpsCertificate();
      }

      return Promise.resolve(this.httpsCertificate);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
