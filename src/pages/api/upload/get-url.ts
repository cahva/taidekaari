import type { APIRoute } from "astro";

export interface UploadResponse {
  result: Result
  result_info: any
  success: boolean
  errors: any[]
  messages: any[]
}

export interface Result {
  id: string
  uploadURL: string
}

const ACCOUNT_ID = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = import.meta.env.CLOUDFLARE_API_KEY;


// Heres the curl command
/*

curl --request POST \
https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v2/direct_upload \
--header 'Authorization: Bearer <API_TOKEN>' \
--form 'requireSignedURLs=true' \
--form 'metadata={"key":"value"}'

*/

// Do a POST request to cloudflare api to get the one time upload url
export const GET: APIRoute = async ({ locals, request }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const params = url.searchParams;

  const categoryId = params.get('categoryId') || 'none';

  const formData = new FormData();
  formData.append('requireSignedURLs', 'false');
  formData.append('metadata', JSON.stringify({ uploadedBy: user.fullname, categoryId }));

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json",
    }
  });
};
