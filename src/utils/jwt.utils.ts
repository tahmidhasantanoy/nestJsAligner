import { UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

interface ItokenPayload {
  sub: string;
  email: string;
  role: string;
}

// interface IdecodedToken {
//     sub: string,
//     email: string,
//     role: string,
//     iat: string,
//     exp: string,
// }

const generateToken = (
  payload: ItokenPayload,
  secret: string,
  expires_in: string,
) => {
  const token: string = jwt.sign(payload, secret, {
    expiresIn: expires_in,
  } as jwt.SignOptions);
  return token;
};

const validateToken = (token: string, secret: string) => {
  try {
    const decodedToken = jwt.verify(token, secret);
    return decodedToken;
  } catch (error: any) {
    throw new UnauthorizedException(error.message);
  }
};

export default {
  generateToken,
  validateToken,
};
