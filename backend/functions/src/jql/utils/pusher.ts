import * as Pusher from "pusher";

let pusher;

export function initializePusher(pusherEnv: any) {
  pusher = new Pusher({
    appId: pusherEnv.app_id,
    key: pusherEnv.key,
    secret: pusherEnv.secret,
    cluster: pusherEnv.cluster,
    useTLS: true
  });
};

export const getPusher = () => pusher;