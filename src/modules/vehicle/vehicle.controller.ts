import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const newVehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: newVehicle.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getVehicles();

    res.status(200).json({
      success: true,
      message:
        vehicles?.length === 0
          ? "No vehicles found"
          : "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      throw new Error("Invalid ID");
    }

    const vehicle = await vehicleService.getVehicle(vehicleId as string);

    if (!vehicle) {
      throw new Error(`Vehicle Not Found with this ID: ${vehicleId}`);
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicle,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId) throw new Error("Invalid ID");
    const getVehicleByID = await vehicleService.getVehicle(vehicleId);

    if (!getVehicleByID) {
      throw new Error(`No Vehicle Found with this id: ${vehicleId}`);
    }

    let {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    if (!vehicle_name) vehicle_name = getVehicleByID?.vehicle_name;
    if (!type) type = getVehicleByID?.type;
    if (!registration_number)
      registration_number = getVehicleByID?.registration_number;
    if (!daily_rent_price) daily_rent_price = getVehicleByID?.daily_rent_price;
    if (!availability_status)
      availability_status = getVehicleByID?.availability_status;

    const updatedVehicle = await vehicleService.updateVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    });

    if (!updatedVehicle) {
      throw new Error(`No Vehicle Found with this id: ${vehicleId}`);
    }

    res.status(200).json({
      success: true,
      message: "Vehicle Updated successfully",
      data: updatedVehicle,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await vehicleService.getVehicle(vehicleId as string);
    if (vehicle.availability_status === "booked") {
      throw new Error("You can not delete this vehicle. It is booked already!");
    }
    await vehicleService.deleteVehicle(vehicleId as string);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
