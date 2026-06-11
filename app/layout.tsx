import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Meeting Action Extractor',
  description: 'Turn messy meeting notes into clear next steps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
