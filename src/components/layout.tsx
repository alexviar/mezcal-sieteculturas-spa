import { WhatsAppColor } from "@/assets/icons";
import { companyWhatsapp } from "@/configs/app";
import useNotification from "@/models/context";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import Header from "./header";
import Notification from "./notification";

type LayoutProps = PropsWithChildren<{
  hideBrandLogo?: boolean
  hideBottomNav?: boolean
  title?: ReactNode
  subtitle?: ReactNode
}>

export default function Layout({ children, ...props }: LayoutProps) {
  const { open, message } = useNotification();
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100dvh', paddingBottom: props.hideBottomNav ? '' : '5rem' }}>
      <Header title={props.title} subtitle={props.subtitle} hideBrandLogo={props.hideBrandLogo} />
      <main className={`${styles.main} `}>{children}</main>
      {!props.hideBottomNav && <BottomNav />}
      <Link
        className="wp-button"
        href={`https://wa.me/${companyWhatsapp}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        <WhatsAppColor />
      </Link>
      <Notification message={message} open={open} />
    </div>
  );
}
