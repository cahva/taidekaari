import { db, User, Category, Image } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(User).values([
    { id: 1, name: "anne", fullname: "Anne Leinonen"},
    { id: 2, name: "markku", fullname: "Markku Virtanen"},
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
    { id: 10, name: "Pala Keravaani" },
  ]);

  await db
    .insert(Image)
    .values([
      {
        id: "bba691ad-a668-423f-da83-f641ab197900",
        filename: "pandox_arsstamma_2022_resize-1920.jpg",
        userId: 2,
        categoryId: 1,
        createdAt: new Date("2024-03-16T08:30:00Z"),
				title: "Pandox Årsstämma 2022",
      },
      {
        id: "d965528c-f3dc-4e31-b8aa-af6e6d777c00",
        filename: "fiskars_interim_image_library_10_rgb_hr_resize.jpg",
        userId: 2,
        categoryId: 1,
        createdAt: new Date("2024-03-16T08:30:00Z"),
				title: "Toinen kuva",
      },
    ]);

  // TODO
}
