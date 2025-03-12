// src/utils/logger.ts
import * as winston from "winston";

enum LogLevel {
	ERROR = "error",
	INFO = "info",
	WARN = "warn",
	DEBUG = "debug",
}

const LEVELS: Record<LogLevel, number> = {
	[LogLevel.ERROR]: 0,
	[LogLevel.INFO]: 1,
	[LogLevel.WARN]: 2,
	[LogLevel.DEBUG]: 3,
};

const getLogLevel = (): LogLevel => {
	return process.env.NODE_ENV === "development"
		? LogLevel.DEBUG
		: LogLevel.INFO;
};

const logFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss:ms A" }),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`,
	),
);

const transports: winston.transport[] = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: "logs/error.log",
		level: LogLevel.ERROR,
	}),
	new winston.transports.File({ filename: "logs/all.log" }),
];

const Logger = winston.createLogger({
	level: getLogLevel(),
	levels: LEVELS,
	format: logFormat,
	transports,
	exceptionHandlers: [
		new winston.transports.File({ filename: "logs/exceptions.log" }),
	],
	exitOnError: false,
});

export default Logger;
