import { Router } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { login } from "./login.ts"
import { team } from "./team.ts"
import { kaoshi } from "./kaoshi.ts"
import { mhmnz } from "./mhmnz.ts"
import { yuanshen } from "./yuanshen.ts"

const router = new Router();

login(router)
team(router)
kaoshi(router)
mhmnz(router)
yuanshen(router)

export default router