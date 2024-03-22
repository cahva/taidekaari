import type { APIRoute } from "astro";
import { getImageBlob } from "@lib/cloudflare";

export const GET: APIRoute = async ({ locals, params }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { imageId } = params;

  if (!imageId) {
    return new Response("Bad request", { status: 400 });
  }

  const response = await getImageBlob(imageId);

  let { readable, writable } = new TransformStream();

  response.body?.pipeTo(writable);

  return new Response(readable, response);
}