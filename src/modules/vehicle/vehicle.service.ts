import { pool } from "../../config/db";

export type VehicleType = "car" | "bike" | "motorcycle" | "van" | "SUV";
export type VehicleAvailability = "available" | "booked";

interface VehicleInput {
  vehicle_name: string;
  type: VehicleType;
  registration_number: string;
  daily_rent_price: number;
  availability_status?: VehicleAvailability;
}

const createVehicle = async (data: VehicleInput) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status = "available",
  } = data;

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
  return result.rows;
};

const getVehicleById = async (id: number) => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  return result.rows[0];
};

const updateVehicle = async (id: number, data: Partial<VehicleInput>) => {
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
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

const deleteVehicle = async (id: number) => {
  const activeBookings = await pool.query(
    "SELECT id FROM bookings WHERE vehicle_id = $1 AND status = $2",
    [id, "active"]
  );
  if (activeBookings.rows.length > 0) {
    throw new Error("Vehicle has active bookings and cannot be deleted");
  }

  const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw new Error("Vehicle not found");
  }
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
