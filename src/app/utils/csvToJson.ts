import * as fs from "fs";
import csvtojson from "csvtojson";

export async function parseCsvToJson(
  csvFilePath: string
): Promise<Array<Object>> {
  return new Promise((resolve, reject) => {
    const jsonArray: Array<Object> = [];

    csvtojson()
      .fromFile(csvFilePath)
      .on("json", (jsonObj) => {
        console.log("JSON object:", jsonObj); // Add this console log
        jsonArray.push(jsonObj);
      })
      .on("done", (error: Error | undefined) => {
        if (error) reject(error);
        console.log("JSON array:", jsonArray); // Add this console log
        resolve(jsonArray);
      });
  });
}
