import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals, request, params }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { imageId } = params;

  const cloudflareAccountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
  const cloudflareApiKey = import.meta.env.CLOUDFLARE_API_KEY;

  // Query to cloudfront api
  // https://api.cloudflare.com/client/v4/accounts/account_id/images/v1/image_id/blob

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/images/v1/${imageId}/blob`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${cloudflareApiKey}`,
      "Content-Type": "application/json",
    },
  });

  let { readable, writable } = new TransformStream();

  response.body?.pipeTo(writable);

  return new Response(readable, response);
}