import * as functions from 'firebase-functions';

export const isDev = process.env.DEV;

export const env = isDev ? require('../../../env.json') : functions.config();