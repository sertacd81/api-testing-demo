import fs from "fs";
import csv from "csv-parser";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const API_URL = process.env.API_URL || "https://api.factory-demo.com/production/start";
const TOKEN = process.env.TOKEN || "demo-token";

fs.createReadStream("sample.csv")
  .pipe(csv())
  .on("data", async (row) => {
    const payload = {
      transactionId: uuidv4(),
      serialNo: row.serialNo,
      productId: row.productId,
      startTime: new Date().toISOString(),
      status: row.status,
    };

    try {
      const res = await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      console.log("✅ Sent:", payload.serialNo, res.status);
    } catch (err) {
      console.error("❌ Error:", payload.serialNo, err.message);
    }
  })
  .on("end", () => console.log("All rows processed ✅"));
