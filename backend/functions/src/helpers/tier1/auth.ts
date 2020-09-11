import errorHelper from '../tier0/error';
import { env } from '../tier0/config';
import * as jwt from 'jsonwebtoken';

export async function validateToken(auth: string) {
  if (auth.split(' ')[0] !== 'Bearer') {
    throw errorHelper.generateError('Invalid token');
  }

  const token = auth.split(' ')[1];

  try {
    const decoded: any = await jwt.verify(token, env.general.jwt_secret);
    
    return decoded;
  } catch (err) {
    const message = 'Token error: ' + (err.message || err.name);
    throw errorHelper.generateError(message);
  }
};