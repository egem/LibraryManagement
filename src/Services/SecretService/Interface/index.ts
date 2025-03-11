export interface Config {
  forceRead: boolean;
}

export interface ISecretService {
  getHttpsPrivateKey(config?: Config): Promise<string>;
  getHttpsCertificate(config?: Config): Promise<string>;
}
