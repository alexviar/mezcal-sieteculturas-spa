import { getErrorMessage } from "@/api/getErrorMessage";
import { useLogoutMutation } from "@/api/services/authApi";
import {
  Coin,
  Home,
    /* Settings, */ ShoppingBag
} from "@/assets/icons";
import { appName } from "@/configs/app";
import { LayoutProps, pageTitle } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";
import Loader from "./loader";

export default function DasboardLayout({ children }: LayoutProps) {
  const currentPath = usePathname();
  const [logout, logoutState] = useLogoutMutation()

  const handleLogOut = async () => {
    if (logoutState.isLoading) return
    try {
      toast.dismiss('logout')
      toast.info(<Loader message="Cerrando sesión..." />, {
        toastId: 'logout',
        autoClose: false
      })
      await logout().unwrap();
      toast.dismiss('logout')
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.update('logout', {
        render: getErrorMessage(error as any),
        type: 'error',
        autoClose: 5000
      })
    }
  };

  return (
    <>
      <div className="content">
        <section className="sidebar">
          <div className="logo">
            <Image
              src={Logo}
              width={60}
              height={30}
              alt={`${appName} logo`}
              priority
            />
          </div>

          <nav>
            <ul className="menu-options">
              <li
                className={`${currentPath === "/dashboard/home" ? "selected" : ""
                  }`}
              >
                <Link href="/dashboard/home">
                  <Home />
                </Link>
              </li>
              <li
                className={`${currentPath === "/dashboard/products" ? "selected" : ""
                  }`}
              >
                <Link href="/dashboard/products">
                  <ShoppingBag />
                </Link>
              </li>
              <li
                className={`${currentPath === "/dashboard/purchases" ? "selected" : ""
                  }`}
              >
                <Link href="/dashboard/purchases">
                  <Coin />
                </Link>
              </li>
              {/* <li
                  className={`${
                    currentPath === "/dashboard/settings" ? "selected" : ""
                  }`}
                >
                  <Link href="/dashboard/settings">
                    <Settings />
                  </Link>
                </li> */}
            </ul>
          </nav>
        </section>

        <section className="main-content">
          <div className="app">
            <header className="sub-menu">
              <div className="title">{pageTitle(currentPath)} </div>
              <div className="user-options">
                <Button
                  variant="outline-accent rounded-circle p-2"
                  onClick={handleLogOut}
                  className="icon user-img"
                >
                  <FaSignOutAlt />
                </Button>
              </div>
            </header>

            <section className="app-content">{children}</section>
          </div>
        </section>
      </div>
    </>
  );
}
