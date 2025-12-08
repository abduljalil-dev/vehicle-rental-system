import config from "./config";
import { app } from "./app";

const PORT = Number(config.port) || 5000;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
