import express from "express";
import {
  addRecord,
  deleteRecord,
  getRecord,
  getRecords,
  updateRecord,
} from "../controllers/records.controller";
import { verifyToken } from "../middlewares/auth.middleware";
export const recordsRouter = express.Router();

recordsRouter.get("/", getRecords);
recordsRouter.get("/:id", verifyToken, getRecord);
recordsRouter.post("/", verifyToken, addRecord);
recordsRouter.put("/:id", verifyToken, updateRecord);
recordsRouter.delete("/:id", verifyToken, deleteRecord);
