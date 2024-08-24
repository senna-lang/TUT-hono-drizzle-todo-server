import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  status: text("status", { enum: ["todo", "active", "completed"] }).default(
    "todo"
  ),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
