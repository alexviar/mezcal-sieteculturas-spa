import { getErrorMessage } from "@/api/getErrorMessage";
import { useCreateProductMutation } from "@/api/services/productApi";
import Loader from "@/components/loader";
import { classNames } from "@/components/utils";
import { useServerValidationErrors } from "@/hooks/useServerValidationErrors";
import { useModal } from "@/models/context/useModal";
import { Product } from "@/models/entities";
import dynamic from "next/dynamic";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditorComponent = dynamic(() => import("./editor-component"), {
  ssr: false,
});
export default function CreateProduct() {
  const { setOpen, setReload } = useModal();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError
  } = useForm<Product>();

  const [create, createState] = useCreateProductMutation()
  useServerValidationErrors(createState, setError)

  const onSubmit = async (data: any) => {
    try {

      await create({
        name: data.name,
        presentation: data.presentation,
        description: data.description,
        price: data.price,
        shippingValue: data.shippingValue,
        stock: data.stock,
        status: data.status,
        images: data.images
      }).unwrap();

      setOpen(false);
      setReload(true);
    } catch (error) {
      toast.error("Error al crear el producto: " + getErrorMessage(error as any));
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Añade un producto</h2>
        {createState.isLoading && <Loader message="Registrando..." />}
        <Row className="gx-2">
          <Form.Group as={Col} xs={12} className="mb-3" controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              {...register("name", { required: "El nombre es requerido" })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>



          <Form.Group as={Col} xs={12} className="mb-3" controlId="presentation">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              {...register("presentation", { required: "Este campo es obligatorio." })}
              isInvalid={!!errors.presentation}
              as="textarea"
              rows={3}
            />
            <Form.Control.Feedback type="invalid">{errors.presentation?.message}</Form.Control.Feedback>
          </Form.Group>



          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Este campo es obligatorio." }}
            render={({ field: { onChange, value } }) => (
              <Form.Group as={Col} xs={12} className="mb-3" controlId="description">
                <Form.Label>Detalles</Form.Label>
                <EditorComponent value={value} onChange={onChange} />
                <Form.Text style={{ color: 'var(--bs-form-invalid-color)' }}>{errors.description?.message}</Form.Text>
              </Form.Group>
            )}
          />

          <Form.Group as={Col} md={6} className="mb-3" controlId="price">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              {...register("price", { required: "El precio es requerido" })}
              isInvalid={!!errors.price}
            />
            <Form.Control.Feedback type="invalid">{errors.price?.message}</Form.Control.Feedback>
          </Form.Group>



          <Form.Group as={Col} md={6} className="mb-3" controlId="shippingValue">
            <Form.Label>Costo de envío</Form.Label>
            <Form.Control
              {...register("shippingValue", { required: "Este campo es obligatorio." })}
              type="number"
              isInvalid={!!errors.shippingValue}
            />
            <Form.Control.Feedback type="invalid">{errors.shippingValue?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={6} className="mb-3" controlId="stock">
            <Form.Label htmlFor="stock">Items en stock</Form.Label>
            <Form.Control
              type="number"
              {...register("stock", { required: "El stock es requerido" })}
              className={classNames(!!errors.stock && "invalid")}
            />
            <Form.Control.Feedback type="invalid">{errors.shippingValue?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={6} className="mb-3" controlId="images">
            <Form.Label htmlFor="images">Imágenes</Form.Label>
            <Form.Control type="file" multiple {...register("images", { required: "Este campo es obligatorio." })}
              className={classNames(!!errors.images && "invalid")}
            />
            <Form.Control.Feedback type="invalid">{errors.images?.message}</Form.Control.Feedback>
          </Form.Group>

          <Col xs={12} className="mb-3">
            <Form.Check
              {...register("status")}
              id="status"
              label="Publicar al guardar"
            />
          </Col>
        </Row>
        <Button className="w-100" type="submit" disabled={createState.isLoading}>
          {createState.isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </Form>
    </div>
  );
}
