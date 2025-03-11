import { ILogService } from 'Services/LogService/Interface';

export class LogServiceDecorator implements ILogService {
  protected logger: ILogService | undefined;

  constructor(logger?: ILogService) {
      this.logger = logger;
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  log(...args: any[]): void {
    this.logger?.log(...args);
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  error(...args: any[]): void {
    this.logger?.error(...args);
}
}
