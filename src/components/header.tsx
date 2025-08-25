import { User } from "@/assets/icons";
import { appName } from "@/configs/app";
import { RootState } from "@/models/redux/store";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/logo.png";

type HeaderProps = {
  hideBrandLogo?: boolean
  title?: ReactNode
  subtitle?: ReactNode
}

export default function Header({ hideBrandLogo, title, subtitle }: HeaderProps) {
  const pathname = usePathname()
  const user = useSelector(
    (state: RootState) => state.user.user
  );

  return (
    <nav className="header">
      <div className="header-container">
        <Link href="/" className="brand-item">
          {!hideBrandLogo && <Image
            src={Logo}
            width={60}
            height={60}
            alt={`${appName} logo`}
            priority
          />}
          {title && <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>}
        </Link>
        <div className="action-container">
          {pathname !== '/login' && <Link href={user ? "/dashboard/home" : "/login"} className="action-container-item login">
            <User />
            <span>ingresar</span>
          </Link>}
        </div>
      </div>
    </nav>
  );
}
