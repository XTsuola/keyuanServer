// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import {
  add,
  deleteData,
  findLast,
  queryAll,
  queryCount,
  update,
} from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { verifyToken } from "../verifyToken/index.ts";

export function wzry(router: Router): void {
  router
    .get("/wzry/getHeroList", verifyToken, async (ctx): Promise<void> => { // 获取英雄列表
      const params: any = helpers.getQuery(ctx);
      let sql = {};
      for (let key in params) {
        if (key == "name" || key == "skin") {
          sql = { ...sql, [key]: { "$regex": params[key] } };
        } else {
          if (parseInt(params[key])) {
            sql = { ...sql, [key]: parseInt(params[key]) };
          }
        }
      }
      const total: number = await queryCount(sql, "wzryHero");
      const data: Document[] = await queryAll(
        sql,
        "wzryHero",
        parseInt(params.pageSize),
        parseInt(params.pageNo),
      );
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/wzry/addHero", verifyToken, async (ctx): Promise<void> => { // 新增英雄信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("wzryHero");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        gender: params.gender,
        position: params.position,
        skin: params.skin,
        remark: params.remark,
      };
      const data: any = await add(sql, "wzryHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/wzry/updateHero", verifyToken, async (ctx): Promise<void> => { // 修改英雄信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: parseInt(params.id) };
      const param2 = {
        id: params.id,
        name: params.name,
        gender: params.gender,
        position: params.position,
        skin: params.skin,
        remark: params.remark,
      };
      const data = await update(param1, param2, "wzryHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).delete("/wzry/deleteHero", verifyToken, async (ctx): Promise<void> => { // 删除英雄信息
      const params: any = helpers.getQuery(ctx);
      const sql = { id: JSON.parse(params.id) };
      const data: number = await deleteData(sql, "wzryHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    });
}
