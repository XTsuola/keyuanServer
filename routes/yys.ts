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
import { Document, ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { verifyToken } from "../verifyToken/index.ts";

export function yys(router: Router): void {
  router
    .get("/yys/getHeroList", verifyToken, async (ctx): Promise<void> => { // 获取式神列表
      const params: any = helpers.getQuery(ctx);
      let sql: any = {};
      for (let key in params) {
        if (key == "name") {
          sql = { ...sql, [key]: { "$regex": params[key] } };
        } else {
          if (parseInt(params[key])) {
            sql = { ...sql, [key]: parseInt(params[key]) };
          }
        }
      }
      const total: number = await queryCount(sql, "yinyangshiHero");
      const data: Document[] = await queryAll(
        sql,
        "yinyangshiHero",
        parseInt(params.pageSize),
        parseInt(params.pageNo),
      );
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/yys/addHero", verifyToken, async (ctx): Promise<void> => { // 新增式神信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("yinyangshiHero");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        gender: params.gender,
        star: params.star,
        gj: params.gj,
        sm: params.sm,
        fy: params.fy,
        sd: params.sd,
        bj: params.bj,
        bs: params.bs,
        mz: params.mz,
        dk: params.dk,
        remark: params.remark,
      };
      const data: any = await add(sql, "yinyangshiHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/yys/updateHero", verifyToken, async (ctx): Promise<void> => { // 修改式神信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        gender: params.gender,
        star: params.star,
        gj: params.gj,
        sm: params.sm,
        fy: params.fy,
        sd: params.sd,
        bj: params.bj,
        bs: params.bs,
        mz: params.mz,
        dk: params.dk,
        remark: params.remark,
      };
      const data = await update(param1, param2, "yinyangshiHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/yys/deleteHero", verifyToken, async (ctx): Promise<void> => { // 删除式神信息
      const params: any = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data: number = await deleteData(sql, "yinyangshiHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    });
}
