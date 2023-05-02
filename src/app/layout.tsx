import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Climate Risk Dashboard",
  description:
    "Assessing the impact of climate change on Canadian businesses throughout the 21st century. As global temperatures rise and extreme weather events become more frequent, businesses across various industries are facing increasing risks and challenges. This analysis aims to provide insights into the potential consequences of climate change, empowering businesses to make informed decisions, adapt to changing conditions, and contribute to a sustainable future.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
