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
