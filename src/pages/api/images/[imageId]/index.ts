import type { APIRoute } from "astro";
import { db, eq, Image } from "astro:db";
import { deleteImage } from "@lib/cloudflare";

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

  const isAuthor = user.id === image.userId;

  if (!isAuthor) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const response = await deleteImage(imageId);
    if (!response.ok) {
      console.error("Failed to delete image", response.statusText);
      return new Response("Failed to delete image", { status: 500 });
    }
    await db.delete(Image).where(eq(Image.id, imageId));
  } catch (error) {
    console.error("Failed to delete image", error);
    return new Response("Failed to delete image", { status: 500 });
  }

  return new Response("Deleted", { status: 200 });
};
