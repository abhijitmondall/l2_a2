import express from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.get(
  "/",
  auth.protect,
  auth.restrictTo("admin"),
  userController.getUsers
);

router.put("/:userId", auth.protect, userController.updateUser);

router.delete(
  "/:userId",
  auth.protect,
  auth.restrictTo("admin"),
  userController.deleteUser
);

export const userRoutes = router;
