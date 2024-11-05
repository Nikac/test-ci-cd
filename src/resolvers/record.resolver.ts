import { ObjectId } from "mongodb";
import { db } from "../db/db";
import { deleteRecord, updateRecord } from "../controllers/records.controller";
import { NewRecordInput } from "../models/record.model";

export const resolvers = {
  Query: {
    async records() {
      const collection = await db.collection("records");
      const records = await collection.find().toArray();
      return records;
    },
    async record(parent: any, { id }: any) {
      const collection = await db.collection("records");
      const query = { _id: new ObjectId(id) };
      const record = collection.findOne(query);

      return record;
    },
  },
  Mutation: {
    async createRecord(_: any, { record }: { record: NewRecordInput }) {
      try {
        const collection = await db.collection("records");
        const insert = await collection.insertOne(record);
        if (insert.acknowledged) {
          let rec = { ...record, id: insert.insertedId };
          return rec;
        }

        throw new Error("Failed to create record.");
      } catch (err) {
        console.log(err);
        throw new Error("something went wrong");
      }
    },
    async updateRecord(_: any, args: any) {
      try {
        const collection = await db.collection("records");
        const query = { _id: new ObjectId(args.id) };
        const updateOne = await collection.updateOne(query, {
          $set: args.record,
        });

        if (updateOne.acknowledged) {
          const findOne = await collection.findOne(query);
          return findOne;
        }
        // throw new Error("Failed to update record.");
      } catch (err) {
        console.log(err);
        throw new Error("something went wrong");
      }
    },
    async deleteRecord(_: any, { id }: any) {
      try {
        const collection = await db.collection("records");
        const query = { _id: new ObjectId(id) };
        const dbDelete = await collection.deleteOne(query);
        return dbDelete.acknowledged && dbDelete.deletedCount == 1
          ? true
          : false;
      } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
      }
    },
  },
};
