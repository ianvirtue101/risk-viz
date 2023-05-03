import "./globals.css";
import { Inter } from "next/font/google";
import Loading from "./loading";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Climate Risk Dashboard",
  description:
    "Assessing the impact of climate change on Canadian businesses throughout the 21st century. As global temperatures rise and extreme weather events become more frequent, businesses across various industries are facing increasing risks and challenges. This analysis aims to provide insights into the potential consequences of climate change, empowering businesses to make informed decisions, adapt to changing conditions, and contribute to a sustainable future.",
  imageUrl: "/background.png",
};

<meta property="og:image" content={metadata.imageUrl} />;
<meta name="twitter:image" content={metadata.imageUrl} />;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <>
        <Suspense fallback={<Loading />}>
          <body className={inter.className}>{children}</body>
        </Suspense>
      </>
    </html>
  );
}
