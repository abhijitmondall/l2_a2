import express from "express";

import { auth } from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.get("/", vehicleController.getVehicles);
router.get("/:vehicleId", vehicleController.getVehicle);

router.post(
  "/",
  auth.protect,
  auth.restrictTo("admin"),
  vehicleController.createVehicle
);

router.put(
  "/:vehicleId",
  auth.protect,
  auth.restrictTo("admin"),
  vehicleController.updateVehicle
);

router.delete(
  "/:vehicleId",
  auth.protect,
  auth.restrictTo("admin"),
  vehicleController.deleteVehicle
);

export const vehicleRoutes = router;
