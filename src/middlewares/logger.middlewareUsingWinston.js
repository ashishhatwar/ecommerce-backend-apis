import winston from "winston";

// configuring winston logger
export const logger = winston.createLogger({
  level: "info",
  formats: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [
    new winston.transports.Console(), // if you want to print on console
    new winston.transports.File({ filename: "logs.txt" }), // where you want to save
  ],
});

const loggerMiddleware = async (req, res, next) => {
  // 1. Log request body.
  if (!req.url.includes("signin")) {
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;

    logger.info(logData);
  }
  next();
};

export default loggerMiddleware;
