import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to Aiven PostgreSQL
const client = new pg.Client({
  host: "YOUR_AIVEN_HOST",
  port: 12345,
  user: "YOUR_USER",
  password: "YOUR_PASSWORD",
  database: "YOUR_DATABASE",
  ssl: { rejectUnauthorized: false }
});

await client.connect();

// Create table if not exists
await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INT,
    address TEXT
  )
`);

app.post("/save", async (req, res) => {
  const { name, age, address } = req.body;
  await client.query("INSERT INTO users (name, age, address) VALUES ($1, $2, $3)", [name, age, address]);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
