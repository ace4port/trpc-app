import "../styles/globals.css";

export const metadata = {
  title: "Super coool app",
  description: "Nice app you got going",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={"h-full"}>{children}</body>
    </html>
  );
}
