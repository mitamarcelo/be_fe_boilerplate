export const logger = {
  info: (message: string, metadata?: unknown): void => {
    console.log(message, metadata ?? '');
  },
  error: (message: string, metadata?: unknown): void => {
    console.error(message, metadata ?? '');
  }
};
