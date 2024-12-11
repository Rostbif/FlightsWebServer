import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

// consts
const BASE_URL = "https://data.gov.il/api/3/action/datastore_search";
const RESOURCE_ID = "e83f763b-b7d7-479e-b172-ae981ddc6de5";
const LIMIT = 300;

// helper base function to fetch flight data
const fetchFlightsData = async () => {
  const response = await axios.get(
    `${BASE_URL}?resource_id=${RESOURCE_ID}&limit=${LIMIT}`
  );
  return response.data.result.records;
};

router.get("/getNumberOfFlights", async (req: Request, res: Response) => {
  try {
    const flights = await fetchFlightsData();
    let x = res.json({ count: flights.length });
    console.log("we are ok");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flights data" });
  }
});

export default router;
