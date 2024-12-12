import express, { Request, Response } from "express";
import flightsRoutes from "./routes/flights";

const app = express();
const port = 3000;

// middleware to parse JSON bodies
app.use(express.json());

// just a test
app.get("/", (req: Request, res: Response) => {
  res.send(
    `Hello there! <br>Welcome to the flights API web server!  <br>See here the API documenation: <a href="https://github.com/Rostbif/FlightsWebServer"> https://github.com/Rostbif/FlightsWebServer </a>`
  );
});

// the flights router
app.use("/api/flights", flightsRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
