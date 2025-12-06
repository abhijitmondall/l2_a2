import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express();
const port = 3000;

app.use(express.json());

// DB
const pool = new Pool({
  connectionString: `postgresql://neondb_owner:npg_Oqrj3FNB1JtG@ep-young-hill-ahenai8g-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 6),
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK(role IN ('admin', 'customer'))
    )
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(255) NOT NULL,
      type VARCHAR(25) NOT NULL CHECK(type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(255) NOT NULL UNIQUE,
      daily_rent_price INT NOT NULL CHECK(daily_rent_price > 0),
      availability_status VARCHAR(25) NOT NULL CHECK(availability_status IN ('available', 'booked'))
      )
      `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK(rent_end_date > rent_start_date),
    total_price INT NOT NULL CHECK(total_price > 0),
    status VARCHAR(25) NOT NULL CHECK(status IN ('active', 'cancelled', 'returned'))
    )
    `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/v1/auth/signup", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const newUser = await pool.query(
      `
      INSERT INTO users(name, email, password, phone, role) 
      VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, phone, role]
    );

    console.log(newUser);

    res.status(200).json({
      user: newUser.rows[0],
    });
  } catch (err: any) {
    console.log(err);

    res.status(400).json({
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
