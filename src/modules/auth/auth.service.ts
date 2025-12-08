import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../../config/db";
import config from "../../config";

export type UserRole = "admin" | "customer";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}

interface SigninInput {
  email: string;
  password: string;
}

export const signup = async (data: SignupInput) => {
  const { name, email, password, phone, role = "customer" } = data;

  if (!name || !email || !password || !phone) {
    const err: any = new Error("name, email, phone, and password are required");
    err.status = 400;
    throw err;
  }

  if (password.length < 6) {
    const err: any = new Error("Password must be at least 6 characters");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const existing = await query("SELECT id FROM users WHERE email = $1", [
    normalizedEmail,
  ]);
  if (existing.rowCount > 0) {
    const err: any = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, config.bcryptSaltRounds);

  const result = await query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, normalizedEmail, hashed, phone, role]
  );

  return result.rows[0];
};

export const signin = async (data: SigninInput) => {
  const { email, password } = data;
  if (!email || !password) {
    const err: any = new Error("email and password are required");
    err.status = 400;
    throw err;
  }

  const normalizedEmail = email.toLowerCase();

  const userRes = await query(
    "SELECT id, name, email, password, phone, role FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (userRes.rowCount === 0) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const user = userRes.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  delete user.password;

  return { token, user };
};
