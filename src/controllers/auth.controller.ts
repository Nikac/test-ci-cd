import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/db";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const collection = await db.collection("users");
    const userExists = await collection.findOne({ email });
    if (userExists) {
      res.status(500).json({ message: "User with this email already exists." });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashPassword,
    };
    const createUser = await collection.insertOne(newUser);
    res.status(200).json(createUser);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const collection = await db.collection("users");
    const user = await collection.findOne({ email });
    if (!email || !password) {
      res.status(400).json({message: 'Invalid email or password'});
      return;
    }
    if (!user) {
      res
        .status(404)
        .json({ message: `User with given email: ${email} doenst exist` });
      return;
    }
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      res.status(401).json({ message: "Authenticated failed" });
      return;
    }

    const token = await jwt.sign(
      { userId: user._id, email, name: user.name },
      `${process.env.SECRET_KEY}`,
      {
        expiresIn: "1h",
      }
    );
    console.log('token', token);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
