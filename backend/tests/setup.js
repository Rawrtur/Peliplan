import { config } from "dotenv";

config({
    path: ".env.test.local"
});

console.log("DB_URI geladen:", Boolean(process.env.DB_URI));