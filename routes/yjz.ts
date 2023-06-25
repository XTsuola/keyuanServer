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

export function yjz(router: Router): void {
  router
    .get("/yjz/getHeroList", verifyToken, async (ctx): Promise<void> => { // 获取英雄列表
      const params: any = helpers.getQuery(ctx);
      let sql: any = { name: { "$regex": params.name } };
      if (params.gender != undefined && parseInt(params.gender) != 0) {
        sql = { ...sql, gender: parseInt(params.gender) };
      }
      if (params.star != undefined && parseInt(params.star) != 0) {
        sql = { ...sql, star: parseInt(params.star) };
      }
      if (params.country != undefined && parseInt(params.country) != 0) {
        sql = { ...sql, country: parseInt(params.country) };
      }
      const total: number = await queryCount(sql, "yjzHero");
      const data: Document[] = await queryAll(
        sql,
        "yjzHero",
        parseInt(params.pageSize),
        parseInt(params.pageNo),
      );
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/yjz/addHero", verifyToken, async (ctx): Promise<void> => { // 新增英雄信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("yjzHero");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        gender: params.gender,
        star: params.star,
        country: params.country,
        link: params.link,
        skill: params.skill,
        weapon: params.weapon,
        remark: params.remark,
      };
      const data: any = await add(sql, "yjzHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/yjz/updateHero", verifyToken, async (ctx): Promise<void> => { // 修改英雄信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        gender: params.gender,
        star: params.star,
        country: params.country,
        link: params.link,
        skill: params.skill,
        weapon: params.weapon,
        remark: params.remark,
      };
      const data = await update(param1, param2, "yjzHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/yjz/deleteHero", verifyToken, async (ctx): Promise<void> => { // 删除英雄信息
      const params: any = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data: number = await deleteData(sql, "yjzHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    });
}
