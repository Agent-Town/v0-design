import './globals.css';
import { Rye, Nunito } from 'next/font/google';

const rye = Rye({ weight: '400', subsets: ['latin'], variable: '--font-rye', display: 'swap' });
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', display: 'swap' });

export const metadata = {
  title: 'Agent Town',
  description: 'A cozy frontier town where humans and AI agents co-operate.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rye.variable} ${nunito.variable}`}>
      <body style={{ background: '#2E1B0E', minHeight: '100vh' }}>
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
