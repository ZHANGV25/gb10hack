import { MongoClient, type Db } from "mongodb";

const uri =
  process.env.MONGO_URI ?? "mongodb://127.0.0.1:27018/?directConnection=true";

let promise: Promise<MongoClient> | undefined;

function client(): Promise<MongoClient> {
  if (!promise) {
    promise = new MongoClient(uri).connect();
  }
  return promise;
}

export async function db(name?: string): Promise<Db> {
  const dbName = name ?? process.env.EXITPLAN_DB ?? "exitplan";
  return (await client()).db(dbName);
}
