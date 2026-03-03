// @/utils/logger.ts - Version simplifiée

type LogLevel = "info" | "success" | "warning" | "error";

type LoggableData =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Error
  | unknown[];

class Logger {
  private format(
    level: LogLevel,
    message: string,
    data?: LoggableData,
  ): string {
    const timestamp = new Date().toISOString();
    const levelEmoji = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    }[level];

    return `${levelEmoji} [${timestamp}] ${message}`;
  }

  info(message: string, data?: LoggableData): void {
    const formatted = this.format("info", message);
    console.log(formatted, data || "");
  }

  success(message: string, data?: LoggableData): void {
    const formatted = this.format("success", message);
    console.log(formatted, data || "");
  }

  warning(message: string, data?: LoggableData): void {
    const formatted = this.format("warning", message);
    console.warn(formatted, data || "");
  }

  error(message: string, error?: LoggableData): void {
    const formatted = this.format("error", message);
    console.error(formatted, error || "");

    // En production, envoyer à votre service de monitoring
    if (process.env.NODE_ENV === "production") {
      // this.trackError(message, error);
    }
  }
}

export const logger = new Logger();
