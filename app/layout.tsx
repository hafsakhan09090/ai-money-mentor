export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>AI Money Mentor | Your Personal Financial Advisor</title>
        <meta name="description" content="Free AI-powered financial planning for every Indian" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
