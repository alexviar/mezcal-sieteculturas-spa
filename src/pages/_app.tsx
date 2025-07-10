import "@/styles/globals.css";
import "@/styles/app.scss";
import "@/styles/ckeditor.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import Providers from "@/models/redux/provider";
import { NotificationProvider } from "@/models/context/notificationContext";
import { ModalProvider } from "@/models/context/modalContext";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <Providers>
      <NotificationProvider>
        <ModalProvider>
          {getLayout(<Component {...pageProps} />)}
          <ToastContainer />
        </ModalProvider>
      </NotificationProvider>
    </Providers>
  );
}
