import { ObjectId } from "mongodb";

export interface NewRecordInput {
  name: string;
  position: string;
  level: string;
}

export interface Record {
  _id: ObjectId;
  name: string;
  position: string;
  level: string;
}
