//trying to make a weather tool that gets the current weather

import {tool} from "@langchain/core/tools";
import {StructuredTool } from "@langchain/core/tools"
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import axios from "axios";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

export class WeatherTool extends StructuredTool  {
    constructor() {
        super();
        this.name = 'get_current_weather';
        this.description = 'Get the current weather for a given city name.';
        this.schema = {
            type: "object",
            properties: {
                input: {
                    type: "string",
                    description: "City name",
                },
            },
            required: ["input"],
        };
    }

    /**
     * the _call method
     * @param input - A city name as a string 
     */
    async _call(input) {
        try{
            const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search",{
                params: {
                    q: input,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    "User-Agent": "LangChain-WeatherTool",
                },
            });

            if (!geoResponse.data || geoResponse.data.length === 0) {
                return `Could not find location for "${input}".`;
            }

            const {lat, lon} = geoResponse.data[0];

            const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    current_weather: true
                }
            });

            const weather = weatherResponse.data.current_weather;
            return `The current weather in ${input} is ${weather.temperature}°C with wind speed ${weather.windspeed} km/h.`;
        }catch (error) {
            return `Error fetching weather: ${error.message}`;
        }
    }
}

const llmWithTools = llm.bindTools([new WeatherTool()]);

const res = await llmWithTools.invoke([
    new HumanMessage("What is the weather in LA?"),
]);

console.log(res.content);

