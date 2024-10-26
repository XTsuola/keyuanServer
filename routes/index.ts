import { Router } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import { login } from "./login.ts";
import { team } from "./team.ts";
import { kaoshi } from "./kaoshi.ts";
import { wzry } from "./wzry.ts";
import { mhmnz } from "./mhmnz.ts";
import { yuanshen } from "./yuanshen.ts";
import { yys } from "./yys.ts";
import { hywz } from "./hywz.ts"
import { xingta } from "./xingta.ts";
import { myLove } from "./myLove.ts";
import { mota } from "./mota.ts";

const router = new Router();

login(router);
team(router);
kaoshi(router);
wzry(router);
mhmnz(router);
yuanshen(router);
yys(router);
hywz(router);
xingta(router);
myLove(router);
mota(router);

export default router;
