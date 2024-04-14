import { db, eq, isNotNull, inArray, Grid, Image } from "astro:db";
import type { ImagePosition } from "db/config";

type GridWithImages = Omit<typeof Grid["$inferSelect"], 'imagePositions'> & { imagePositions: ImagePosition[] };

export function getAllImagesWithGridSize() {
  return db
    .select()
    .from(Image)
    .where(isNotNull(Image.gridsize))
    .all();
}

export async function getGridWithImages(id: number) {
  const grid = await db
    .select()
    .from(Grid)
    .where(eq(Grid.id, id))
    .get() as GridWithImages;

  if (!grid) {
    throw new Error(`Grid not found: ${id}`);
  }

  if (!grid.imagePositions.length) {
    return {
      grid,
      images: [],
    };
  }

  const imageIds = grid.imagePositions.map((pos) => pos.imageId);

  const images = await db
    .select()
    .from(Image)
    .where(inArray(Image.id, imageIds))
    .all();

  return {
    grid,
    images,
  }
};

export type GetGridWithImagesType = Awaited<ReturnType<typeof getGridWithImages>>;
export type GetAllImagesWithGridSizeType = Awaited<ReturnType<typeof getAllImagesWithGridSize>>;
