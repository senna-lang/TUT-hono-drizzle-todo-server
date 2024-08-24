import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../models";
import { eq } from "drizzle-orm";
import { cors } from "hono/cors";
import { createTodo, deleteTodo, editTodo, getAllTodos } from "../applications";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/todos/*", cors());

app.get("/", c => {
  return c.text("Hello Hono!");
});

app.get("/todos", async c => {
  const db = drizzle(c.env.DB);
  try {
    const result = await getAllTodos(db);
    return c.json(result);
  } catch (e) {
    if (e instanceof Error) {
      return c.json({ error: e.message }, 500);
    }
    return c.json({ error: "unknown error" }, 500);
  }
});

app.post("/todos", async c => {
  const params = await c.req.json<typeof todos.$inferInsert>();
  const db = drizzle(c.env.DB);
  try {
    const result = await createTodo(db, params.title);
    return c.json(result);
  } catch (e) {
    if (e instanceof Error) {
      return c.json({ error: e.message }, 500);
    }
    return c.json({ error: "unknown error" }, 500);
  }
});

app.put("/todos/:id", async c => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  try {
    const params = await c.req.json<typeof todos.$inferSelect>();
    const result = editTodo(db, id, params.title, params.status);
    return c.json(result);
  } catch (e) {
    if (e instanceof Error) {
      return c.json({ error: e.message }, 500);
    }
    return c.json({ error: "unknown error" }, 500);
  }
});

app.delete("/todos/:id", async c => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  try {
    const result = await deleteTodo(db, id);
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to delete todos" }, 500);
  }
});

export default app;
