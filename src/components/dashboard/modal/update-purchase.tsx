import { getErrorMessage } from "@/api/getErrorMessage";
import { PurchaseData, useUpdatePurchaseMutation } from "@/api/services/purchaseApi";
import { QuantityControls } from "@/components/QuantityControl";
import { useModal } from "@/models/context/useModal";
import { useEffect, useMemo, useRef } from "react";
import { Alert, Button, Card, CloseButton, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface UpdatePurchaseProps {
  data: PurchaseData;
}

interface FormValues {
  shipped: boolean;
  shipping_date: string;
  items: Array<{
    description: string;
    unitPrice: number;
    quantity: number;
  }>;
}

export default function UpdatePurchase({ data }: UpdatePurchaseProps) {
  const [updatePurchase, updatePurchaseState] = useUpdatePurchaseMutation();
  const { setOpen, setReload } = useModal();

  const dataItems = useMemo(() => data.items.filter((item) => Boolean(item.productId)), [data])
  const stockRef = useRef(dataItems.reduce((acc: Record<number, number>, item: any) => {
    acc[item.productId] = item.product.stock + item.quantity;
    return acc;
  }, {}))

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors
  } = useForm<FormValues>({
    defaultValues: {
      shipped: Boolean(data.shipped),
      shipping_date: data.shippingDate || "",
      items: dataItems
    }
  });

  const calculateTotal = () => {
    return watch("items").reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...watch("items")];
    updatedItems[index].quantity = Math.max(1, newQuantity);
    setValue("items", updatedItems);
  };

  const onSubmit = async (formData: FormValues) => {
    let shouldAbort = false
    // Validación de productos
    if (formData.items.length === 0) {
      setError('items', {
        type: 'manual',
        message: 'Debe haber al menos un producto'
      });
      shouldAbort = true;
    }

    // Validación de fecha de envío
    if (formData.shipped && !formData.shipping_date) {
      setError('shipping_date', {
        type: 'manual',
        message: 'La fecha de envío es obligatoria cuando el pedido está marcado como enviado'
      });
      shouldAbort = true;
    }

    if (shouldAbort) return

    try {
      await updatePurchase({
        id: data.id,
        ...formData,
        shippingDate: formData.shipped ? formData.shipping_date : null,
        items: formData.items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }).unwrap();

      setOpen(false);
      setReload(true);
    } catch (error) {
      toast.error(getErrorMessage(error as any));
    }
  };

  // Efecto para limpiar errores cuando se modifican los valores
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'items' && value.items?.length) {
        clearErrors('items');
      }
      if (name === 'shipping_date' && value.shipping_date) {
        clearErrors('shipping_date');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, clearErrors]);

  return (
    <div className="">
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4">

        {/* Sección Cliente */}
        <Card className="border-0">
          <Card.Body>
            <h5 className="mb-3 text-uppercase small fw-bold text-body-secondary">Información del cliente</h5>
            <Row className="g-3">
              <ClientInfoField label="Nombre" value={data.customerName} md={12} />
              <ClientInfoField label="Correo" value={data.customerMail} md={6} />
              <ClientInfoField label="Teléfono" value={data.customerPhone} md={6} />
              <ClientInfoField label="Dirección" value={`${(data as any).customerAddress}`} md={6} />
              <ClientInfoField label="Ciudad" value={`${data.customerCity}, ${data.customerState} C.P. ${(data as any).customerZip || 'N/A'}`} md={6} />
            </Row>
          </Card.Body>
        </Card>

        {/* Sección Productos */}
        <Card className="border-0">
          <Card.Body>
            <h5 className="mb-3 text-uppercase small fw-bold text-body-secondary">Productos</h5>
            <Stack gap={3}>
              {watch("items").map((item, index) => (
                <ItemRow
                  key={index}
                  item={item}
                  max={stockRef.current[(item as any).productId]}
                  index={index}
                  onQuantityChange={(qty: number) => {
                    if (qty > stockRef.current[(item as any).productId]) {
                      toast.info("Lo sentimos, no hay mas unidades disponibles por ahora.")
                      return
                    }
                    handleQuantityChange(index, qty)
                  }}
                  onRemove={() => {
                    const newItems = watch("items").filter((i) => (i as any).id !== (item as any).id);
                    if (newItems.length == 0) {
                      toast.info("No puedes eliminar este producto. Debe haber al menos uno en la lista.")
                      return
                    }
                    setValue("items", newItems);
                    // if (newItems.length === 0) {
                    //   setError('items', {
                    //     type: 'manual',
                    //     message: 'Debe haber al menos un producto'
                    //   });
                    // }
                  }}
                />
              ))}

              {errors.items && (
                <Alert variant="danger" className="mt-2">
                  {errors.items.message}
                </Alert>
              )}

              {/* Total */}
              <div className="rounded-2 p-3 shadow-sm">
                <div className="d-flex justify-content-end align-items-center gap-3">
                  <span className="text-uppercase small text-body-secondary">Costo de envío:</span>
                  <span className="h4 mb-0">${data.shippingFee} MXN</span>
                </div>
                <div className="d-flex justify-content-end align-items-center gap-3">
                  <span className="text-uppercase small text-body-secondary">Total pedido:</span>
                  <span className="h4 mb-0">${calculateTotal() + data.shippingFee} MXN</span>
                </div>
              </div>
            </Stack>
          </Card.Body>
        </Card>

        {/* Sección Envío */}
        <Card className="border-0">
          <Card.Body>
            <h5 className="mb-3 text-uppercase small fw-bold text-body-secondary">Configuración de envío</h5>
            <Row className="g-3 align-items-center">
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="shipped-switch"
                  label="Marcar como enviado"
                  {...register("shipped")}
                />
              </Col>

              {watch("shipped") && (
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Fecha de envío</Form.Label>
                    <Form.Control
                      type="date"
                      {...register("shipping_date")}
                      className={`border-start-0 ${errors.shipping_date ? 'is-invalid' : ''}`}
                    />
                    {errors.shipping_date && (
                      <Form.Control.Feedback type="invalid">
                        {errors.shipping_date.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>

        {/* Acciones */}
        <div className="d-flex gap-3 justify-content-end pt-3 border-top">

          <Button
            variant="primary"
            type="submit"
            disabled={updatePurchaseState.isLoading}
            className="px-4 w-100"
          >
            {updatePurchaseState.isLoading ? (
              <div className="d-flex align-items-center gap-2">
                <Spinner size='sm' /> Guardando...
              </div>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

const ClientInfoField = ({ label, value, md }: { label: string; value: string; md: number }) => (
  <Col md={md}>
    <div className="d-flex flex-column">
      <span className="small text-body-secondary">{label}</span>
      <span className="fw-medium">{value || '-'}</span>
    </div>
  </Col>
);

const ItemRow = ({ item, max, index, onQuantityChange, onRemove }: {
  item: {
    description: string
    unitPrice: number
    quantity: number
  }
  max: number
  index: number
  onQuantityChange: (qty: number) => void
  onRemove: () => void
}) => {

  return (
    <div className="p-3 rounded border position-relative">
      {/* Fila Superior: Descripción */}
      <div className="d-flex mb-3 justify-content-between">
        <div>
          <h6 className="fw-semibold text-body-secondary mb-0">{item.description}</h6>
          <small className="text-body-secondary">Precio unitario: ${item.unitPrice} MXN</small>
        </div>
        <div>
          <CloseButton onClick={() => onRemove()} />
        </div>
      </div>

      {/* Fila Inferior: Controles */}
      <Row className="align-items-center g-2">
        <Col xs="auto">
          <QuantityControls
            quantity={item.quantity}
            min={1}
            max={max}
            onQuantityChange={(qty) => {
              onQuantityChange(qty)
            }}
          />
        </Col>

        <Col>
          <div className="d-flex justify-content-end align-items-center gap-2">
            <div className="text-end">
              <div className="small text-body-secondary">Subtotal</div>
              <div className="fw-semibold">${(item.quantity * item.unitPrice)} MXN</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Confirmación flotante */}
      {/* {showDelete && (
        <div
          className="position-absolute top-50 start-50 translate-middle bg-white p-2 rounded shadow-sm"
          style={{ zIndex: 3 }}
        >
          <small className="text-body-secondary">¿Eliminar item?</small>
        </div>
      )} */}
    </div>
  );
};