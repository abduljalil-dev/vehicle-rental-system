import { query } from "../../config/db";
import { UserRole } from "../auth/auth.service";

interface UpdateUserInput {
  name?: string;
  phone?: string;
  role?: UserRole;
}

export const getAllUsers = async () => {
  const result = await query(
    "SELECT id, name, email, phone, role FROM users ORDER BY id ASC"
  );
  return result.rows;
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput,
  isAdmin: boolean
) => {
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
    const err: any = new Error("No fields to update");
    err.status = 400;
    throw err;
  }

  values.push(id);

  const result = await query(
    `UPDATE users SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING id, name, email, phone, role`,
    values
  );

  if (result.rowCount === 0) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return result.rows[0];
};

export const deleteUser = async (id: number) => {
  const activeBookings = await query(
    "SELECT id FROM bookings WHERE customer_id = $1 AND status = $2",
    [id, "active"]
  );

  if (activeBookings.rowCount > 0) {
    const err: any = new Error(
      "User has active bookings and cannot be deleted"
    );
    err.status = 400;
    throw err;
  }

  const result = await query("DELETE FROM users WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
};
