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
import { ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

import { verifyToken } from "../verifyToken/index.ts";

export function xingta(router: Router) {
  router
    .get("/xingta/getHeroList", verifyToken, async (ctx) => { // 获取英雄列表
      const params = helpers.getQuery(ctx);
      const sql = {};
      const total = await queryCount(sql, "xingtaHero");
      const data = await queryAll(
        sql,
        "xingtaHero",
        parseInt(params.pageSize),
        parseInt(params.pageNo),
      );
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/xingta/addHero", verifyToken, async (ctx) => { // 新增英雄信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("xingtaHero");
      let id = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        title: params.title,
        mainShuxing: params.mainShuxing,
        otherShuxing: params.otherShuxing,
        weapon: params.weapon,
        gongfa: params.gongfa,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await add(sql, "xingtaHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/xingta/updateHero", verifyToken, async (ctx) => { // 修改英雄信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        title: params.title,
        mainShuxing: params.mainShuxing,
        otherShuxing: params.otherShuxing,
        weapon: params.weapon,
        gongfa: params.gongfa,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await update(param1, param2, "xingtaHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/xingta/deleteHero", verifyToken, async (ctx) => { // 删除英雄信息
      const params = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data = await deleteData(sql, "xingtaHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    });
}
