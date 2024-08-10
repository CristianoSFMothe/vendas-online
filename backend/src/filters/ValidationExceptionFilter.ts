import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const translatedMessages = exceptionResponse.message.map((msg: string) => {
      if (msg.startsWith('property')) {
        return 'Propriedade adicional não permitida.';
      }
      return msg;
    });

    response.status(status).json({
      statusCode: status,
      error: 'Requisição inválida',
      message: translatedMessages,
    });
  }
}
