import type { APIRoute } from "astro";
import { db, eq, Image } from "astro:db";

export const DELETE: APIRoute = async ({ locals, params }) => {
  const { imageId } = params;

  if (!imageId) {
    return new Response("Bad request", { status: 400 });
  }

  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const image = await db
    .select()
    .from(Image)
    .where(eq(Image.id, imageId))
    .get();

  if (!image) {
    return new Response("Not found", { status: 404 });
  }

  const cloudflareAccountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
  const cloudflareApiKey = import.meta.env.CLOUDFLARE_API_KEY;

  const isAuthor = user.id === image.userId;

  if (!isAuthor) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/images/v1/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cloudflareApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return new Response("Failed to delete image", { status: 500 });
  }

  await db.delete(Image).where(eq(Image.id, imageId));

  return new Response("Deleted", { status: 200 });
};
