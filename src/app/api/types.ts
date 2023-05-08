// DataItem is the type of the data that is returned from the API
export interface DataItem {
  id: number;
  assetName: string;
  lat: number;
  long: number;
  businessCategory: string;
  riskRating: number;
  riskFactors: { [key: string]: number };
  year: number;
}

export interface SelectedDataPoint {
  id: number;
  riskRating: number;
  assetName: string;
  lat: number;
  long: number;
  businessCategory: string;
  riskFactors: { [key: string]: number };
  year: number;
}
