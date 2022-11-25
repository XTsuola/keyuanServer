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
import { ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

import { verifyToken } from "../verifyToken/index.ts"

export function mhmnz(router: Router) {
  router
    .get("/mhmnz/getHeroList", verifyToken, async (ctx) => { // 获取英雄列表
      const params = helpers.getQuery(ctx);
      let sql = {};
      if (params.star != undefined && parseInt(params.star) != 0) {
        sql = {...sql, "star": parseInt(params.star)}
      }
      if (params.gender != undefined && parseInt(params.gender) != 0) {
        sql = { ...sql, "gender": parseInt(params.gender) };
      }
      if(params.camp != undefined && parseInt(params.camp) != 0) {
        const res = await queryAll({}, "mhmnzHero")
        const idArr = []
        for(let i=0;i<res.length;i++) {
          if(res[i].camp.findIndex((item:number) => item == parseInt(params.camp)) != -1) {
            idArr.push({id: res[i].id})
          }
        }
        sql = { ...sql, $or: idArr }
      }
      const total = await queryCount(sql, "mhmnzHero")
      const data = await queryAll(sql, "mhmnzHero",parseInt(params.pageSize),parseInt(params.pageNo));
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/mhmnz/addHero", verifyToken, async (ctx) => { // 新增英雄信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("mhmnzHero");
      let id = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        gender: params.gender,
        star: params.star,
        camp: params.camp,
        exclusive: params.exclusive,
        superSkill: params.superSkill,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await add(sql, "mhmnzHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/mhmnz/updateHero", verifyToken, async (ctx) => { // 修改英雄信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        gender: params.gender,
        star: params.star,
        camp: params.camp,
        exclusive: params.exclusive,
        superSkill: params.superSkill,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await update(param1, param2, "mhmnzHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/mhmnz/deleteHero", verifyToken, async (ctx) => { // 删除英雄信息
      const params = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data = await deleteData(sql, "mhmnzHero");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).get("/mhmnz/getArmsList", verifyToken, async (ctx) => { // 获取兵种列表
        const params = helpers.getQuery(ctx);
        let sql = {};
        if (params.type === undefined || parseInt(params.type) == 0) {
          sql = {};
        } else {
          sql = { "type": parseInt(params.type) };
        }
        const total = await queryCount(sql, "mhmnzArms")
        const data = await queryAll(sql, "mhmnzArms",parseInt(params.pageSize),parseInt(params.pageNo));
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "total": total,
          "msg": "查询成功",
        };
    }).post("/mhmnz/addArms", verifyToken, async (ctx) => { // 新增兵种信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("mhmnzArms");
      let id = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        type: params.type,
        life: params.life,
        att: params.att,
        def: params.def,
        mof: params.mof,
        talent: params.talent,
        remark: params.remark,
      };
      const data = await add(sql, "mhmnzArms");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/mhmnz/updateArms", verifyToken, async (ctx) => { // 修改兵种信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        type: params.type,
        life: params.life,
        att: params.att,
        def: params.def,
        mof: params.mof,
        talent: params.talent,
        remark: params.remark,
      };
      const data = await update(param1, param2, "mhmnzArms");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/mhmnz/deleteArms", verifyToken, async (ctx) => { // 删除兵种信息
      const params = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data = await deleteData(sql, "mhmnzArms");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).get("/mhmnz/getWeaponList", verifyToken, async (ctx) => { // 获取武器列表
      const params = helpers.getQuery(ctx);
      let sql = {};
      if (params.star != undefined && parseInt(params.star) != 0) {
        sql = {...sql, "star": parseInt(params.star)}
      }
      if (params.weaponType != undefined && parseInt(params.weaponType) != 0) {
        sql = { ...sql, "weaponType": parseInt(params.weaponType) };
      }
      if (params.isExclusive != undefined && parseInt(params.isExclusive) != 0) {
        sql = { ...sql, "isExclusive": parseInt(params.isExclusive) };
      }
      const total = await queryCount(sql, "mhmnzWeapon")
      const data = await queryAll(sql, "mhmnzWeapon",parseInt(params.pageSize),parseInt(params.pageNo));
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/mhmnz/addWeapon", verifyToken, async (ctx) => { // 新增武器信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("mhmnzWeapon");
      let id = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        star: params.star,
        weaponType: params.weaponType,
        isExclusive: params.isExclusive,
        shuxing: params.shuxing,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await add(sql, "mhmnzWeapon");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/mhmnz/updateWeapon", verifyToken, async (ctx) => { // 修改武器信息
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { _id: new ObjectId(params._id) };
      const param2 = {
        id: params.id,
        name: params.name,
        star: params.star,
        weaponType: params.weaponType,
        isExclusive: params.isExclusive,
        shuxing: params.shuxing,
        introduce: params.introduce,
        remark: params.remark,
      };
      const data = await update(param1, param2, "mhmnzWeapon");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/mhmnz/deleteWeapon", verifyToken, async (ctx) => { // 删除武器信息
      const params = helpers.getQuery(ctx);
      const sql = { _id: new ObjectId(params._id) };
      const data = await deleteData(sql, "mhmnzWeapon");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    })
}
