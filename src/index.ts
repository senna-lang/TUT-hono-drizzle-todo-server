import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "./db/schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", c => {
  return c.text("Hello Hono!");
});

app.get("/todos", async c => {
  const db = drizzle(c.env.DB);
  try {
    const result = await db.select().from(todos).all();
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

app.post("/todos", async c => {
  const params = await c.req.json<typeof todos.$inferInsert>();
  const db = drizzle(c.env.DB);
  try {
    const result = await db
      .insert(todos)
      .values({ title: params.title })
      .execute();
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to create  todos" }, 500);
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
    const result = await db
      .update(todos)
      .set({ title: params.title, status: params.status })
      .where(eq(todos.id, id));
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to update todos" }, 500);
  }
});

app.delete("/todos/:id", async c => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  if (isNaN(id)) {
    return c.json({ error: "Invalid id" }, 400);
  }

  try {
    const result = await db
      .delete(todos)
      .where(eq(todos.id, id));
    return c.json(result);
  } catch (e) {
    return c.json({ error: "Failed to delete todos" }, 500);
  }
});

export default app;
