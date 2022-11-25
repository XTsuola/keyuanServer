import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import {
  add,
  deleteData,
  findLast,
  queryAll,
  queryOne,
  update,
} from "../mongoDB/index.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import {
  decode
} from "https://deno.land/std@0.138.0/encoding/base64.ts";

import { verifyToken } from "../verifyToken/index.ts"

export function team(router: Router) {
    router
      .get("/getGroupInfo", verifyToken, async (ctx) => { // 获取分组下拉框
        const sql = {};
        const data = await queryAll(sql, "group");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "查询成功",
        };
      }).get("/getMemberList", verifyToken, async (ctx) => { // 获取成员列表
        const params = helpers.getQuery(ctx);
        let sql = {};
        if (params.group === undefined || params.group === "") {
          sql = {};
        } else {
          sql = { "group": params.group };
        }
        const data = await queryAll(sql, "member");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "查询成功",
        };
      }).post("/updateImg", verifyToken, async (ctx) => { // 修改头像
        const params = await ctx.request.body({
          type: "json",
        }).value;
        const sql = { "id": params.id };
        const res = await queryOne(sql, "user");
        if (res) {
          const baseName: string = res.img;
          if (baseName) {
            Deno.remove(`${Deno.cwd()}/public/headImg/${baseName}`);
          }
        }
        try {
          const imgName = params.id + "_" + Date.now() + ".jpg";
          const path = `${Deno.cwd()}/public/headImg/${imgName}`;
          const base64 = params.img.replace(/^data:image\/\w+;base64,/, "");
          const dataBuffer = decode(base64);
          await Deno.writeFile(path, dataBuffer);
          const param1 = { id: params.id };
          const param2 = { img: imgName };
          const data = await update(param1, param2, "user");
          ctx.response.body = {
            "code": 200,
            "rows": data,
            "msg": "修改成功",
          };
        } catch (error) {
          throw(error)
        }
      }).get("/getUserInfo", verifyToken, async (ctx) => { // 用户信息查询
        const params = helpers.getQuery(ctx);
        const sql = { "_id": new ObjectId(params._id) };
        const data = await queryOne(sql, "user");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "查询成功",
        };
      }).post("/addMember", verifyToken, async (ctx) => { // 新增成员信息
        const params = await ctx.request.body({
          type: "json",
        }).value;
        const lastInfo = await findLast("member");
        let id = 0;
        if (lastInfo.length) {
          id = lastInfo[0].id;
        }
        const sql = {
          id: id + 1,
          name: params.name,
          qq: params.qq,
          group: params.group,
          position: params.position,
          remark: params.remark,
        };
        const data = await add(sql, "member");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "新增成功",
        };
      }).post("/updateMember", verifyToken, async (ctx) => { // 修改成员信息
        const params = await ctx.request.body({
          type: "json",
        }).value;
        const param1 = { _id: new ObjectId(params._id) };
        const param2 = {
          id: params.id,
          name: params.name,
          qq: params.qq,
          group: params.group,
          position: params.position,
          remark: params.remark,
        };
        const data = await update(param1, param2, "member");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "修改成功",
        };
      }).get("/deleteMember", verifyToken, async (ctx) => { // 删除成员信息
        const params = helpers.getQuery(ctx);
        const sql = { _id: new ObjectId(params._id) };
        const data = await deleteData(sql, "member");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }).get("/getWelfareList", verifyToken, async (ctx) => { // 获取福利列表
        const sql = {};
        const data = await queryAll(sql, "welfare");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "查询成功",
        };
      }).post("/addWelfare", verifyToken, async (ctx) => { // 新增福利
        const params = await ctx.request.body({
          type: "json",
        }).value;
        const lastInfo = await findLast("welfare");
        let id = 0;
        if (lastInfo.length) {
          id = lastInfo[0].id;
        }
        const sql = { id: id + 1, remark: params.remark };
        const data = await add(sql, "welfare");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "新增成功",
        };
      }).post("/updateWelfare", verifyToken, async (ctx) => { // 修改福利
        const params = await ctx.request.body({
          type: "json",
        }).value;
        const param1 = { _id: new ObjectId(params._id) };
        const param2 = { id: params.id, remark: params.remark };
        const data = await update(param1, param2, "welfare");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "修改成功",
        };
      }).get("/deleteWelfare", verifyToken, async (ctx) => { // 删除福利
        const params = helpers.getQuery(ctx);
        const sql = { _id: new ObjectId(params._id) };
        const data = await deleteData(sql, "welfare");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }).get("/getWrcList", verifyToken, async (ctx) => { // 获取锦集列表
        const sql = {};
        const data = await queryAll(sql, "wrc");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "查询成功",
        };
      }).get("/deleteWrc", verifyToken, async (ctx) => { // 删除锦集
        const params = helpers.getQuery(ctx);
        const sql = { _id: new ObjectId(params._id) };
        const data = await deleteData(sql, "wrc");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }).post("/addWrc", verifyToken, async (ctx) => {
        const params = await ctx.request.body({ // 新增锦集
          type: "json",
        }).value;
        const lastInfo = await findLast("wrc");
        let id = 0;
        if (lastInfo.length) {
          id = lastInfo[0].id;
        }
        const sql = {
          id: id + 1,
          name: params.name,
          url: params.url,
          author: params.author,
          time: params.time,
          remark: params.remark,
        };
        const data = await add(sql, "wrc");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "新增成功",
        };
      })
  }