import { ReactNode } from "react";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>

      <body>
        <MantineProvider defaultColorScheme="auto">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
