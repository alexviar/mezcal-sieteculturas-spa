import { User } from "@/assets/icons";
import { appName } from "@/configs/app";
import { RootState } from "@/models/redux/store";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { LuChevronLeft } from "react-icons/lu";
import { useSelector } from "react-redux";
import Logo from "../assets/logo.png";

type HeaderProps = {
  showBackButton?: boolean
  backTo?: string
  hideBrandLogo?: boolean
  title?: ReactNode
  subtitle?: ReactNode
}

export default function Header({ hideBrandLogo, showBackButton = false, backTo, title, subtitle }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector(
    (state: RootState) => state.user.user
  );

  return (
    <nav className="header bg-body border-bottom">
      <div className="header-container">
        <div className="d-flex align-items-center gap-2">
          {showBackButton && (
            <button
              onClick={() => backTo ? router.replace(backTo) : router.back()}
              className="btn btn-link p-0"
              aria-label="Volver atrás"
            >
              <LuChevronLeft size={24} color="white" />
            </button>
          )}
          <Link href="/" className="brand-item">
            {!hideBrandLogo && (
              <Image
                src={Logo}
                width={40}
                height={40}
                alt={`${appName} logo`}
                className="me-2"
                priority
              />
            )}
            {title && (
              <div>
                <h1 className="mb-0">{title}</h1>
                {subtitle && <p className="mb-0 small">{subtitle}</p>}
              </div>
            )}
          </Link>
        </div>
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
