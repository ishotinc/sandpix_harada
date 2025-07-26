// Simple logger without external dependencies
class ConsoleLogger {
  private formatMessage(level: string, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data !== undefined) {
      return `${baseMessage} ${JSON.stringify(data, null, 2)}`;
    }
    
    return baseMessage;
  }

  debug(message: string, data?: unknown): void {
    console.log(this.formatMessage('debug', message, data));
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: unknown): void {
    console.error(this.formatMessage('error', message, error));
  }
}

export const logger = new ConsoleLogger();