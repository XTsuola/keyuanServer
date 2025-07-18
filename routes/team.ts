// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { helpers } from "https://deno.land/x/oak@v10.2.1/mod.ts";
import {
  add,
  deleteData,
  findLast,
  queryAll,
  queryCount,
  queryOne,
  update,
} from "../mongoDB/index.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { decode } from "https://deno.land/std@0.138.0/encoding/base64.ts";
import { verifyToken } from "../verifyToken/index.ts";

export function team(router: Router): void {
  router
    .get("/getMemberList", verifyToken, async (ctx): Promise<void> => { // 获取成员列表
      const params: any = helpers.getQuery(ctx);
      let sql: any = {};
      if (params.groupName) {
        sql = { "groupName": params.groupName };
      }
      const total: number = await queryCount(sql, "member");
      const data: Document[] = await queryAll(sql, "member");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/updateImg", verifyToken, async (ctx): Promise<void> => { // 修改头像
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      try {
        const imgName: string = params.id + "_" + Date.now() + ".jpg";
        const path = `${Deno.cwd()}/public/headImg/${imgName}`;
        const base64: any = params.img.replace(/^data:image\/\w+;base64,/, "");
        const dataBuffer: Uint8Array = decode(base64);
        if (params.oldImg) {
          await Deno.remove(`${Deno.cwd()}/public/headImg/${params.oldImg}`);
        }
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
        throw (error);
      }
    }).get("/getUserInfo", verifyToken, async (ctx): Promise<void> => { // 用户信息查询
      const params: any = helpers.getQuery(ctx);
      const sql = { "id": JSON.parse(params.id) };
      const data: Document | undefined = await queryOne(sql, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addMember", verifyToken, async (ctx): Promise<void> => { // 新增成员信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("member");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = {
        id: id + 1,
        name: params.name,
        qq: params.qq,
        groupName: params.groupName,
        position: params.position,
        remark: params.remark,
      };
      const data: any = await add(sql, "member");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updateMember", verifyToken, async (ctx): Promise<void> => { // 修改成员信息
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: JSON.parse(params.id) };
      const param2 = {
        name: params.name,
        qq: params.qq,
        groupName: params.groupName,
        position: params.position,
        remark: params.remark,
      };
      const data = await update(param1, param2, "member");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).delete("/deleteMember", verifyToken, async (ctx): Promise<void> => { // 删除成员信息
      const params: any = helpers.getQuery(ctx);
      const sql = { id: JSON.parse(params.id) };
      const data: number = await deleteData(sql, "member");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).get("/getWelfareList", verifyToken, async (ctx): Promise<void> => { // 获取福利列表
      const sql = {};
      const data: Document[] = await queryAll(sql, "welfare");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addWelfare", verifyToken, async (ctx): Promise<void> => { // 新增福利
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("welfare");
      let id: number = 0;
      if (lastInfo.length) {
        id = lastInfo[0].id;
      }
      const sql = { id: id + 1, remark: params.remark };
      const data: any = await add(sql, "welfare");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updateWelfare", verifyToken, async (ctx): Promise<void> => { // 修改福利
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: JSON.parse(params.id) };
      const param2 = { remark: params.remark };
      const data = await update(param1, param2, "welfare");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).delete("/deleteWelfare", verifyToken, async (ctx): Promise<void> => { // 删除福利
      const params: any = helpers.getQuery(ctx);
      const sql = { id: JSON.parse(params.id) };
      const data: number = await deleteData(sql, "welfare");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).get("/getWrcList", verifyToken, async (ctx): Promise<void> => { // 获取锦集列表
      const params: any = helpers.getQuery(ctx);
      const sql = {};
      const total: number = await queryCount(sql, "wrc");
      const data: Document[] = await queryAll(sql, "wrc", parseInt(params.pageSize), parseInt(params.pageNo),);
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "total": total,
        "msg": "查询成功",
      };
    }).post("/addWrc", verifyToken, async (ctx): Promise<void> => {
      const params: any = await ctx.request.body({ // 新增锦集
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("wrc");
      let id: number = 0;
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
      const data: any = await add(sql, "wrc");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).delete("/deleteWrc", verifyToken, async (ctx): Promise<void> => { // 删除锦集
      const params: any = helpers.getQuery(ctx);
      const sql = { id: JSON.parse(params.id) };
      const data: number = await deleteData(sql, "wrc");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    })
}
