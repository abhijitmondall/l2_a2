import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

import { userService } from "../modules/user/user.service";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Getting token and check if it's exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error("You are not logged in! Please log in to get access!");
    }

    // 2. Verify the token
    const { email } = jwt.verify(
      token,
      config.jwt_secret as string
    ) as JwtPayload;

    // 3. Check if user still exists
    const currentUser = await userService.getUserByEmail(email);

    console.log(currentUser);
    if (!currentUser) {
      throw new Error(
        " You don not have permission to perform this action!(Invalid Email/User)"
      );
    }

    // 4 Grand Access to protected route
    req.user = currentUser;
    next();
  } catch (err: any) {
    console.log(err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Here Roles will be an Array
      if (!roles.includes(req?.user?.role)) {
        throw new Error("You don not have permission to perform this action!");
      }

      next();
    } catch (err: any) {
      console.log(err);
      res.status(403).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export const auth = {
  protect,
  restrictTo,
};
