import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const newUser = await authService.signup(req.body);
    newUser.rows[0].password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: newUser.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signin(email, password);

    res.status(200).json({
      success: true,
      message: "User signin successful!",
      data: user,
    });
  } catch (err: any) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signup,
  signin,
};
