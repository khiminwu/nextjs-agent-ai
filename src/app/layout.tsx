import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css';
import ViewportFixWrapper from "./components/ViewportFixWrapper";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Ursa Major",
  description: "Digital experts in development, social media strategy, and creative content. Helping brands connect, engage, and grow in the online world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased !m-0`}>
        <ViewportFixWrapper>
          {/* <div className="w-full"> */}
            
            {/* <Header/> */}
          
          {children}
          {/* </div> */}
        </ViewportFixWrapper>
      </body>
    </html>
  );
}
