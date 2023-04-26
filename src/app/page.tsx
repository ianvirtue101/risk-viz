import Image from "next/image";
import { Inter } from "next/font/google";
import RiskMap from "@/components/RiskMap/RiskMap";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <RiskMap />
    </>
  );
}
