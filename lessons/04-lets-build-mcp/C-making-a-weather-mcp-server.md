---
title: Making a Weather MCP Server
description: >-
  Brian Holt guides you in building a practical MCP server that augments an LLM
  with live data by creating a weather tool with the Open-Meteo API. The example
  walks through the weather.js code to register a Get Current Weather tool,
  handle latitude/longitude inputs, fetch data, and return structured outputs
  for AI agents. A hands-on tutorial on the Model Context Protocol (MCP) for
  powering AI applications with real-time weather information.
keywords:
  - MCP
  - Model Context Protocol
  - Open-Meteo
  - weather API
  - AI agents
  - Brian Holt
  - weather tool
---

So let's make an actually useful MCP server. An MCP server is a way to augment the abilities of the LLM you're working with. In our case, we're working with chat bots, so let's augment their ability to retrieve reliable data.

[Open-Meteo][om] is a wonderful weather service that is free and doesn't even require you to sign up! They have a generous free tier that is absolutely perfect for toying around with. They graciously agreed to let me use them as my sample API for this course.

> In the event that open-meteo won't work for you or you just want to try something else, [the public api repo on GitHub][public] is a wonderful place to find another API to work with.

So we're going to make a tool that's going to take in a latitude and longitude (which our LLMs are perfectly capable of coming up with) and returns some weather data. Let's do it!

I'm just going to do this in the same project and make a new file called weather.js. Normally I'd make a new project but this is just a one-off.

```javascript
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fetchWeatherApi } from "openmeteo";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "weather-server",
  version: "1.0.0",
});

// Add a weather tool
server.registerTool(
  "get_weather",
  {
    title: "Get Current Weather",
    description: "Get current weather data for a given latitude and longitude",
    inputSchema: {
      latitude: z.number().describe("Latitude coordinate"),
      longitude: z.number().describe("Longitude coordinate"),
    },
  },
  async ({ latitude, longitude }) => {
    try {
      const params = {
        latitude,
        longitude,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "is_day",
          "precipitation",
          "rain",
          "wind_speed_10m",
        ],
        wind_speed_unit: "mph",
        temperature_unit: "fahrenheit",
        precipitation_unit: "inch",
      };

      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      // Process first location
      const response = responses[0];

      const current = response.current();

      // Note: The order of weather variables in the URL query and the indices below need to match
      const weatherData = {
        temperature2m: current.variables(0).value(),
        relativeHumidity2m: current.variables(1).value(),
        apparentTemperature: current.variables(2).value(),
        isDay: current.variables(3).value() === 1,
        precipitation: current.variables(4).value(),
        rain: current.variables(5).value(),
        windSpeed10m: current.variables(6).value(),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(weatherData, null, 2),
          },
        ],
        structuredOutput: {
          temperature: {
            current: current.variables(0).value(),
            feelsLike: current.variables(2).value(),
            unit: "fahrenheit",
          },
          humidity: {
            value: current.variables(1).value(),
            unit: "percent",
          },
          wind: {
            speed: current.variables(6).value(),
            unit: "mph",
          },
          precipitation: {
            total: current.variables(4).value(),
            rain: current.variables(5).value(),
            unit: "inches",
          },
          conditions: {
            isDay: current.variables(3).value() === 1,
            dayNight: current.variables(3).value() === 1 ? "day" : "night",
          },
        },
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching weather data: ${error.message}`,
          },
        ],
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
```

Generally this should all make sense to you – we haven't really introduced any net new concepts. But now this will actually make API requests for you and provide up-to-date weather information.

Go edit your MCP server config with your new MCP server (you can leave the old one, or delete it, doesn't matter.)

```json
"weather-server": {
    "command": "/path/to/node",
    "args": ["/path/to/weather.js"],
    "env": {
        "NODE_OPTIONS": "--no-deprecation"
    }
}
```

Restart Claude Desktop if you need to. And then ask something like "Do I need a rain jacket in Seattle right now?" or "What are the weather conditions in Minneapolis, MN right now?" and see what it says!

[om]: https://open-meteo.com/
[public]: https://github.com/public-apis/public-apis
