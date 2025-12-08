import config from "./config";
import { initDB } from "./config/db";
import { app } from "./app";

const PORT = Number(config.port) || 5000;

initDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
