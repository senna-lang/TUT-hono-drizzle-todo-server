import { DrizzleD1Database } from "drizzle-orm/d1";
import { todos } from "../models";
import { eq } from "drizzle-orm";

export const getAllTodos = async (
  db: DrizzleD1Database<Record<string, never>>
) => {
  try {
    const result = await db.select().from(todos).all();
    return result;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw new Error("Failed to fetch todos");
  }
};

export const createTodo = async (
  db: DrizzleD1Database<Record<string, never>>,
  title: (typeof todos.$inferInsert)["title"]
) => {
  try {
    const result = await db.insert(todos).values({ title }).execute();
    return result;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw new Error("Failed to create todo");
  }
};

export const editTodo = async (
  db: DrizzleD1Database<Record<string, never>>,
  id: (typeof todos.$inferSelect)["id"],
  title: (typeof todos.$inferSelect)["title"],
  status: (typeof todos.$inferSelect)["status"]
) => {
  try {
    const result = await db
      .update(todos)
      .set({ title, status })
      .where(eq(todos.id, id));
    return result;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo");
  }
};

export const deleteTodo = async (
  db: DrizzleD1Database<Record<string, never>>,
  id: (typeof todos.$inferSelect)["id"]
) => {
  try {
    const result = await db.delete(todos).where(eq(todos.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw new Error("Failed to delete todo");
  }
};
