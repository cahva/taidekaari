const cloudflareAccountId = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
const cloudflareApiKey = import.meta.env.CLOUDFLARE_API_KEY;

const BASE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}`;

const headers = {
  Authorization: `Bearer ${cloudflareApiKey}`,
  "Content-Type": "application/json",
};

export const getImageBlob = (imageId: string) => {
  return fetch(
    `${BASE_API_URL}/images/v1/${imageId}/blob`,
    {
      method: "GET",
      headers,
    }
  );
};

export const deleteImage = (imageId: string) => {
  return fetch(
    `${BASE_API_URL}/images/v1/${imageId}`,
    {
      method: "DELETE",
      headers,
    }
  );
}
