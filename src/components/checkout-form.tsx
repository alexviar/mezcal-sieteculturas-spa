"use client";
import Cities from "@/dummy/cities.json";
import States from "@/dummy/states.json";
import { Product } from "@/models/entities";
import { setForm } from "@/models/redux/cart/slice";
import { RootState } from "@/models/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

type StateNames = keyof typeof Cities;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  phone: string;
  terms: boolean;
}

export default function CheckoutForm() {
  const dispatch = useDispatch();

  const itemsInCart: Product[] = useSelector(
    (state: RootState) => state.shoppingCart.items
  );

  const quantities = useSelector(
    (state: RootState) => state.shoppingCart.quantities
  );

  const total = useSelector((state: RootState) => state.shoppingCart.total);

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      firstName:
        typeof window !== "undefined"
          ? localStorage.getItem("firstName") || ""
          : "",
      lastName:
        typeof window !== "undefined"
          ? localStorage.getItem("lastName") || ""
          : "",
      email:
        typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
      address:
        typeof window !== "undefined"
          ? localStorage.getItem("address") || ""
          : "",
      state:
        typeof window !== "undefined"
          ? localStorage.getItem("state") || ""
          : "",
      city:
        typeof window !== "undefined" ? localStorage.getItem("city") || "" : "",
      zipCode:
        typeof window !== "undefined"
          ? localStorage.getItem("zipCode") || ""
          : "",
      phone:
        typeof window !== "undefined" ? localStorage.getItem("phone") || "" : "",
    },
  });

  const router = useRouter()
  useEffect(() => {
    router.prefetch("/checkout/checkout")
  }, [])

  const selectedState = watch("state");

  useEffect(() => {
    const storedState =
      typeof window !== "undefined" ? localStorage.getItem("state") : "";
    if (storedState) {
      setValue("state", storedState);
    }
  }, []);

  useEffect(() => {
    if (selectedState && selectedState in Cities) {
      setAvailableCities(Cities[selectedState as StateNames]);
    } else {
      setAvailableCities([]);
    }

    setValue("city", "");
  }, [selectedState]);

  useEffect(() => {
    const storedCity =
      typeof window !== "undefined" ? localStorage.getItem("city") : "";
    if (storedCity) {
      setValue("city", storedCity);
    }
  }, [availableCities]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name === "firstName" ||
        name === "lastName" ||
        name === "email" ||
        name === "address" ||
        name === "state" ||
        name === "city" ||
        name === "zipCode" ||
        name === "phone"
      ) {
        if (typeof window !== "undefined") {
          localStorage.setItem(name, value[name] ? value[name].toString() : "");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="cart-container">
      <section className="cart">
        <h2>Resumen de tu compra</h2>
        <span>
          ({total}) {total > 1 ? "items agregados" : "item agregado"}
        </span>

        {itemsInCart.length > 0 ? (
          itemsInCart.map((item, index) => (
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
        <h2>Tus datos</h2>

        <Form onSubmit={handleSubmit((values) => {
          router.push("/checkout/checkout")
          dispatch(
            setForm({
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              address: values.address,
              zipCode: values.zipCode,
              phone: values.phone,
              state: values.state,
              city: values.city,
            })
          );
        }, console.error)}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              {...register("firstName", { required: "Este campo es requerido." })}
              isInvalid={!!errors.firstName}
              placeholder="Tu nombre"
            />
            <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              {...register("lastName", { required: "Este campo es requerido." })}
              isInvalid={!!errors.lastName}
              placeholder="Tu apellido"
            />
            <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              {...register("email", { required: "Este campo es requerido." })}
              isInvalid={!!errors.email}
              type="email"
              placeholder="Tu email"
            />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              {...register("address", { required: "Este campo es requerido." })}
              isInvalid={!!errors.address}
              placeholder="Tu dirección"
            />
            <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="state">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              {...register("state", { required: "Este campo es requerido." })}
              isInvalid={!!errors.state}
            >
              <option value="">Selecciona un estado</option>
              {States.map((state) => (
                <option key={state.clave} value={state.nombre}>
                  {state.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Ciudad</Form.Label>
            <Form.Select
              {...register("city", { required: "Este campo es requerido." })}
              isInvalid={!!errors.city}
              disabled={availableCities.length === 0}
            >
              <option value="">Selecciona una ciudad</option>
              {availableCities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="zipCode">
            <Form.Label>Código postal</Form.Label>
            <Form.Control
              {...register("zipCode", { required: "Este campo es requerido." })}
              isInvalid={!!errors.zipCode}
              placeholder="Tu código postal"
            />
            <Form.Control.Feedback type="invalid">{errors.zipCode?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              {...register("phone", { required: "Este campo es requerido." })}
              isInvalid={!!errors.phone}
              placeholder="Tu teléfono"
            />
            <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
          </Form.Group>

          <div className="mb-3">
            <Form.Check
              {...register("terms", { required: "Este campo es requerido." })}
              isInvalid={!!errors.terms}
              label={<>
                Acepto los{" "}
                <Link href="/terms" className="target-anchor" target="_blank">
                  términos y condiciones
                </Link>
              </>}
              feedback={errors.terms?.message}
              feedbackType="invalid"
            />
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
              type="submit"
              className="mb-2"
              disabled={!isValid}
            >
              Continuar
            </Button>

            <Link href="/cart" className="link-primary">
              Modificar orden
            </Link>

          </div>
        </Form>
      </section>
    </div>
  );
}
