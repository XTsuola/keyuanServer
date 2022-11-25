// deno-lint-ignore-file
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { queryAll } from "../mongoDB/index.ts";

export async function verifyToken(ctx: any, next: any) {
  
  const headers: Headers = await ctx.request.headers;
  const token = headers.get("token");
  let shicha: number = 0;
  let flag: boolean = false;
  if (token) {
    try {
      const payload = await decode(token)[1] as any;
      if (payload) {
        const data = await queryAll({}, "token");
        const obj = data.find((item) => item.account == payload.account);
        if (obj && obj.token == token) {
          flag = true;
        } else {
          flag = false;
        }
        const nowDateTime = Date.now();
        shicha = parseFloat(((nowDateTime - payload.date) / 60000).toFixed(2));
      }
    } catch (_) {
      ctx.response.body = {
        "code": 401,
        "msg": "身份已经过期，请重新登录！",
      };
      return;
    }
  }
  if (token && shicha < 600 && flag) {
    await next();
    return;
  } else {
    ctx.response.body = {
      "code": 401,
      "msg": "身份已经过期，请重新登录！",
    };
    return;
  }
}
