import { WhatsAppColor } from "@/assets/icons";
import { companyWhatsapp } from "@/configs/app";
import useNotification from "@/models/context";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Footer from "./footer";
import Header from "./header";
import Notification from "./notification";
export default function Layout({ children }: any) {
  const { open, message } = useNotification();
  return (
    <>
      <Header />
      <main className={`${styles.main} `}>{children}</main>
      <Footer />
      <Link
        className="wp-button"
        href={`https://wa.me/${companyWhatsapp}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        <WhatsAppColor />
      </Link>
      <Notification message={message} open={open} />
    </>
  );
}
