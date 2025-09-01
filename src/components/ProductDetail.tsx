import { Product } from "@/models/entities"
import { addItem } from "@/models/redux/cart/slice"
import Image from "next/image"
import { useState } from "react"
import { Badge, Button, Card, Modal, Ratio } from "react-bootstrap"
import { FaCartPlus } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

export const ProductDetail = ({ show, onHide, product }: {
  show: boolean
  onHide: () => void
  product: Product
}) => {
  const [cartCounts, setCartCounts] = useState<{ [key: number]: number }>({});
  const dispatch = useDispatch();

  const handleCart = (product: Product) => {
    const currentCount = cartCounts[product.id] || 0;
    if (product.stock && currentCount < product.stock) {
      dispatch(addItem(product));
      setCartCounts((prevCounts) => ({
        ...prevCounts,
        [product.id]: currentCount + 1,
      }));
      toast.info(`Se ha agregado una unidad de ${product.name} al carrito.`);
    } else {
      toast.warn(
        "No puedes agregar más de este producto, no hay suficiente stock."
      );
    }
  };

  const getStockMessage = (stock: number | undefined) => {
    if (stock === 0) {
      return "¡Agotado!";
    } else if (stock && stock < 5) {
      return "¡Pocas unidades!";
    }
    return "";
  };

  return (
    <Modal fullscreen show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="text-accent">{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-4">
        <div className="mt-n3 mx-n3">
          <div className="bg-body-secondary d-flex justify-content-center">
            <Ratio aspectRatio="1x1" style={{ maxWidth: '28rem' }}>
              <div>
                <Image
                  src={product.images ? product.images[0] : ""}
                  alt={product.name}
                  fill
                  priority
                />
                <Badge bg="warning" className="position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>
                  {getStockMessage(product.stock)}
                </Badge>
              </div>
            </Ratio>
          </div>
        </div>
        <section>
          <h1 className="product-title mb-0 text-white fw-bold" style={{ lineHeight: 1.5 }}>{product.name}</h1>
          <p className="product-description text-body-secondary">
            {product.presentation}
          </p>
          <div className="product-price mb-0 text-accent">${product.price}</div>
        </section>
        <section>
          <Card className="bg-body-secondary">
            <Card.Body>
              <Card.Title className="text-accent fs-5 fw-bold">Detalles</Card.Title>
              <Card.Text dangerouslySetInnerHTML={{
                __html: product.description
              }} />
            </Card.Body>
          </Card>
        </section>

        <Button
          variant="primary"
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          disabled={!product.stock || product.stock < 1}
          onClick={() => handleCart(product)}
        >
          <FaCartPlus className="flex-shrink-0" size={'1.25rem'} />
          <span>
            ${product.price.toFixed(2)} <small>MXN</small>
          </span>
        </Button>
      </Modal.Body>
    </Modal>
  )
}