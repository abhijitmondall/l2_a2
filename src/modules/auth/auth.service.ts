import { error } from "console";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if ((password as string).trim().length < 6) {
    throw new Error("Password at least be 6 characters long!");
  }
  const hashedPass = await bcrypt.hash(password as string, 12);

  const newUser = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) 
      VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );

  return newUser;
};

const signin = async (email: string, password: string) => {
  const userQuery = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (userQuery.rows.length === 0) {
    throw new Error("User Not Found!");
  }

  const user = userQuery.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Wrong credential!");
  }

  const token = jwt.sign({ email: user.email }, config.jwt_secret as string, {
    expiresIn: "30d",
  });

  user.password = undefined;

  return { user, token };
};

export const authService = {
  signup,
  signin,
};
