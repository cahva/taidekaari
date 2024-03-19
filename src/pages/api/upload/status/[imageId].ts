import type { APIRoute } from "astro";

export interface Status {
  result: Result
  success: boolean
  errors: any[]
  messages: any[]
}

export interface Result {
  id: string
  filename: string
  uploaded: string
  requireSignedURLs: boolean
  variants: string[]
}


const ACCOUNT_ID = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = import.meta.env.CLOUDFLARE_API_KEY;

export const GET: APIRoute = async ({ params, locals }) => {
  const { imageId } = params;

  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  /* Curl command to get status of an image
  curl https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1/<IMAGE_ID> \
 --header 'Authorization: Bearer <API_TOKEN>'
  */

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${imageId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}