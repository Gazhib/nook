const { serve } = require("@hono/node-server");
const { Hono } = require("hono");

const app = new Hono();

app.get("/health", (c) => {
  return c.json({ ok: true });
});


serve({fetch: app.fetch, port: 4000}, () => {
  console.log("Server is running on 4000")
})
