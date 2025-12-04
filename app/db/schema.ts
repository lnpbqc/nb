import {integer, pgTable, varchar, text, timestamp, foreignKey} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
});
export const notebookTable = pgTable("notebooks",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        title: varchar({ length: 255 }).notNull(),
        content: text().notNull(),
        authorId: integer().notNull().references(()=>usersTable.id),
        createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
    }
);
