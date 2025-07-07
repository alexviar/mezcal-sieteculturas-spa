import { useRouter } from "next/router";
import { useModal } from "@/models/context/useModal";
export default function ContinueToCart() {
  const { setOpen } = useModal();
  const router = useRouter();
  const handleNavigate = () => {
    router.push("/cart");
    setOpen(false);
  };

  return (
    <div className="continue-to-cart-container">
      <p>Tu selección se ha agregado al carrito</p>
      <div className="buttons-row">
        <button onClick={handleNavigate}>Continuar al carrito</button>
        <button onClick={() => setOpen(false)}>Seguir comprando</button>
      </div>
    </div>
  );
}
