import express, { Request, Response } from "express";
import flightsRoutes from "./routes/flights";

const app = express();
const port = 3000;

// middleware to parse JSON bodies
app.use(express.json());

// just a test
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Ofir!");
});

// the flights router
app.use("/api/flights", flightsRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
