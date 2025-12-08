import config from "./config/index";
import { app } from "./app";
import initDB from "./config/db";

const PORT = Number(config.port) || 5000;


initDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
