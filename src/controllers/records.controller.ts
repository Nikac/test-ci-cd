import { NextFunction, Request, Response } from "express";
import { db } from "../db/db";
import { ObjectId } from "mongodb";

export const getRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collection = await db.collection("records");
    const records = await collection.find().toArray();
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};

export const getRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collection = await db.collection("records");
    let query = { _id: new ObjectId(req.params.id) };
    const record = await collection.findOne(query);
    if (!record) {
      res
        .status(404)
        .json({ message: `Record with given ID: ${req.params.id} not found` });
    }
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const addRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newRecord = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };

    const collection = await db.collection("records");
    const record = await collection.insertOne(newRecord);
    res.status(204).json({ message: "Record saved", record: record });
  } catch (err) {
    next(err);
  }
};

export const updateRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const record = await collection.findOne(query);
    if (!record) {
      res
        .status(404)
        .json({ message: `Record with given ID: ${req.params.id} not found` });
    }
    const updatedRecord = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const updateRecord = await collection.updateOne(query, updatedRecord);
    res.status(200).json({
      message: `Succesfully updated record with ID ${req.params.id}`,
      record,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const record = await collection.findOne(query);
    if (!record) {
      res
        .status(404)
        .json({ message: `Record with given ID: ${req.params.id} not found` });
    }
    const deletedRec = await collection.deleteOne(query);
    res.status(200).json({
      message: `deleted record with given ID: ${req.params.id}`,
      record: deletedRec,
    });
  } catch (err) {
    next(err);
  }
};
