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

    let translatedMessages: string[] = [];

    // Verifica se exceptionResponse.message é um array
    if (Array.isArray(exceptionResponse.message)) {
      translatedMessages = exceptionResponse.message.map((msg: string) => {
        if (msg.startsWith('property')) {
          return 'Propriedade adicional não permitida.';
        }
        return msg;
      });
    } else if (typeof exceptionResponse.message === 'string') {
      // Caso a mensagem seja uma string, coloque-a em um array
      translatedMessages = [exceptionResponse.message];
    } else {
      // Caso a mensagem seja um objeto ou outro tipo
      translatedMessages = ['Erro de validação desconhecido.'];
    }

    response.status(status).json({
      statusCode: status,
      error: 'Requisição inválida',
      message: translatedMessages,
    });
  }
}
