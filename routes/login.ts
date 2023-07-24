// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import { add, findLast, queryOne, update } from "../mongoDB/index.ts";
import { create } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { key } from "../verifyToken/key.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

export function login(router: Router) {
  router
    .post("/login", async (ctx): Promise<void> => { // 登录
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql = { account: params.account };
      const data: Document | undefined = await queryOne(sql, "user");
      if (data) {
        if (data.password == params.password) {
          const jwt: string = await create({ alg: "HS512", typ: "JWT" }, {
            account: params.account,
            date: Date.now(),
          }, key);
          const data2 = {
            _id: data._id,
            id: data.id,
            img: data.img,
            level: data.level,
            paperList: data.paperList,
            userName: data.userName,
            remark: data.remark,
            token: jwt,
          };
          const sql2 = { account: params.account };
          const data3: Document | undefined = await queryOne(sql2, "token");
          if (data3) {
            const param1 = { account: data3.account };
            const param2 = { token: jwt };
            await update(param1, param2, "token");
          } else {
            const lastInfo: Document[] = await findLast("token");
            let id: number = 0;
            if (lastInfo.length) {
              id = lastInfo[0].id;
            }
            const sql3 = {
              id: id + 1,
              account: params.account,
              token: jwt,
            };
            await add(sql3, "token");
          }
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
    });
}
