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

export function yuanshen(router: Router): void {
  router
    .get("/yuanshen/getHeroList", verifyToken, async (ctx): Promise<void> => { // 获取英雄列表
      const params: any = helpers.getQuery(ctx);
      let sql: any = {};
      if (params.gender != undefined && parseInt(params.gender) != 0) {
        sql = { ...sql, gender: parseInt(params.gender) };
      }
      if (params.country != undefined && parseInt(params.country) != 0) {
        sql = { ...sql, country: parseInt(params.country) }
      }
      if (params.arms != undefined && parseInt(params.arms) != 0) {
        sql = { ...sql, arms: parseInt(params.arms) }
      }
      if (params.shuxing != undefined && parseInt(params.shuxing) != 0) {
        sql = { ...sql, shuxing: parseInt(params.shuxing) }
      }
      if (params.star != undefined && parseInt(params.star) != 0) {
        sql = { ...sql, star: parseInt(params.star) }
      }
      const total: number = await queryCount(sql, "yuanshenHero")
      const data: Document[] = await queryAll(sql, "yuanshenHero", parseInt(params.pageSize), parseInt(params.pageNo));
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/yuanshen/addHero", verifyToken, async (ctx): Promise<void> => { // 新增英雄信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("yuanshenHero");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        gender: params.gender,
        country: params.country,
        arms: params.arms,
        shuxing: params.shuxing,
        star: params.star,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data: any = await add(sql, "yuanshenHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/yuanshen/updateHero", verifyToken, async (ctx): Promise<void> => { // 修改英雄信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        gender: params.gender,
        country: params.country,
        arms: params.arms,
        shuxing: params.shuxing,
        star: params.star,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await update(param1, param2, "yuanshenHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/yuanshen/deleteHero", verifyToken, async (ctx): Promise<void> => { // 删除英雄信息
      const params: any = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data: number = await deleteData(sql, "yuanshenHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).get("/yuanshen/getWeaponList", verifyToken, async (ctx): Promise<void> => { // 获取武器列表
      const params: any = helpers.getQuery(ctx);
      let sql = {};
      if (params.type != undefined && parseInt(params.type) != 0) {
        sql = { ...sql, "type": parseInt(params.type) };
      }
      if (params.star != undefined && parseInt(params.star) != 0) {
        sql = { ...sql, "star": parseInt(params.star) }
      }
      sql = { ...sql, baseAttack: { "$regex": params.baseAttack }, attribute: { "$regex": params.attribute } }
      const total: number = await queryCount(sql, "yuanshenWeapon")
      const data: Document[] = await queryAll(sql, "yuanshenWeapon", parseInt(params.pageSize), parseInt(params.pageNo));
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/yuanshen/addWeapon", verifyToken, async (ctx): Promise<void> => { // 新增武器信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("yuanshenWeapon");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        type: params.type,
        star: params.star,
        baseAttack: params.baseAttack,
        attribute: params.attribute,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data: any = await add(sql, "yuanshenWeapon");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/yuanshen/updateWeapon", verifyToken, async (ctx): Promise<void> => { // 修改武器信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        type: params.type,
        star: params.star,
        baseAttack: params.baseAttack,
        attribute: params.attribute,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await update(param1, param2, "yuanshenWeapon");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/yuanshen/deleteWeapon", verifyToken, async (ctx): Promise<void> => { // 删除武器信息
      const params: any = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data: number = await deleteData(sql, "yuanshenWeapon");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).get("/yuanshen/getRelicsList", verifyToken, async (ctx): Promise<void> => { // 获取圣遗物列表
      const params: any = helpers.getQuery(ctx);
      let sql: any = {};
      if (params.star != undefined && parseInt(params.star) != 0) {
        sql = { ...sql, "star": parseInt(params.star) }
      }
      sql = { ...sql, tag: { "$regex": params.tag } }
      const total: number = await queryCount(sql, "yuanshenRelics")
      const data: Document[] = await queryAll(sql, "yuanshenRelics", parseInt(params.pageSize), parseInt(params.pageNo));
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/yuanshen/addRelics", verifyToken, async (ctx): Promise<void> => { // 新增圣遗物信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("yuanshenRelics");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        star: params.star,
        twoEffect: params.twoEffect,
        fourEffect: params.fourEffect,
        tag: params.tag,
        remark: params.remark,
      };
      const data = await add(sql, "yuanshenRelics");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/yuanshen/updateRelics", verifyToken, async (ctx): Promise<void> => { // 修改圣遗物信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        star: params.star,
        twoEffect: params.twoEffect,
        fourEffect: params.fourEffect,
        tag: params.tag,
        remark: params.remark,
      };
      const data = await update(param1, param2, "yuanshenRelics");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/yuanshen/deleteRelics", verifyToken, async (ctx): Promise<void> => { // 删除圣遗物信息
      const params: any = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data: number = await deleteData(sql, "yuanshenRelics");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    })
}
