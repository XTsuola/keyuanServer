// deno-lint-ignore-file
import { Router } from "https://deno.land/x/oak@v10.2.1/router.ts";
import {
  queryOne,
  update,
} from "../mongoDB/index.ts";
import { verifyToken } from "../verifyToken/index.ts";

export function chess(router: Router): void {
  router
    .get("/chess/getMap", verifyToken, async (ctx): Promise<void> => { // 象棋当前所有状态
      const data: any = await queryOne({ id: 1 }, "chess");
      const res = {
        id: 1,
        map: data.map,
        status: data.status,
        nowPlay: data.nowPlay,
      };
      ctx.response.body = {
        code: 200,
        rows: res,
        msg: "查询成功",
      };
    })
    .get("/chess/reset", verifyToken, async (ctx): Promise<void> => { // 重置棋盘
      let defaultMap = [
        [13, 14, 15, 16, 17, 16, 15, 14, 13],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 12, 0, 0, 0, 0, 0, 12, 0],
        [11, 0, 11, 0, 11, 0, 11, 0, 11],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 2, 0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 4, 5, 6, 7, 6, 5, 4, 3]
      ];
      const params = {
        map: defaultMap,
        status: 1,
        nowPlay: 1,
      };
      const data = await update({ id: 1 }, params, "chess");
      ctx.response.body = {
        code: 200,
        rows: data,
        msg: "重置成功",
      };
    })
    .post("/chess/update", verifyToken, async (ctx): Promise<void> => { // 更新棋盘
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      let status = 1;
      const obj: any = await queryOne({ id: 1 }, "chess");
      if (obj.map[params.index1][params.index2] == 17 || obj.map[params.index1][params.index2] == 7) {
        status = 2;
      }
      let indexOne: number = Math.floor(params.nowIndex / 10);
      let indexTwo: number = params.nowIndex % 10;
      obj.map[params.index1][params.index2] = params.qizi;
      obj.map[indexOne][indexTwo] = 0;
      const data = {
        map: obj.map,
        status: status,
        nowPlay: params.nowPlay == 1 ? 2 : 1,
      };
      await update({ id: 1 }, data, "chess");
      ctx.response.body = {
        code: 200,
        msg: "更新成功",
      };
    });
}
