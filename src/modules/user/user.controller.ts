import { Request, Response } from "express";
import { userService } from "./user.service";
import { bookingService } from "../booking/booking.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) throw new Error("Invalid ID");

    if (req.user?.role === "customer") {
      if (+req.user?.id !== +userId) {
        throw new Error("You do not have permission to update this user!");
      }
    }

    const getUserByID = await userService.getUserByID(userId);

    if (!getUserByID) {
      throw new Error(`No User Found with this id: ${userId}`);
    }

    let { name, email, password, role, phone } = req.body;

    if (!name) name = getUserByID?.name;
    if (!email) email = getUserByID?.email;
    if (!password) password = getUserByID?.password;
    if (!role) role = getUserByID?.role;
    if (!phone) phone = getUserByID?.phone;

    if ((password as string).trim().length < 6) {
      throw new Error("Password at least be 6 characters long!");
    }

    const updatedUser = await userService.updateUser({
      name,
      email,
      password,
      role,
      phone,
      userId,
    });

    if (!updatedUser) {
      throw new Error(`No User Found with this id: ${userId}`);
    }

    res.status(200).json({
      success: true,
      message: "User Updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const bookings = await bookingService.getOwnBookings(userId as string);
    if (bookings.length !== 0) {
      throw new Error("You can not delete this user. He/She has booking!");
    }

    await userService.deleteUser(userId as string);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteUser,
};
