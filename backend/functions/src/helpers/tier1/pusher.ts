import * as Pusher from "pusher";
import type { PusherEnv } from "../../types";

let pusher;

export function initializePusher(pusherEnv: PusherEnv) {
  pusher = new Pusher({
    appId: pusherEnv.app_id,
    key: pusherEnv.key,
    secret: pusherEnv.secret,
    cluster: pusherEnv.cluster,
    useTLS: true,
  });
}

export const getPusher = () => {
  return pusher;
};
