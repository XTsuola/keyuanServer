// deno-lint-ignore-file
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
import { Document, ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";
import { verifyToken } from "../verifyToken/index.ts";

export function kaoshi(router: Router): void {
  router
    .get("/getQuestionList", verifyToken, async (ctx): Promise<void> => { // 获取题库列表
      const sql = {};
      const data: Document[] = await queryAll(sql, "question");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addQuestion", verifyToken, async (ctx): Promise<void> => { // 新增试题
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("question");
      let index: number = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql = {
        id: index + 1,
        stem: params.stem,
        type: params.type,
        a: params.a,
        b: params.b,
        c: params.c,
        d: params.d,
        answer: params.answer,
        remark: params.remark,
      };
      const data: any = await add(sql, "question");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updateQuestion", verifyToken, async (ctx): Promise<void> => { // 修改试题
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: params.id };
      const param2 = {
        stem: params.stem,
        type: params.type,
        a: params.a,
        b: params.b,
        c: params.c,
        d: params.d,
        answer: params.answer,
        url: params.url,
        remark: params.remark,
      };
      const data = await update(param1, param2, "question");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).delete("/deleteQuestion", verifyToken, async (ctx): Promise<void> => { // 删除试题
      const params: any = helpers.getQuery(ctx);
      const list: Document[] = await queryAll({}, "paper");
      const arr: any[] = [];
      for (let i: number = 0; i <= list.length - 1; i++) {
        const brr: any[] = [];
        for (let j: number = 0; j <= list[i].stemArr.length - 1; j++) {
          brr.push(list[i].stemArr[j].key);
        }
        arr.push(brr);
      }
      let count: number = 0;
      for (let i: number = 0; i <= arr.length - 1; i++) {
        const index: any = arr[i].findIndex((item: any): boolean =>
          item == parseInt(params.id)
        );
        if (index != -1) {
          count++;
        }
        if (count > 0) {
          break;
        }
      }
      if (count > 0) {
        ctx.response.body = {
          "code": 500,
          "msg": "该试题已被试卷绑定",
        };
      } else {
        const sql = { id: JSON.parse(params.id) };
        const data: number = await deleteData(sql, "question");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }
    }).get("/getPaperList", verifyToken, async (ctx): Promise<void> => { // 获取试卷列表
      const sql = {};
      const data: Document[] = await queryAll(sql, "paper");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addPaper", verifyToken, async (ctx): Promise<void> => { // 新增试卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("paper");
      let index: number = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql = {
        id: index + 1,
        paperName: params.paperName,
        stemArr: params.stemArr,
        score: params.score,
        time: params.time,
        remark: params.remark,
      };
      const data: any = await add(sql, "paper");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updatePaper", verifyToken, async (ctx): Promise<void> => { // 修改试卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql = { paperId: parseInt(params.id) }
      const list: Document[] = await queryAll(sql, "report");
      if (list.length > 0) {
        ctx.response.body = {
          "code": 500,
          "msg": "该试卷已被用户绑定",
        };
      } else {
        const param1 = { id: params.id };
        const param2 = {
          paperName: params.paperName,
          stemArr: params.stemArr,
          score: params.score,
          time: params.time,
          remark: params.remark,
        };
        const data = await update(param1, param2, "paper");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "修改成功",
        };
      }
    }).delete("/deletePaper", verifyToken, async (ctx): Promise<void> => { // 删除试卷
      const params = helpers.getQuery(ctx);
      const sql = { paperId: parseInt(params.id) }
      const list: Document[] = await queryAll(sql, "report");
      if (list.length > 0) {
        ctx.response.body = {
          "code": 500,
          "msg": "该试卷已被用户绑定",
        };
      } else {
        const sql = { id: parseInt(params.id) };
        const data: number = await deleteData(sql, "paper");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }
    }).get("/getStemArrList", verifyToken, async (ctx): Promise<void> => { // 获取试卷对应试题
      const params = helpers.getQuery(ctx);
      const dataList: any[] = [];
      const res: Document | undefined = await queryOne({ id: JSON.parse(params.paperId) }, "paper");
      if (res) {
        const list = res.stemArr
        for (let i: number = 0; i < list.length; i++) {
          const sql = { id: list[i].key };
          const res: Document | undefined = await queryOne(sql, "question");
          const data: any = {};
          data.id = res?.id;
          data.stem = res?.stem;
          data.type = res?.type;
          data.score = list[i].score
          dataList.push(data);
        }
        ctx.response.body = {
          "code": 200,
          "rows": dataList,
          "msg": "查询成功",
        };
      }
    }).get("/getUserList", verifyToken, async (ctx): Promise<void> => { // 获取用户列表
      const sql = {};
      const data: Document[] = await queryAll(sql, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addUser", verifyToken, async (ctx): Promise<void> => { // 新增用户
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo: Document[] = await findLast("user");
      let index: number = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql = {
        id: index + 1,
        userName: params.userName,
        account: params.account,
        password: params.password,
        age: params.age,
        img: "",
        paperList: [],
        level: params.level,
        remark: params.remark,
      };
      const data: any = await add(sql, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updateUser", verifyToken, async (ctx): Promise<void> => { // 修改用户
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: params.id };
      const param2 = {
        userName: params.userName,
        account: params.account,
        password: params.password,
        age: params.age,
        level: params.level,
        remark: params.remark,
      };
      const data = await update(param1, param2, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).delete("/deleteUser", verifyToken, async (ctx): Promise<void> => { // 删除用户
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      if (params.level != 1) {
        const sql = { "id": JSON.parse(params.id) };
        const data: Document | undefined = await queryOne(sql, "user");
        if (data && data.img != "") {
          await Deno.remove(`${Deno.cwd()}/public/headImg/${data.img}`);
        }
        await deleteData(sql, "user");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      } else {
        ctx.response.body = {
          "code": 0,
          "msg": "超级管理员不允许删除",
        };
      }
    }).get("/getStudentsPaper", verifyToken, async (ctx): Promise<void> => { // 查询所有用户关联的试卷
      const sql1 = {};
      const data: Document[] = await queryAll(sql1, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/getUserPaperList", verifyToken, async (ctx): Promise<void> => { // 获取用户对应试卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const dataList: any[] = [];
      for (let i: number = 0; i <= params.paperList.length - 1; i++) {
        const sql = { paperId: params.paperList[i], userId: params.userId };
        const res: Document | undefined = await queryOne(sql, "report");
        dataList.push(res);
      }
      ctx.response.body = {
        "code": 200,
        "rows": dataList,
        "msg": "查询成功",
      };
    }).post(
      "/getOthersPaperSelectList",
      verifyToken,
      async (ctx): Promise<void> => { // 查询剩余试卷下拉框
        const params: any = await ctx.request.body({
          type: "json",
        }).value;
        const sql = { "id": { $nin: params } };
        const data: Document[] = await queryAll(sql, "paper");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "查询成功",
        };
      },
    ).post("/addReport", verifyToken, async (ctx): Promise<void> => { // 新增答卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql1 = { id: params.userId };
      const res: Document | undefined = await queryOne(sql1, "user");
      if (res && res.paperList) {
        res.paperList.push(params.paperId);
        await update({ id: res.id }, { paperList: res.paperList }, "user");
      }
      const lastInfo: Document[] = await findLast("report");
      let index: number = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql2 = { id: params.paperId };
      const obj: Document | undefined = await queryOne(sql2, "paper");
      const arr: any[] = [];
      obj?.stemArr.length;
      for (let i: number = 0; i <= obj?.stemArr.length - 1; i++) {
        arr.push("");
      }
      const sql3 = {
        id: index + 1,
        paperId: params.paperId,
        userId: params.userId,
        paperName: obj?.paperName,
        answerArr: arr,
        score: "",
        allScore: obj?.score,
        time: obj?.time,
        flag: 0,
      };
      const data: any = await add(sql3, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/resetReport", verifyToken, async (ctx): Promise<void> => { // 重置答卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql = { id: params.paperId };
      const obj: Document | undefined = await queryOne(sql, "paper");
      const arr: any[] = [];
      obj?.stemArr.length;
      for (let i: number = 0; i <= obj?.stemArr.length - 1; i++) {
        arr.push("");
      }
      const params1 = { _id: new ObjectId(params.reportId) };
      const params2 = {
        flag: 0,
        score: "",
        answerArr: arr,
      };
      const data: any = await update(params1, params2, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "重置成功",
      };
    }).get("/getMyPaperList", verifyToken, async (ctx): Promise<void> => { // 查询当前用户的试卷
      const params: any = helpers.getQuery(ctx);
      const sql = { userId: parseInt(params.id) };
      const data: Document[] = await queryAll(sql, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data.map((item: Document) => {
          return {
            flag: item.flag,
            paperId: item.paperId,
            paperName: item.paperName,
            score: item.score,
            allScore: item.allScore,
            time: item.time,
            userId: item.userId,
          };
        }),
        "msg": "查询成功",
      };
    }).get("/getNowPaper", verifyToken, async (ctx): Promise<void> => { // 查询当前用户的试卷
      const params: any = helpers.getQuery(ctx);
      const sql1 = { id: parseInt(params.id) };
      const res1: Document | undefined = await queryOne(sql1, "paper");
      let res2: any = null;
      const resData: any[] = [];
      if (res1 && res1.stemArr) {
        for (let i: number = 0; i < res1.stemArr.length; i++) {
          const sql2 = { id: res1.stemArr[i].key };
          res2 = await queryOne(sql2, "question");
          resData.push({
            id: res2?.id,
            a: res2?.a,
            b: res2?.b,
            c: res2?.c,
            d: res2?.d,
            stem: res2?.stem,
            type: res2?.type,
          });
        }
      }
      const data = { ...res1, list: resData };
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/deleteReport", verifyToken, async (ctx): Promise<void> => { // 删除考卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql1 = { id: params.userId };
      const res: Document | undefined = await queryOne(sql1, "user");
      const index: any = res?.paperList.indexOf(params.paperId);
      res?.paperList.splice(index, 1);
      const param1 = { id: params.userId };
      const param2 = { paperList: res?.paperList };
      await update(param1, param2, "user");
      const sql3 = { id: JSON.parse(params.id) };
      const data: number = await deleteData(sql3, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).post("/autoUpdatePaper", verifyToken, async (ctx): Promise<void> => { // 自动阅卷
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const stemArr: any = JSON.parse(params.dataArr);
      let score: number = 0;
      const answerList: any[] = [];
      const scoreList: any[] = [];
      for (let i: number = 0; i <= stemArr.length - 1; i++) {
        const sql1 = { id: stemArr[i].id };
        const res1: Document | undefined = await queryOne(sql1, "question");
        let nowScore = 0;
        if (stemArr[i].answer == res1?.answer) {
          const sql2 = { id: params.paperId };
          const res2: Document | undefined = await queryOne(sql2, "paper");
          const index = res2?.stemArr.findIndex((item: any) => {
            return item.key == stemArr[i].id;
          });
          nowScore = parseFloat(res2?.stemArr[index].score)
        } else {
          if (stemArr[i].type == 5) {
            const ans: number = parseFloat(stemArr[i].answer);
            const list: any = JSON.parse(res1?.answer);
            let xs: number = 0;
            if (ans > list[0]) {
              xs = 0;
            } else if (ans > parseFloat(list[1]) && ans < list[0]) {
              xs = 0.2;
            } else if (ans > parseFloat(list[2]) && ans < parseFloat(list[1])) {
              xs = 0.4;
            } else if (ans > parseFloat(list[3]) && ans < parseFloat(list[2])) {
              xs = 0.6;
            } else if (ans > parseFloat(list[4]) && ans < parseFloat(list[3])) {
              xs = 0.8;
            } else if (ans < parseFloat(list[4])) {
              xs = 1;
            }
            const sql2 = { id: params.paperId };
            const res2: Document | undefined = await queryOne(sql2, "paper");
            const index: any = res2?.stemArr.findIndex((item: any): boolean => {
              return item.key == stemArr[i].id;
            });
            nowScore = parseFloat(res2?.stemArr[index].score) * xs
              ;
          }
        }
        scoreList.push(nowScore)
        score += nowScore
        answerList.push(stemArr[i].answer);
      }
      const param1 = {
        userId: params.userId,
        paperId: params.paperId,
      };
      const param2 = {
        answerArr: answerList,
        scoreArr: scoreList,
        score: score.toString(),
        flag: 1,
      };
      const res3 = await update(param1, param2, "report");
      ctx.response.body = {
        "code": 200,
        "rows": res3,
        "msg": "查询成功",
      };
    }).post("/getResult", verifyToken, async (ctx): Promise<void> => { // 查看试卷结果
      const params: any = await ctx.request.body({
        type: "json",
      }).value;
      const sql1 = { userId: params.userId, paperId: params.paperId };
      const res1: Document | undefined = await queryOne(sql1, "report");
      const sql2 = { id: res1?.paperId };
      const res2: Document | undefined = await queryOne(sql2, "paper");
      const arr: any[] = [];
      for (let i: number = 0; i < res2?.stemArr.length; i++) {
        const sql3 = { id: res2?.stemArr[i].key };
        const res3: Document | undefined = await queryOne(sql3, "question");
        arr.push({
          index: i,
          stemName: res3?.stem,
          rightAnswer: res3?.answer,
          remark: res3?.remark,
          type: res3?.type,
          selectArr: res3?.selectArr[i],
          score: parseFloat(res2?.stemArr[i].score),
          myScore: res1?.scoreArr[i],
          myAnswer: res1?.answerArr[i],
        });
      }
      ctx.response.body = {
        "code": 200,
        "rows": arr,
        "msg": "查询成功",
      };
    });
}
