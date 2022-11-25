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
import { ObjectId } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

import { verifyToken } from "../verifyToken/index.ts"

export function kaoshi(router: Router) {
  router
    .get("/getQuestionList", verifyToken, async (ctx) => { // 获取题库列表
      const sql = {};
      const data = await queryAll(sql, "question");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addQuestion", verifyToken, async (ctx) => { // 新增试题
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("question");
      let index = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql = {
        id: index + 1,
        stem: params.stem,
        type: params.type,
        selectArr: params.selectArr,
        anwser: params.anwser,
        url: params.url,
        remark: params.remark,
      };
      const data = await add(sql, "question");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updateQuestion", verifyToken, async (ctx) => { // 修改试题
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const param1 = { id: params.id };
      const param2 = {
        stem: params.stem,
        type: params.type,
        selectArr: params.selectArr,
        anwser: params.anwser,
        url: params.url,
        remark: params.remark,
      };
      const data = await update(param1, param2, "question");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "修改成功",
      };
    }).get("/deleteQuestion", verifyToken, async (ctx) => { // 删除试题
      const params = helpers.getQuery(ctx);
      const list = await queryAll({}, "paper");
      const arr = []
      for(let i=0;i<=list.length-1;i++){
        const brr = []
        for(let j=0;j<=list[i].stemArr.length-1;j++){
          brr.push(list[i].stemArr[j].key)
        }
        arr.push(brr)
      }
      let count = 0;
      for(let i=0;i<=arr.length-1;i++){
        const index = arr[i].findIndex(item => item == parseInt(params.id))
        if(index != -1) {
          count++
        }
        if(count > 0) {
          break
        }
      }
      if(count > 0) {
        ctx.response.body = {
          "code": 500,
          "msg": "该试题已被试卷绑定",
        };
      } else {
        const sql = { _id: new ObjectId(params._id) };
        const data = await deleteData(sql, "question");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }
    }).get("/getPaperList", verifyToken, async (ctx) => { // 获取试卷列表
      const sql = {};
      const data = await queryAll(sql, "paper");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addPaper", verifyToken, async (ctx) => { // 新增试卷
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("paper");
      let index = 0;
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
      const data = await add(sql, "paper");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updatePaper", verifyToken, async (ctx) => { // 修改试卷
      const params = await ctx.request.body({
        type: "json",
      }).value;
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
    }).get("/deletePaper", verifyToken, async (ctx) => { // 删除试卷
      const params = helpers.getQuery(ctx);
      const list = await queryAll({}, "report");
      const arr = []
      for(let i=0;i<=list.length-1;i++){
        arr.push(list[i].paperId)
      }
      let count = 0;
      for(let i=0;i<=arr.length-1;i++){
        if(arr[i] == parseInt(params.id)) {
          count++
        }
        if(count > 0) {
          break
        }
      }
      if(count > 0) {
        ctx.response.body = {
          "code": 500,
          "msg": "该试卷已被用户绑定",
        };
      } else {
        const sql = { _id: new ObjectId(params._id) };
        const data = await deleteData(sql, "paper");
        ctx.response.body = {
          "code": 200,
          "rows": data,
          "msg": "删除成功",
        };
      }
    }).post("/getStemArrList", verifyToken, async (ctx) => { // 获取试卷对应试题
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const dataList = [];
      for (let i = 0; i <= params.length - 1; i++) {
        const sql = { id: params[i] };
        const res = await queryOne(sql, "question");
        dataList.push(res);
      }
      ctx.response.body = {
        "code": 200,
        "rows": dataList,
        "msg": "查询成功",
      };
    }).get("/getUserList", verifyToken, async (ctx) => { // 获取用户列表
      const sql = {};
      const data = await queryAll(sql, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addUser", verifyToken, async (ctx) => { // 新增用户
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const lastInfo = await findLast("user");
      let index = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql = {
        id: index + 1,
        userName: params.userName,
        account: params.account,
        password: params.password,
        age: params.age,
        level: params.level,
        remark: params.remark,
      };
      const data = await add(sql, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).post("/updateUser", verifyToken, async (ctx) => { // 修改用户
      const params = await ctx.request.body({
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
    }).post("/deleteUser", verifyToken, async (ctx) => { // 删除用户
      const params = await ctx.request.body({
        type: "json",
      }).value;
      if (params.level != 1) {
        const sql = { _id: new ObjectId(params._id) };
        const data = await deleteData(sql, "user");
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
    }).get("/getStudentsPaper", verifyToken, async (ctx) => { // 查询所有用户关联的试卷
      const sql1 = {};
      const data = await queryAll(sql1, "user");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/getUserPaperList", verifyToken, async (ctx) => { // 获取用户对应试卷
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const dataList = [];
      for (let i = 0; i <= params.paperList.length - 1; i++) {
        const sql = { paperId: params.paperList[i], userId: params.userId };
        const res = await queryOne(sql, "report");
        dataList.push(res);
      }
      ctx.response.body = {
        "code": 200,
        "rows": dataList,
        "msg": "查询成功",
      };
    }).post("/getOthersPaperSelectList", verifyToken, async (ctx) => { // 查询剩余试卷下拉框
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const sql = { "id": { $nin: params } };
      const data = await queryAll(sql, "paper");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/addReport", verifyToken, async (ctx) => { // 新增答卷
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const sql1 = { id: params.userId };
      const res = await queryOne(sql1, "user");
      if (res && res.paperList) {
        res.paperList.push(params.paperId);
        await update({ id: res.id }, { paperList: res.paperList }, "user");
      }
      const lastInfo = await findLast("report");
      let index = 0;
      if (lastInfo.length) {
        index = lastInfo[0].id;
      }
      const sql2 = { id: params.paperId };
      const obj = await queryOne(sql2, "paper");
      const arr = [];
      obj?.stemArr.length;
      for (let i = 0; i <= obj?.stemArr.length - 1; i++) {
        arr.push("");
      }
      const sql3 = {
        id: index + 1,
        paperId: params.paperId,
        userId: params.userId,
        paperName: obj?.paperName,
        anwserArr: arr,
        score: "",
        allScore: obj?.score,
        time: obj?.time,
        flag: true,
      };
      const data = await add(sql3, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "新增成功",
      };
    }).get("/getMyPaperlist", verifyToken, async (ctx) => { // 查询当前用户的试卷
      const params = helpers.getQuery(ctx);
      const sql1 = { id: parseInt(params.id) };
      const res = await queryOne(sql1, "user");
      const paperList = res?.paperList;
      const sql2 = { paperId: { $in: paperList }, userId: parseInt(params.id) };
      const data = await queryAll(sql2, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data.map((item) => {
          return {
            flag: item.flag,
            paperId: item.paperId,
            paperName: item.paperName,
            score: item.score,
            allScore: item.allScore,
            time: item.time,
            userId: item.userId,
            _id: item._id,
          };
        }),
        "msg": "查询成功",
      };
    }).get("/getNowPaper", verifyToken, async (ctx) => { // 查询当前用户的试卷
      const params = helpers.getQuery(ctx);
      const sql1 = { id: parseInt(params.id) };
      const res1 = await queryOne(sql1, "paper");
      let res2 = null;
      const resData = [];
      if (res1 && res1.stemArr) {
        for (let i = 0; i < res1.stemArr.length; i++) {
          const sql2 = { id: res1.stemArr[i].key };
          res2 = await queryOne(sql2, "question");
          resData.push({
            _id: res2?._id,
            id: res2?.id,
            selectArr: res2?.selectArr,
            stem: res2?.stem,
            url: res2?.url,
            type: res2?.type
          })
        }
      }
      const data = { ...res1, list: resData };
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "查询成功",
      };
    }).post("/deleteReport", verifyToken, async (ctx) => { // 删除考卷
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const sql1 = { id: params.userId };
      const res = await queryOne(sql1, "user");
      const index = res?.paperList.indexOf(params.paperId);
      res?.paperList.splice(index, 1);
      const param1 = { id: params.userId };
      const param2 = { paperList: res?.paperList };
      await update(param1, param2, "user");
      const sql3 = { _id: new ObjectId(params._id) };
      const data = await deleteData(sql3, "report");
      ctx.response.body = {
        "code": 200,
        "rows": data,
        "msg": "删除成功",
      };
    }).post("/autoUpdatePaper", verifyToken, async (ctx) => { // 自动阅卷
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const stemArr = JSON.parse(params.dataArr);
      let score = 0;
      const anwserList = [];
      for (let i = 0; i <= stemArr.length - 1; i++) {
        const sql1 = { id: stemArr[i].id };
        const res1 = await queryOne(sql1, "question");
        if (stemArr[i].anwser == res1?.anwser) {
          const sql2 = { id: params.paperId };
          const res2 = await queryOne(sql2, "paper")
          const index = res2?.stemArr.findIndex((item:any) => {
            return item.key == stemArr[i].id
          })
          score += parseFloat(res2?.stemArr[index].score)
        }
        anwserList.push(stemArr[i].anwser);
      }
      const param1 = {
        userId: params.userId,
        paperId: params.paperId,
      };
      const param2 = {
        anwserArr: anwserList,
        score: score.toString(),
        flag: false,
      };
      const res3 = await update(param1, param2, "report");
      ctx.response.body = {
        "code": 200,
        "rows": res3,
        "msg": "查询成功",
      };
    }).post("/getResult", verifyToken, async (ctx) => { // 查看试卷结果
      const params = await ctx.request.body({
        type: "json",
      }).value;
      const sql1 = { userId: params.userId, paperId: params.paperId };
      const res1 = await queryOne(sql1, "report");
      const sql2 = { id: res1?.paperId };
      const res2 = await queryOne(sql2, "paper");
      const arr = [];
      for (let i = 0; i < res2?.stemArr.length; i++) {
        const sql3 = { id: res2?.stemArr[i].key };
        const res3 = await queryOne(sql3, "question");
        arr.push({
          index: i,
          stemName: res3?.stem,
          rightAnwser: res3?.anwser,
          remark: res3?.remark,
          type: res3?.type,
          selectArr: res3?.selectArr,
          myAnwser: res1?.anwserArr[i],
        });
      }
      ctx.response.body = {
        "code": 200,
        "rows": arr,
        "msg": "查询成功",
      };
    });
}
