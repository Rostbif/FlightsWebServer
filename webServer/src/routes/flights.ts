import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

// consts
const BASE_URL = "https://data.gov.il/api/3/action/datastore_search";
const RESOURCE_ID = "e83f763b-b7d7-479e-b172-ae981ddc6de5";
const LIMIT = 300;

// Types
type QueryObject = {
  inboundOrOutbound?: string;
  country?: string;
};

type FlightType = {
  _id: string; // record positive index
  CHOPER: string; //flight Code
  CHFLTN: string; //flight number
  CHOPERD: string; //airline company
  CHSTOL: string; //estimated departure time
  CHPTOL: string; //real departure time
  CHAORD: string; //gate
  CHLOC1: string; //short version destination Airport
  CHLOC1D: string; //full name destination airport
  CHLOC1TH: string; //city Hebrew - name
  CHLOC1T: string; //city English- name
  CHLOC1CH: string; //country Hebrew - name
  CHLOCCT: string; //country English - name
  CHTERM: string; //TLV Terminal
  CHCINT: string; //TLV check-in counter - if empty inbound flights else outbound flight
  CHCKZN: string; //TLV check in zone - if empty inbound flights else outbound flight
  CHRMINE: string; //status in English
  CHRMINH: string; //status in Hebrew
};

type MatchingFlightType = {
  outbound?: FlightType;
  inbound?: FlightType;
};

// helper base function to fetch flight data for code reusing
const fetchFlightsData = async (
  queryObject?: QueryObject
): Promise<FlightType[]> => {
  const response = await axios.get(
    `${BASE_URL}?resource_id=${RESOURCE_ID}&limit=${LIMIT}`
  );

  // getting the data from the response object
  let records = response.data.result.records;

  // if country property exist then we filter the results by that (hebrew or english)
  if (queryObject?.country) {
    records = records.filter(
      (r: FlightType) =>
        r.CHLOCCT === queryObject.country || r.CHLOC1CH === queryObject.country
    );
  }

  // filtering results according to inbound/outbound request (inbound/outbound/empty)
  // looking on the CHCINT&CHCKZN fields, which incase they are empty it means it's an inbound flight
  switch (queryObject?.inboundOrOutbound) {
    case "outbound":
      records = records.filter((r: FlightType) => r["CHCINT"] && r["CHCKZN"]);
      break;
    case "inbound":
      records = records.filter((r: FlightType) => !r["CHCINT"] && !r["CHCKZN"]);
      break;
  }

  return records;
};

// Number of flights
router.get("/getNumberOfFlights", async (req: Request, res: Response) => {
  try {
    // creating the query object - empty (as we don't want to filter anything)
    const query: QueryObject = {};
    // using the shared function
    const flights = await fetchFlightsData(query);
    // return the result
    res.json(flights.length);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flights data" });
  }
});

// Number of outbound flights. (filter outbound )
router.get(
  "/getNumberOfOutboundFlights",
  async (req: Request, res: Response) => {
    try {
      const query: QueryObject = {
        inboundOrOutbound: "outbound",
      };
      const flights = await fetchFlightsData(query);
      res.json(flights.length);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

// Number of inbound flights. (filter inbound)
router.get(
  "/getNumberOfInboundFlights",
  async (req: Request, res: Response) => {
    try {
      const query: QueryObject = {
        inboundOrOutbound: "inbound",
      };
      const flights = await fetchFlightsData(query);
      res.json(flights.length);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

// Number of flights for a specific country (inbound & outbound). (filter by country name)
router.get(
  "/getNumberOfFlightsToAndFromCountry",
  async (req: Request, res: Response) => {
    try {
      const country = req.query.country as string; // Get country form query parameters (and convert it into a string)
      if (country) {
        const query: QueryObject = {
          country: country,
        };
        const flights = await fetchFlightsData(query);
        res.json(flights.length);
      }
      // if country name wasn't provided then we return "bad request"
      else {
        res.status(400).json({ message: "country name is missing!" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

// Number of outbound flights To a specific country. (filter outbound + country)
router.get(
  "/getNumberOfOutboundFlightsToCountry",
  async (req: Request, res: Response) => {
    try {
      const country = req.query.country as string; // Get country form query parameters (and convert it into a string)

      if (country) {
        const query: QueryObject = {
          inboundOrOutbound: "outbound",
          country: country,
        };
        const flights = await fetchFlightsData(query);
        res.json(flights.length);
      }
      // if country name wasn't provided then we return "bad request"
      else {
        res.status(400).json({ message: "country name is missing!" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

// Number of inbound flights from a specific country. (filter inbound + country)
router.get(
  "/getNumberOfInboundFlightsFromCountry",
  async (req: Request, res: Response) => {
    try {
      const country = req.query.country as string; // Get country form query parameters (and convert it into a string)
      if (country) {
        const query: QueryObject = {
          inboundOrOutbound: "inbound",
          country: country,
        };
        const flights = await fetchFlightsData(query);
        res.json(flights.length);
      }
      // if country name wasn't provided then we return "bad request"
      else {
        res.status(400).json({ message: "country name is missing!" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

// Number of delayed flights. (check if real departure time is not equal to estimated departure time)
router.get(
  "/getNumberOfDelayedFlights",
  async (req: Request, res: Response) => {
    try {
      let flights = await fetchFlightsData();

      // if real departure time is not equal to estimated departure time => a delayed flight (I can be more specific and check that it's greater...)
      flights = flights.filter((f) => f.CHSTOL !== f.CHPTOL);
      res.json(flights.length);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

// Most popular destination - the city with the highest number of outbound flights. (filter by outbound, most popular, groupby + count)
router.get(
  "/getMostPopularDestination",
  async (req: Request, res: Response) => {
    try {
      // first get all outbound flights
      const query: QueryObject = {
        inboundOrOutbound: "outbound",
      };
      let flights = await fetchFlightsData(query);

      // group by city(CHLOC1T) and count the the number of flights per city
      // using the reduce method (which accept each time the object )
      const flightsCountByCity: { [key: string]: number } = flights.reduce(
        (acc: { [key: string]: number }, flight: FlightType) => {
          const city = flight.CHLOC1T;
          if (city) {
            acc[city] = (acc[city] || 0) + 1;
          }
          return acc;
        },
        {}
      );

      // find the city with the maximum count
      const mostPopularCity = Object.keys(flightsCountByCity).reduce((a, b) =>
        flightsCountByCity[a] > flightsCountByCity[b] ? a : b
      );

      res.json(mostPopularCity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

router.get(
  "/getQuickGetawayFromIsrael",
  async (req: Request, res: Response) => {
    try {
      // Getting the outbound and inbound flights from and to Israel
      // (it's more efficient to get all flights and filter them locally, but I preferred to reuse my code:) )
      const query: QueryObject = { inboundOrOutbound: "outbound" };
      let outboundFlightsFromIsrael = await fetchFlightsData(query);
      query.inboundOrOutbound = "inbound";
      let inboundFlightsFromIsrael = await fetchFlightsData(query);
      let firstMatchingFlights: MatchingFlightType = {};

      // if there are outbound and inbound flights from and to Israel
      if (outboundFlightsFromIsrael && inboundFlightsFromIsrael) {
        // for each outbound flight, check if there is an inbound flight which its estimated departure time is
        for (const outbound of outboundFlightsFromIsrael) {
          for (const inbound of inboundFlightsFromIsrael) {
            // checking if there is a match, same city + outbound flight departure time is less then the inbound flight departure time
            // ignoring flighting time as requested + the fact that israel has 2 airports:)
            if (
              outbound.CHLOC1T === inbound.CHLOC1T &&
              new Date(outbound.CHSTOL) < new Date(inbound.CHSTOL)
            ) {
              firstMatchingFlights.outbound = outbound;
              firstMatchingFlights.inbound = inbound;
            }
          }
        }
      }

      // if we found a match, we return the flights Identifiers...
      if (firstMatchingFlights?.outbound && firstMatchingFlights?.inbound) {
        res.json({
          departure: `${firstMatchingFlights.outbound.CHOPER}${firstMatchingFlights.outbound.CHFLTN}`,
          arrival: `${firstMatchingFlights.inbound.CHOPER}${firstMatchingFlights.inbound.CHFLTN}`,
        });
        // else we return "Not found"
      } else {
        res.status(404).json({ message: "couldn't find matching flights" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch flights data" });
    }
  }
);

export default router;
