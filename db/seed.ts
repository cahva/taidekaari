import { db, Category, Grid, Image, User } from "astro:db";
import type { ImagePosition } from "./config";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(User).values([
    { id: 1, name: "anne", fullname: "Anne Leinonen" },
    { id: 2, name: "markku", fullname: "Markku Virtanen" },
  ]);

  await db.insert(Category).values([
    { id: 1, name: "Katupappila" },
    { id: 2, name: "Keravan katse" },
    { id: 3, name: "Närhi" },
    { id: 4, name: "Kellosoikkeli" },
    { id: 5, name: "Tyykipuoti" },
    { id: 6, name: "Sunhius" },
    { id: 7, name: "Kulmis" },
    { id: 8, name: "Helleborgin kukka" },
    { id: 9, name: "Funky Lady" },
    { id: 10, name: "Pala Keravaani", gridSizeImages: true },
  ]);

  await db.insert(Image).values([
    {
      id: "d2258aa4-04db-4a10-79cb-3b57dcadac00",
      filename: "IMG_20240401_171424444.jpg",
      gridsize: "20x20",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 1",
    },
    {
      id: "8d817711-cca6-425e-68e4-0f358de36100",
      filename: "IMG_20240401_171245624.jpg",
      gridsize: "20x20",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 2",
    },
    {
      id: "4e112131-be83-4ec0-5edb-040519922f00",
      filename: "IMG_20240401_171256374.jpg",
      gridsize: "20x20",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 3",
    },
    {
      id: "3b31c543-13d6-4121-773a-a596a7d08400",
      filename: "IMG_20240401_171313171.jpg",
      gridsize: "20x20",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 4",
    },
    {
      id: "03c9c583-6684-4cdc-6bf6-f29ddb398d00",
      filename: "kuva5.jpg",
      gridsize: "10x10",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 5",
    },
    {
      id: "566fda67-81f9-46e1-d425-d1fae4a3e400",
      filename: "kuva6.jpg",
      gridsize: "10x10",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 6",
    },
    {
      id: "e71fc122-13b4-4e52-bfd6-75abfcf9d000",
      filename: "kuva7.jpg",
      gridsize: "10x10",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 7",
    },
    {
      id: "c018f0fd-ed71-4ac7-13ee-677bdd045700",
      filename: "kuva8.jpg",
      gridsize: "10x10",
      createdAt: new Date(),
      userId: 1,
      categoryId: 10,
      title: "Kuva 8",
    },
  ]);

  await db
    .insert(Grid)
    .values([
      {
        id: 1,
        name: "Ruudukko #1",
        userId: 1,
        createdAt: new Date(),
        imagePositions: <ImagePosition[]>[
          { imageId: "d2258aa4-04db-4a10-79cb-3b57dcadac00", x: 0, y: 0, size: 20 },
          { imageId: "8d817711-cca6-425e-68e4-0f358de36100", x: 80, y: 0, size: 20 },
          //{ imageId: "4e112131-be83-4ec0-5edb-040519922f00", x: 300, y: 0 },
          { imageId: "3b31c543-13d6-4121-773a-a596a7d08400", x: 160, y: 0, size: 20},
          { imageId: "03c9c583-6684-4cdc-6bf6-f29ddb398d00", x: 0, y: 80, size: 10},
          //{ imageId: "566fda67-81f9-46e1-d425-d1fae4a3e400", x: 100, y: 200 },
          { imageId: "e71fc122-13b4-4e52-bfd6-75abfcf9d000", x: 80, y: 80, size: 10 },
          { imageId: "c018f0fd-ed71-4ac7-13ee-677bdd045700", x: 160, y: 80, size: 10 },
        ],
      },
    ]);

  // await db.insert(GridImage).values([
  //   { id: 1, gridId: 1, imageId: "d2258aa4-04db-4a10-79cb-3b57dcadac00", x: 1, y: 1 },
  // ]);
}
