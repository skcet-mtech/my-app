import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Connect to Aiven MySQL with SSL
const db = await mysql.createConnection({
  host: "mysql-2da5d484-snsctcse-5e1f.c.aivencloud.com",
  port: 20122,
  user: "avnadmin",
  password: "AVNS_5OP6XXy0AD0bh_ZHxeE",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true // Aiven requires SSL
  }
});

// Create table if not exists
await db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    address VARCHAR(255)
  )
`);

app.post("/save", async (req, res) => {
  const { name, age, address } = req.body;
  try {
    await db.query("INSERT INTO users (name, age, address) VALUES (?, ?, ?)", [name, age, address]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
