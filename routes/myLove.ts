// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import {
  queryCount,
  add,
  deleteData,
  findLast,
  queryAll,
  update,
} from "../mongoDB/index.ts";
import { Document, ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

import { verifyToken } from "../verifyToken/index.ts"

export function myLove(router: Router): void {
  router
    .get("/myLove/getCookList", verifyToken, async (ctx): Promise<void> => { // 获取菜谱列表
      const params: any = helpers.getQuery(ctx);
      let sql: any = {};
      if (params.cookType != undefined && parseInt(params.cookType) != 0) {
        sql = { ...sql, "cookType": parseInt(params.cookType) }
      }
      if (params.hunsu != undefined && parseInt(params.hunsu) != 0) {
        sql = { ...sql, "hunsu": parseInt(params.hunsu) }
      }
      if (params.mastery != undefined && parseInt(params.mastery) != 0) {
        sql = { ...sql, "mastery": parseInt(params.mastery) }
      }
      sql = { ...sql, name: { "$regex": params.name } }
      const total: number = await queryCount(sql, "cook")
      const data: Document[] = await queryAll(sql, "cook", parseInt(params.pageSize), parseInt(params.pageNo));
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/myLove/addCook", verifyToken, async (ctx): Promise<void> => { // 新增菜谱
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("cook");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        cookType: params.cookType,
        hunsu: params.hunsu,
        mastery: params.mastery,
        foodMaterials: params.foodMaterials,
        practice: params.practice,
        count: params.count,
        remark: params.remark,
      };
      const data: any = await add(sql, "cook");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/myLove/updateCook", verifyToken, async (ctx): Promise<void> => { // 修改菜谱
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        cookType: params.cookType,
        hunsu: params.hunsu,
        mastery: params.mastery,
        foodMaterials: params.foodMaterials,
        practice: params.practice,
        count: params.count,
        remark: params.remark,
      };
      const data = await update(param1, param2, "cook");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/myLove/deleteCook", verifyToken, async (ctx): Promise<void> => { // 删除菜谱
      const params: any = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data: number = await deleteData(sql, "cook");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    })
}
