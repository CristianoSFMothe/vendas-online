import { LoginPayload } from '..//models/auth/dtos/loginPayload.dto';

export const authorizationToLoginPayload = (
  authorization: string,
): LoginPayload | undefined => {
  const authorizationSpited = authorization.split('.');

  if (authorizationSpited.length < 3 || !authorizationSpited[1]) {
    return undefined;
  }

  return JSON.parse(
    Buffer.from(authorizationSpited[1], 'base64').toString('ascii'),
  );
};
