// deno-lint-ignore-file
import {
  MongoClient,
} from "https://deno.land/x/mongo@v0.29.3/mod.ts";

const client = new MongoClient();
await client.connect("mongodb://127.0.0.1:27017");
const db = client.database("keyuan");

// 查询总数
export async function queryCount(
  data: any,
  tableName: string
) {
  const result = await db.collection(tableName).count(data)
  return result;
}

// 查询所有
export async function queryAll(
  data: any,
  tableName: string,
  pageSize?: number,
  pageNo?: number
) {
  if(pageSize && pageNo) {
    const result = await db.collection(tableName).find(data).limit(pageSize).skip((pageNo-1)*pageSize).toArray();
    return result;
  } else {
    const result = await db.collection(tableName).find(data).toArray();
    return result;
  }
}

// 查询单条信息
export async function queryOne(
  data: any,
  tableName: string,
) {
  const result = await db.collection(tableName).findOne(data);
  return result;
}

// 新增数据
export async function add(
  data: any,
  tableName: string,
) {
  const result = await db.collection(tableName).insertOne(data);
  return result;
}

// 修改数据
export async function update(data1: any, data2: any, tableName: string) {
  const result = await db.collection(tableName).updateOne(data1, {
    $set: data2,
  });
  return result;
}

// 查询最后一条数据
export async function findLast(tableName: string) {
  const result = await db.collection(tableName).find({}).sort({ _id: -1 })
    .limit(1).toArray();
  return result;
}

// 删除数据
export async function deleteData(data: any, tableName: string) {
  const result = await db.collection(tableName).deleteOne(data);
  return result;
}

// 修改所有数据
export async function updateAll(data1: any, data2: any, tableName: string) {
  const result = await db.collection(tableName).updateMany(data1, {
    $set: data2,
  });
  return result;
}
