import { getErrorMessage } from "@/api/getErrorMessage";
import { useUpdateProductMutation } from "@/api/services/productApi";
import Loader from "@/components/loader";
import { useServerValidationErrors } from "@/hooks/useServerValidationErrors";
import { useModal } from "@/models/context/useModal";
import { Product } from "@/models/entities";
import dynamic from "next/dynamic";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditorComponent = dynamic(() => import("./editor-component"), {
  ssr: false,
});

interface UpdateProductsProps {
  product: Product;
}

export default function UpdateProduct({ product }: UpdateProductsProps) {
  const { setOpen, setReload } = useModal();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError
  } = useForm({
    defaultValues: {
      name: product.name,
      presentation: product.presentation,
      description: product.description,
      price: product.price,
      shippingValue: product.shippingValue,
      stock: product.stock,
      images: undefined,
      status: product.status,
    },
  });

  const [update, updateState] = useUpdateProductMutation()
  useServerValidationErrors(updateState, setError)

  const onSubmit = async (data: any) => {
    try {

      const updatedProduct = {
        ...data,
        status: data.status,
        id: product.id,
        images: data.images
      };

      const response = await update(updatedProduct).unwrap();

      setOpen(false);
      setReload(true);
    } catch (error) {
      toast.error("Error en la solicitud de actualización: " + getErrorMessage(error as any));
    }
  };

  React.useEffect(() => {
    reset({
      name: product.name,
      presentation: product.presentation,
      description: product.description,
      price: product.price,
      shippingValue: product.shippingValue,
      stock: product.stock,
      status: product.status,
    });
  }, [product, reset]);

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Modifica un producto</h2>
        {updateState.isLoading && <Loader message="Actualizando..." />}
        <Row className="gx-2 gy-3">
          <Form.Group as={Col} md={12} controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              {...register("name", { required: "El nombre es requerido" })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={12} controlId="presentation">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              {...register("presentation", { required: "Este campo es requerido" })}
              isInvalid={!!errors.presentation}
            />
            <Form.Control.Feedback type="invalid">{errors.presentation?.message}</Form.Control.Feedback>
          </Form.Group>

          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo es requerido" }}
            render={({ field: { onChange, value } }) => (
              <Form.Group as={Col} xs={12} controlId="description">
                <Form.Label>Detalles</Form.Label>
                <EditorComponent value={value} onChange={onChange} />
                <Form.Text style={{ color: 'var(--bs-form-invalid-color)' }}>{errors.description?.message}</Form.Text>
              </Form.Group>
            )}
          />

          <Form.Group as={Col} md={6} controlId="price">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              {...register("price", { required: "El precio es requerido" })}
              isInvalid={!!errors.price}
            />
            <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="shippingValue">
            <Form.Label>Costo de envío</Form.Label>
            <Form.Control
              type="number"
              {...register("shippingValue", { required: "Este campo es requerido" })}
              isInvalid={!!errors.shippingValue}
            />
            <Form.Control.Feedback type="invalid">{errors.shippingValue?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="stock">
            <Form.Label htmlFor="stock">Items en stock</Form.Label>
            <Form.Control
              type="number"
              {...register("stock", { required: "El stock es requerido" })}
              isInvalid={!!errors.stock}
            />
            <Form.Control.Feedback type="invalid">{errors.stock?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="images">
            <Form.Label htmlFor="images">Imágenes</Form.Label>
            {/* <Image
              src={product.images[0]}
              width={40}
              height={40}
              alt={product.name}
            /> */}
            <Form.Control
              type="file"
              {...register("images")}
              multiple
              isInvalid={!!errors.images}
            />
            <Form.Control.Feedback type="invalid">{errors.images?.message}</Form.Control.Feedback>
          </Form.Group>

          <Col xs={12}>
            <Form.Check
              {...register("status")}
              id="status"
              type="switch"
              label="Producto publicado"
            />
          </Col>
          <Col>
            <Button type="submit" className="w-100" disabled={updateState.isLoading}>
              {updateState.isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
