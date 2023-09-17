import './globals.css';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/provider';
import { ConfigProvider } from 'antd';

export const metadata: Metadata = {
  title: 'Image Processing Tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ConfigProvider
          // theme={{
          //   token: {
          //     // Seed Token
          //     colorPrimary: '#00b96b',
          //     borderRadius: 2,

          //     // Alias Token
          //     colorBgContainer: '#f6ffed',
          //   },
          // }}
          >
            {children}
          </ConfigProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
