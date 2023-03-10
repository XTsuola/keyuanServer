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
        jys: params.jys,
        yys: params.yys,
        sm: params.sm,
        role: params.role,
        list: params.list
      }
      const data = await update(param1, param2, "mota");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "保存成功",
      };
    }).post("/mota/login", async (ctx): Promise<void> => { // 登录
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql = { username: params.username };
      const data: Document | undefined = await queryOne(sql, "motaUser");
      if (data) {
        if (data.password == params.password) {
          const data2 = {
            _id: data._id,
            id: data.id,
            drama: data.drama
          };
          ctx.response.body = {
            "code": 200,
            "data": data2,
            "msg": "登录成功",
          };
        } else {
          ctx.response.body = {
            "code": 0,
            "msg": "密码错误",
          };
        }
      } else {
        ctx.response.body = {
          "code": 0,
          "msg": "账号不存在",
        };
      }
    }).post("/mota/updateLevel", async (ctx): Promise<void> => { // 更新楼层
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      let params2 = {}
      let sql: any = { id: 1 };
      const res: Document | undefined = await queryOne(sql, "mota");
      if (res) {
        if (params.id == 81) {
          res.role[0].level = params.level
        } else if (params.id == 82) {
          res.role[1].level = params.level
        } else if (params.id == 83) {
          res.role[2].level = params.level
        } else if (params.id == 84) {
          res.role[3].level = params.level
        }
        params2 = { level: res.level };
      }
      const data = await update({ id: 1 }, params2, "mota");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "保存成功",
      };
    })
}
