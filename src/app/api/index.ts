// Purpose: API for fetching data from the server.
import { DataItem } from "./types";

export async function getData(): Promise<Array<DataItem>> {
  const response = await fetch("/api/data");
  const data = await response.json();
  return data;
}
