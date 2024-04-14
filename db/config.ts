import { defineDb, defineTable, column, NOW } from 'astro:db';


export type ImagePosition = {
  imageId: string;
  x: number;
  y: number;
  size: number;
};

const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    fullname: column.text(),
  },
});

const Category = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    gridSizeImages: column.boolean({ optional: true }),
  },
});

const Image = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    filename: column.text(),
    title: column.text({ optional: true }),
    gridsize: column.text({ optional: true }), // 10x10, 20x20
    userId: column.number({ references: () => User.columns.id }),
    categoryId: column.number({ references: () => Category.columns.id, optional: true }),
    createdAt: column.date({ default: NOW }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.number({ references: () => User.columns.id }),
    expiresAt: column.number(), // Unix timestamp
  },
});

const Grid = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    userId: column.number({ references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
    imagePositions: column.json()
    // imagePositions: column.json({ optional: true }),
  },
});


// const GridImage = defineTable({
//   columns: {
//     id: column.number({ primaryKey: true }),
//     gridId: column.number({ references: () => Grid.columns.id }),
//     imageId: column.text({ references: () => Image.columns.id }),
//     x: column.number(),
//     y: column.number(),
//   },
// });

// https://astro.build/db/config
export default defineDb({
  tables: { Category, Grid, Image, Session, User }
});
