import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Suspense } from "react";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
// import './antd-theme.less';

// ConfigProvider.config({
//   theme: {
//     // primaryColor: '#05a7a8',
//     token: {
//       // Seed Token，影响范围大
//       colorPrimary: '#05a7a8',
//       borderRadius: 2,

//       // 派生变量，影响范围小
//       colorBgContainer: '#f6ffed',
//     },
//   },
// });


export const metadata = {
  title: "Headshots AI",
  description: "Generate awesome headshots in minutes using AI",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ConfigProvider theme={{
          token: {
            // Seed Token，影响范围大
            colorPrimary: '#05a7a8',
            // borderRadius: 2,
            colorLink: '#010202',
            colorLinkHover: '#666767'

            // // 派生变量，影响范围小
            // colorBgContainer: '#f6ffed',
          },
          components: {
            Button: {
              /* 这里是你的组件 token */
            },
          },
        }}>
          <section>
            <Suspense fallback={<div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between h-[69px]" />}>
              <Navbar />
            </Suspense>
          </section>
          <main className="flex flex-1 flex-col items-center py-16 md:py-16">
            <AntdRegistry>{children}</AntdRegistry>
            {/* {children} */}
          </main>
          <Footer />
          <Toaster />
        </ConfigProvider>
      </body>
    </html>
  );
}
