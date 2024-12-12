# FlightsWebServer

A web server to pull information about flights.

## Description

This project is a Node.js web server built with Express and TypeScript. It provides several API endpoints to fetch information about flights, including the number of flights, inbound flights, and flights from a specific country. The server can be run locally or using Docker.

## Prerequisites

- Node.js (version 14 or higher)
- Docker (optional, for running the server in a container)

## Installation

Clone the repository:

```bash
git clone https://github.com/Rostbif/FlightsWebServer.git
cd FlightsWebServer/webserver
```

Install the dependencies:

```bash
npm install
```

## Running the Server Locally

Start the server (including compiling the TypeScript files):

```bash
npm start
```

Access the server at [http://localhost:3000](http://localhost:3000).

## Running the Server with Docker

Build the Docker image:

```bash
docker-compose build
```

Run the Docker container:

```bash
docker-compose up
```

Access the server at [http://localhost:8080](http://localhost:8080).

## API Documentation

### Get Number of Flights (Inbound & Outbound)

- **Endpoint:** `/api/flights/getNumberOfFlights`
- **Method:** `GET`
- **Description:** Returns the total number of flights (inbound and outbound).
- **Response Example:** `300`

### Get Number of Outbound Flights

- **Endpoint:** `/api/flights/getNumberOfOutboundFlights`
- **Method:** `GET`
- **Description:** Returns the number of outbound flights.
- **Response Example:** `150`

### Get Number of Inbound Flights

- **Endpoint:** `/api/flights/getNumberOfInboundFlights`
- **Method:** `GET`
- **Description:** Returns the number of inbound flights.
- **Response Example:** `150`

### Get Number of Flights for a Specific Country (Inbound & Outbound)

- **Endpoint:** `/api/flights/getNumberOfFlightsToAndFromCountry`
- **Method:** `GET`
- **Query Parameters:**
  - `country` (string): The name of the country.
- **Description:** Returns the number of flights from a specific country (inbound and outbound).
- **Request Example:** `/api/flights/getNumberOfFlightsToAndFromCountry?country=UNITED KINGDOM`
- **Response Example:** `68`

### Get Number of Outbound Flights To a Specific Country

- **Endpoint:** `/api/flights/getNumberOfOutboundFlightsToCountry`
- **Method:** `GET`
- **Query Parameters:**
  - `country` (string): The name of the country.
- **Description:** Returns the number of outbound flights from a specific country.
- **Request Example:** `/api/flights/getNumberOfOutboundFlightsToCountry?country=UNITED KINGDOM`
- **Response Example:** `34`

### Get Number of Inbound Flights from a Specific Country

- **Endpoint:** `/api/flights/getNumberOfInboundFlightsFromCountry`
- **Method:** `GET`
- **Query Parameters:**
  - `country` (string): The name of the country.
- **Description:** Returns the number of inbound flights from a specific country.
- **Request Example:** `/api/flights/getNumberOfInboundFlightsFromCountry?country=UNITED KINGDOM`
- **Response Example:** `34`

### Get Number of Delayed Flights

- **Endpoint:** `/api/flights/getNumberOfDelayedFlights`
- **Method:** `GET`
- **Description:** Returns the number of delayed flights (where the real departure time is not equal to the estimated departure time).
- **Response Example:** `20`

### Get Most Popular Destination

- **Endpoint:** `/api/flights/getMostPopularDestination`
- **Method:** `GET`
- **Description:** Returns the city with the highest number of outbound flights.
- **Response Example:** `New York`

### Get Quick Getaway from Israel

- **Endpoint:** `/api/flights/getQuickGetawayFromIsrael`
- **Method:** `GET`
- **Description:** Returns an outbound flight and a matching inbound flight where the estimated departure time of the outbound flight is less than the estimated departure time of the inbound flight.
- **Response Example:**
  ```json
  {
    "departure": "ELAL123",
    "arrival": "ELAL456"
  }
  ```
