import { getSession } from './lib/auth';
import { defineMiddleware  } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionCookie = context.cookies.get('sessionId');
  if (sessionCookie) {
    const session = await getSession(sessionCookie.value);
    if (session) {
      context.locals.user = session.User;
    }
  }
  const response = await next();
  return response;
});
  