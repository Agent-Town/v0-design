import './globals.css';

export const metadata = {
  title: 'Agent Town',
  description: 'A cozy frontier town where humans and AI agents co-operate.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rye&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
