import { pool } from "../../config/db";
import { QueryResult } from "pg";

interface UpdateUserInput {
  name?: string;
  phone?: string;
  role?: "admin" | "customer";
}

const getAllUsers = async () => {
  const result: QueryResult = await pool.query(
    "SELECT id, name, email, phone, role FROM users ORDER BY id ASC"
  );
  return result.rows;
};

const updateUser = async (
  id: number,
  data: UpdateUserInput,
  isAdmin: boolean
) => {
  // if not admin, cannot change role
  if (!isAdmin) {
    delete data.role;
  }

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING id, name, email, phone, role`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

const deleteUser = async (id: number) => {
  // cannot delete if user has active bookings
  const activeBookings = await pool.query(
    "SELECT id FROM bookings WHERE customer_id = $1 AND status = $2",
    [id, "active"]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("User has active bookings and cannot be deleted");
  }

  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
