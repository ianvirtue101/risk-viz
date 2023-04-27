import { NextApiRequest, NextApiResponse } from "next";
import { DataItem } from "./types";
import { parseCsvToJson } from "../utils/csvToJson";

// CSV file path
const csvFilePath = "/UI_UX_Developer_Work_Sample_Data_sample_data.csv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataItem[]>
) {
  try {
    const data = await parseCsvToJson(csvFilePath);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
}
