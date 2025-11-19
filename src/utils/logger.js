class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (args.length === 0) {
      return `${prefix} ${message}`;
    }
    
    if (this.isDevelopment || level === 'error') {
      try {
        const argsStr = args.map(arg => 
          arg instanceof Error ? { message: arg.message, stack: arg.stack } : arg
        );
        return `${prefix} ${message} ${JSON.stringify(argsStr)}`;
      } catch {
        return `${prefix} ${message} [Unable to stringify arguments]`;
      }
    }
    
    return `${prefix} ${message}`;
  }

  debug(message, ...args) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }

  info(message, ...args) {
    console.info(this.formatMessage('info', message, ...args));
  }

  warn(message, ...args) {
    console.warn(this.formatMessage('warn', message, ...args));
  }

  error(message, error, ...args) {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(this.formatMessage('error', message, errorDetails, ...args));
  }
}

export const logger = new Logger();
