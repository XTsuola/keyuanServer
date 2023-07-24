// deno-lint-ignore-file
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { Document } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { queryAll } from "../mongoDB/index.ts";

export async function verifyToken(ctx: any, next: any): Promise<void> {
  const headers: Headers = await ctx.request.headers;
  const token: string | null = headers.get("token");
  let shicha: number = 0;
  let flag: boolean = false;
  if (token) {
    try {
      const payload = await decode(token)[1] as any;
      if (payload) {
        const data: Document[] = await queryAll({}, "token");
        const obj: Document | undefined = data.find((item: Document): boolean =>
          item.account == payload.account
        );
        if (obj && obj.token == token) {
          flag = true;
        } else {
          flag = false;
        }
        const nowDateTime: number = Date.now();
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
