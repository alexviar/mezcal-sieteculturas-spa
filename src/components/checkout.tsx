"use client";
import { getErrorMessage } from "@/api/getErrorMessage";
import { PurchaseData, useMakePurchaseMutation } from "@/api/services/purchaseApi";
import { ShoppingBag, Stripe } from "@/assets/icons";
import { Product } from "@/models/entities";
import { cleanCart, resetForm } from "@/models/redux/cart/slice";
import { RootState } from "@/models/redux/store";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Placeholder } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "./loader";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function CheckoutComponentInner() {
  const [purchase, purchaseState] = useMakePurchaseMutation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [loading, setLoading] = useState(false);
  const [cardElementReady, setCardElementReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();
  const dispatch = useDispatch();

  const itemsInCart = useSelector(
    (state: RootState) => state.shoppingCart.items
  );
  const formStoreData = useSelector(
    (state: RootState) => state.shoppingCart.form
  );
  const quantities = useSelector(
    (state: RootState) => state.shoppingCart.quantities
  );
  const grandTotal = useSelector(
    (state: RootState) => state.shoppingCart.grandTotal
  );

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(e.target.value);
  };

  useEffect(() => {
    router.prefetch("/checkout/thank-you")
  }, [])

  const handleNavigate = useCallback(async () => {
    if (!selectedPaymentMethod) return;

    setLoading(true);

    const buildRequestBody: Omit<PurchaseData, 'id' | 'date' | 'shippingFee' | 'shippingDate' | 'shipped'> = {
      items: itemsInCart.map((item) => ({
        productId: item.id,
        quantity: quantities[item.id] || 1,
      })),
      value: grandTotal,
      customerName: `${formStoreData.firstName} ${formStoreData.lastName}`,
      customerMail: formStoreData.email,
      customerAddress: formStoreData.address,
      customerState: formStoreData.state,
      customerCity: formStoreData.city,
      customerZip: formStoreData.zipCode,
      customerPhone: formStoreData.phone,
      paymentType: selectedPaymentMethod,
    };

    try {
      if (selectedPaymentMethod === "transferencia") {
        await purchase(buildRequestBody).unwrap().catch(e => {
          throw new Error(getErrorMessage(e))
        });

        router.push("/checkout/thank-you");
        dispatch(cleanCart());
        dispatch(resetForm());
      } else if (selectedPaymentMethod === "stripe") {
        if (!stripe || !elements) {
          throw new Error("Stripe no está cargado correctamente");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("CardElement no está disponible");
        }

        const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: `${formStoreData.firstName} ${formStoreData.lastName}`,
            email: formStoreData.email,
            address: {
              city: formStoreData.city,
              state: formStoreData.state,
              line1: formStoreData.address,
            },
          },
        });

        if (pmError) {
          console.error("Error al crear el PaymentMethod:", pmError);
          throw Error("Error al crear el PaymentMethod: " + pmError.message);
        }
        await purchase({
          ...buildRequestBody,
          paymentMethod: paymentMethod.id,
        }).unwrap().catch(e => {
          throw new Error(getErrorMessage(e))
        });

        router.push("/checkout/thank-you");
        dispatch(cleanCart());
        dispatch(resetForm());
      }
    } catch (error) {
      console.error("Error durante la compra:", error);
      toast.error((error as Error).message);
    }

    setLoading(false);
  }, [
    itemsInCart,
    quantities,
    formStoreData,
    selectedPaymentMethod,
    stripe,
    elements,
    router,
    dispatch,
    grandTotal,
  ]);

  return (
    <div className="cart-container">
      <section className="cart">
        {loading ? (
          <Loader />
        ) : itemsInCart.length > 0 ? (
          itemsInCart.map((item: Product, index: any) => (
            <div className="cart-item" key={index}>
              <Image
                src={item.images[0]}
                alt={item.name}
                width={40}
                height={40}
                loading="lazy"
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
                <div className="item-options">
                  <div>
                    <span>
                      {quantities[item.id!] || 1}{" "}
                      {quantities[item.id] > 1 ? "items" : "item"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes productos, continúa comprando.</p>
        )}
      </section>

      <section className="summary">
        <h2>Finaliza tu compra</h2>
        <h4>Tus datos</h4>
        <div className="customer-data-container">
          <span>
            {formStoreData.firstName} {formStoreData.lastName}
          </span>
          <span>{formStoreData.email}</span>
          <span>{formStoreData.address}</span>
          <span>
            {formStoreData.city} - {formStoreData.state}
          </span>
        </div>

        <h4>Método de pago</h4>
        <div className="payment-methods">
          <div className="payment-method-container">
            <Stripe />
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              onChange={handlePaymentMethodChange}
            />
          </div>
          {selectedPaymentMethod === "stripe" && (
            <div
              style={{
                border: '2px solid #555',
                borderRadius: 8,
                padding: 16,
                transition: 'all 0.3s ease',
                marginBottom: 20,
                cursor: 'text'
              }}
            >
              {!cardElementReady && (
                <Placeholder as="div" animation="glow" >
                  <Placeholder xs="12" className="rounded-1" style={{ height: '1.5rem' }} />
                </Placeholder>
              )}
              <CardElement onReady={() => setCardElementReady(true)} />
            </div>
          )}
          <div className="payment-method-container mb-3">
            <span>Transferencia</span>
            <input
              type="radio"
              name="paymentMethod"
              value="transferencia"
              onChange={handlePaymentMethodChange}
            />
          </div>
        </div>

        <Button
          className="w-100"
          onClick={handleNavigate}
          disabled={!selectedPaymentMethod || loading}
        >
          {loading ? (
            "Procesando..."
          ) : (
            <>
              <ShoppingBag /> Comprar
            </>
          )}
        </Button>
      </section>
    </div>
  );
}

export default function CheckoutComponent() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutComponentInner />
    </Elements>
  );
}
