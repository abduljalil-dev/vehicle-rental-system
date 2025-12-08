import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string = "customer"
) => {
  const normalizedEmail = email.toLowerCase();

  // Check user existence
  const exist = await pool.query(`SELECT id FROM users WHERE email = $1`, [
    normalizedEmail,
  ]);
  if (exist.rows.length > 0) {
    throw new Error("User already exists with this email");
  }

  // Password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, normalizedEmail, hashedPassword, phone, role]
  );

  console.log({ signupResult: result.rows[0] });
  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase();
  console.log({ loginEmail: normalizedEmail });

  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    normalizedEmail,
  ]);

  if (result.rows.length === 0) {
    return null; // user not found
  }

  const user = result.rows[0];
  console.log({ dbUser: user });

  const match = await bcrypt.compare(password, user.password);
  console.log({ passwordMatch: match });

  if (!match) {
    return false; // wrong password
  }

  // Include user ID + role for authorization
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  console.log({ token });
  delete user.password; // safety: never send hashed password to client

  return { token, user };
};

export const authServices = {
  signupUser,
  loginUser,
};
