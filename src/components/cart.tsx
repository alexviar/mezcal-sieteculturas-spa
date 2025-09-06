"use client";
import { Trash } from "@/assets/icons";
import { useUpdateCartItems } from "@/hooks/useUpdateCartItems";
import { Product } from "@/models/entities";
import {
  removeItem,
  updateQuantity
} from "@/models/redux/cart/slice";
import { RootState } from "@/models/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { QuantityControls } from "./QuantityControl";
import Loader from "./loader";

export default function Cart() {
  const quantities = useSelector(
    (state: RootState) => state.shoppingCart.quantities
  );
  const itemsInCart: Product[] = useSelector(
    (state: RootState) => state.shoppingCart.items
  );

  function sumShippingValues(items: Product[]): number {
    return items.reduce((total, item) => total + item.shippingValue, 0);
  }

  const total = useSelector((state: RootState) => state.shoppingCart.total);
  const dispatch = useDispatch();

  const deleteItem = (id: number | undefined) => {
    if (id !== undefined) {
      dispatch(removeItem(id));
    } else {
      console.error("ItemId must be provided");
    }
  };

  const calculateTotals = () => {
    const subtotal = itemsInCart.reduce(
      (sum, item) => sum + item.price * (quantities[item.id!] ?? 1),
      0
    );
    const tax = subtotal * 0.19;
    const deliverySum = sumShippingValues(itemsInCart);
    const totalPurchase = subtotal + deliverySum;

    return {
      subtotal: subtotal.toFixed(2),
      deliverySum: deliverySum.toFixed(2),
      totalPurchase: totalPurchase.toFixed(2),
    };
  };

  const { subtotal, deliverySum, totalPurchase } = calculateTotals();

  const router = useRouter();

  const cartUpdated = useUpdateCartItems();

  useEffect(() => {
    router.prefetch("/checkout/payment-data")
  }, [])

  const handleNavigate = () => {
    if (total > 0) router.push("/checkout/payment-data");
  };

  if (!cartUpdated) return <Loader />;

  return (
    <div className="cart-container">
      <section className="cart">
        <h2>Resumen de tu compra</h2>
        <span>({total}) items agregados</span>

        <div className="mt-2">
          {itemsInCart.length > 0 ? (
            itemsInCart.map((item, index) => (
              <div className="cart-item" key={index}>
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={40}
                  height={40}
                  priority
                />
                <div className="item-details">
                  <h2>{item.name}</h2>
                  <div>
                    ${item.price * (quantities[item.id!] ?? 1)} -{" "}
                    {item.shippingValue > 0 ? (
                      <span className="stock-status in-stock">
                        Envío ${item.shippingValue.toFixed(2)}
                      </span>
                    ) : (
                      <span className="stock-status out-of-stock">
                        Envío gratuito
                      </span>
                    )}
                  </div>
                  {item.stock && item.stock < 5 ? (
                    <div className="stock-warning">¡Quedan pocas unidades!</div>
                  ) : null}
                  <div className="item-options">
                    <QuantityControls
                      min={1}
                      max={item.stock ?? 0}
                      quantity={quantities[item.id!] ?? 1}
                      onQuantityChange={(qty) => dispatch(updateQuantity({ productId: item.id!, quantity: qty }))}
                    />
                  </div>
                </div>
                <div className="item-actions">
                  <button className="delete" onClick={() => deleteItem(item.id)}>
                    <Trash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes productos, continúa comprando.</p>
          )}
        </div>
      </section >

      <section className="summary">
        <h2>Delivery</h2>
        <div className="summary-totals">
          <div className="subtotal">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          {/* <div className="discount">
            <span>Descuento</span>
            <span>$0</span>
          </div> */}
          <div className="delivery">
            <span>Delivery</span>
            <span>${deliverySum}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>${totalPurchase}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Button
            onClick={handleNavigate}
            className={"mb-2"}
            disabled={total < 1}
          >
            Realizar pago
          </Button>
          <Link href="/" className="link-primary">
            Continuar comprando
          </Link>
        </div>
      </section>
    </div>
  );
}
