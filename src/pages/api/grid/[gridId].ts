import type { APIRoute } from "astro";
import { db, and, eq, Grid } from "astro:db";

export const PUT: APIRoute = async ({ request, locals, params }) => {
  const user = locals.user;
  const { gridId } = params;

  if (!gridId) {
    return new Response("Bad request", { status: 400 });
  }
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await request.json();

  try {
    await db
    .update(Grid)
    .set({
      name: payload.name,
      imagePositions: payload.imagePositions,
    })
    .where(eq(Grid.id, parseInt(gridId)));
  } catch (error) {
    return new Response("Bad request", { status: 400 });
  }
  
  return new Response("OK", { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const user = locals.user;
  const { gridId } = params;

  if (!gridId) {
    return new Response("Bad request", { status: 400 });
  }
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Delete the grid with the given id (and user id)
  const deletedGrid = await db
    .delete(Grid)
    .where(
      and(
        eq(Grid.id, parseInt(gridId)),
        eq(Grid.userId, user.id),
      )
    );

  if (deletedGrid.rowsAffected === 0) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(null, { status: 204 });
};
