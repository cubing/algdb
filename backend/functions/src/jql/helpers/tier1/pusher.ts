import * as Pusher from "pusher";
import { env } from '../tier0/config';

export const pusher = new Pusher({
  appId: env.pusher.app_id,
  key: env.pusher.key,
  secret: env.pusher.secret,
  cluster: env.pusher.cluster,
  useTLS: true
});