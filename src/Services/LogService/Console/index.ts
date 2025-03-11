import createDebug from 'debug';
import { LogServiceDecorator } from 'Services/LogService/Decorator';

export class ConsoleLogService extends LogServiceDecorator {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  log(prefix: string, ...args: any[]): void {
    const debug = createDebug(prefix);
    debug(args.join(' '));
    super.log(...args);
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  error(prefix: string, ...args: any[]): void {
    const debug = createDebug(prefix);
    debug(args.join(' '));
    super.error(...args);
  }
}
