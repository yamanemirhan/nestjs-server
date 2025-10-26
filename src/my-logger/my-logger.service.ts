import { ConsoleLogger, Injectable } from '@nestjs/common';

// todo: customize the logger

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  log(message: any, stack?: string, context?: string) {
    super.log(message, stack, context);
  }

  warn(message: any, stack?: string, context?: string) {
    super.warn(message, stack, context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }
}
