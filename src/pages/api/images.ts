import type { APIRoute } from "astro";
import { db, Image } from "astro:db";

export const POST: APIRoute = async ({ locals, request }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the image information from the request
  const data = request.body;

  return new Response("OK", { status: 200 });
}