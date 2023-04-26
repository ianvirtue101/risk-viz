import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

interface DataItem {
  AssetName: string;
  Lat: number;
  Long: number;
  BusinessCategory: string;
  RiskRating: string;
  RiskFactors: string;
}

export async function GET() {
  const data: DataItem[] = [];

  const csvFilePath = path.join(
    process.cwd(),
    "public",
    "UI_UX_Developer_Work_Sample_Data_sample_data.csv"
  );
  const csvFile = fs.readFileSync(csvFilePath, "utf-8");

  return new Promise<NextResponse>((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        resolve(NextResponse.json(data));
      })
      .on("error", (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      });
  });
}
