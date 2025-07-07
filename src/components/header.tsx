import { Cart, User } from "@/assets/icons";
import { appName } from "@/configs/app";
import { RootState } from "@/models/redux/store";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import Logo from "../assets/logo.png";

type HeaderProps = {
  title?: ReactNode
  subtitle?: ReactNode
}

export default function Header({ title, subtitle }: HeaderProps) {
  const itemsInCart = useSelector(
    (state: RootState) => state.shoppingCart.total
  );
  return (
    <nav className="header">
      <div className="header-container">
        <Link href="/" className="brand-item">
          <Image
            src={Logo}
            width={90}
            height={60}
            alt={`${appName} logo`}
            priority
          />
          {title && <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>}
        </Link>
        <div className="action-container">
          <Link href="/login" className="action-container-item login">
            <User />
            <span>ingresar</span>
          </Link>
          <Link href="/cart" className="action-container-item cart-button">
            <Cart />
            {!!itemsInCart && <Badge bg="primary" >{itemsInCart}</Badge>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
