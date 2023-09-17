import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: "logs/app.log" }),
  ],
});
