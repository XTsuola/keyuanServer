// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { queryOne, update } from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

export function mota(router: Router) {
  router
    .get("/mota/getMap", async (ctx): Promise<void> => { // 获取关卡地图
      let sql: any = { id: 1 };
      const res: Document | undefined = await queryOne(sql, "mota");
      ctx.response.body = {
        "code": 200,
        "rows": res,
        "msg": "查询成功",
      };
    }).post("/mota/saveMap", async (ctx): Promise<void> => { // 保存关卡地图
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: 1 };
      const param2 = {
        id: params.id,
        ...params
      };
      const data = await update(param1, param2, "mota");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "保存成功",
      };
    });
}
