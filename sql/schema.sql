CREATE TYPE user_role AS ENUM ('admin', 'customer');
CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
CREATE TYPE vehicle_availability AS ENUM ('available', 'booked');
CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer'
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(100) NOT NULL,
  type vehicle_type NOT NULL,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
  availability_status vehicle_availability NOT NULL DEFAULT 'available'
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id),
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
  status booking_status NOT NULL DEFAULT 'active',
  CHECK (rent_end_date > rent_start_date)
);
