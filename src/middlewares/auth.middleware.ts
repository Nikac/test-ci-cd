import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(403).json({ message: "Access denied" });
    return;
  }
  try {
    const user = await jwt.verify(token, `${process.env.SECRET_KEY}`);

    if (!user) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    // @ts-ignore
    req.userId = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token" });
  }
};
