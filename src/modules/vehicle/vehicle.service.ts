import { Request, Response } from "express";
import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const newVehicle = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) 
         VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return newVehicle;
};

const getVehicles = async () => {
  const vehicles = await pool.query(`SELECT * FROM vehicles`);

  if (vehicles.rows.length === 0) {
    return [];
  }

  return vehicles.rows;
};

const getVehicle = async (id: string) => {
  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);

  if (vehicle.rows.length === 0) {
    return null;
  }

  return vehicle.rows[0];
};

const updateVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicleId,
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const updatedVehicle = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 where id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  if (updatedVehicle.rows.length === 0) {
    return null;
  }
  return updatedVehicle.rows[0];
};

const deleteVehicle = async (id: string) => {
  await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
};

export const vehicleService = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
