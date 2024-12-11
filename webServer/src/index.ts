import express, { Request, Response } from "express";
import flightsRoutes from "./routes/flights";

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Ofir!");
});

app.use("/api/flights", flightsRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
