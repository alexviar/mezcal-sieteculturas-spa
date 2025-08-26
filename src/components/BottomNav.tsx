import { RootState } from "@/models/redux/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { LuHome, LuInfo, LuShoppingCart } from "react-icons/lu";
import { useSelector } from "react-redux";

export const BottomNav = () => {
  const pathname = usePathname();
  const itemsInCart = useSelector(
    (state: RootState) => state.shoppingCart.total
  );

  const navItems = [
    { icon: LuHome, label: 'Inicio', path: '/' },
    { icon: LuShoppingCart, label: 'Carrito', path: '/cart' },
    { icon: LuInfo, label: 'Información', path: '/about' },
  ];

  return (
    <Navbar
      fixed="bottom"
      className="bg-white border-top border-secondary"
      style={{ zIndex: 1050 }}
    >
      <Container fluid className="px-0">
        <Nav className="w-100 justify-content-around">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;
            return (
              <Nav.Item
                key={path}
                as={Link}
                href={path}
                passHref
                className={`text-decoration-none rounded transition-colors ${isActive
                  ? 'link-primary'
                  : 'link-body-emphasis'
                  }`}
                style={isActive ? {
                  backgroundColor: '#fdf2f4'
                } : {}}
              >
                <div
                  className={`d-flex flex-column align-items-center p-2`}
                  style={{
                    minWidth: '60px',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <div className="position-relative">
                    <Icon size={20} />
                    {path === '/cart' && itemsInCart > 0 && (
                      <Badge
                        bg="secondary"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.6rem' }}
                      >
                        {itemsInCart}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs fw-medium" style={{ fontSize: '0.75rem' }}>
                    {label}
                  </span>
                </div>
              </Nav.Item>
            );
          })}
        </Nav>
      </Container>
    </Navbar >
  );
};