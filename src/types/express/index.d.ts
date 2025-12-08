declare namespace Express {
  interface UserPayload {
    id: number;
    role: "admin" | "customer";
  }

  interface Request {
    user?: UserPayload;
  }
}

export {};
