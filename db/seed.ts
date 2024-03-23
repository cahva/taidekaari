import { db, User, Category } from "astro:db";

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
    { id: 10, name: "Pala Keravaani", gridSizeImages: true },
  ]);
}
