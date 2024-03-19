import { db, eq, Session, User } from "astro:db";

export async function getSession(sessionId: string) {
  const currentTime = new Date().getTime() / 1000;
  const data = await db
    .select()
    .from(Session)
    .where(eq(Session.id, sessionId))
    .innerJoin(User, eq(Session.userId, User.id))
    .get();

  if (!data) {
    return null;
  }

  if (data.Session.expiresAt < currentTime) {
    db.delete(Session).where(eq(Session.id, sessionId)).then(() => {
      console.log("Deleted expired session", sessionId);
    })
    return null;
  }

  return data;
}
