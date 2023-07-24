import { Application } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import router from "./routes/index.ts";
const app = new Application();

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context, next: () => Promise<unknown>): Promise<void> => {
  try {
    await context.send({
      root: `${Deno.cwd()}/public`,
    });
  } catch {
    next();
  }
});

await app.listen({ port: 7147 });
