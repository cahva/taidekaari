import { defineDb, defineTable, column } from 'astro:db';

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
    createdAt: column.date(),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.number({ references: () => User.columns.id }),
    expiresAt: column.number(), // Unix timestamp
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { User, Image, Category, Session }
});
