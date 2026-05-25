import dotenv from "dotenv";
import { connectDatabase } from "./config/database.js";
import { app } from "./app.js";

dotenv.config();

const port = process.env.PORT || 5000;

await connectDatabase();

app.listen(port, () => {
  console.log(`StudyHub API running on port ${port}`);
});
