import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getUsers = async () => {
  const users = await pool.query(`SELECT * FROM users`);

  if (users.rows.length === 0) {
    throw new Error("No User Found!");
  }

  return users.rows;
};

const getUserByEmail = async (email: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if (user.rows.length === 0) {
    return null;
  }

  return user.rows[0];
};

const getUserByID = async (id: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

  if (user.rows.length === 0) {
    return null;
  }

  return user.rows[0];
};

const updateUser = async (payload: Record<string, unknown>) => {
  const { userId, name, email, password, role, phone } = payload;
  const hashedPass = await bcrypt.hash(password as string, 12);

  const updatedUser = await pool.query(
    `UPDATE users SET name=$1, email=$2, password=$3, role=$4, phone=$5 where id=$6 RETURNING *`,
    [name, email, hashedPass, role, phone, userId]
  );

  if (updatedUser.rows.length === 0) {
    return null;
  }
  return updatedUser.rows[0];
};

const deleteUser = async (id: string) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

export const userService = {
  getUsers,
  getUserByEmail,
  getUserByID,
  updateUser,
  deleteUser,
};
