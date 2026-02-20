import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message || "Internal Server Error";

    response.status(status).json({
      statusCode: status,
      message: message,
      error: exception.name || "Unknown Error",
      stack: exception.stack || null,
      timestamp: new Date().toISOString(),
    });
  }
}
