import { Product } from "@/models/entities";
import { addItem } from "@/models/redux/cart/slice";
import Image from "next/image";
import { useState } from "react";
import { Badge, Button, Ratio } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

type ProductCardProps = {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedImages, setSelectedImages] = useState<{
    [key: number]: string;
  }>({});
  const [cartCounts, setCartCounts] = useState<{ [key: number]: number }>({});
  const dispatch = useDispatch();

  const getStockMessage = (stock: number | undefined) => {
    if (stock === 0) {
      return "¡Producto agotado!";
    } else if (stock && stock < 5) {
      return "¡Pocas unidades!";
    }
    return "";
  };

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

  const handleThumbnailClick = (productId: number, selectedImage: string) => {
    setSelectedImages((prev) => ({
      ...prev,
      [productId]: selectedImage,
    }));
  };

  if (product === null) return null
  const stockMessage = getStockMessage(product.stock);
  return (
    <div className="product-card bg-body-secondary" onClick={() => {

    }}>
      <div className="product-image">
        <Ratio>
          <div>
            <Image
              src={selectedImages[product.id] || product.images[0]}
              alt={product.name}
              className="main-image object-fit-contain shadow-lg"
              fill
              priority
            />
            <Badge bg="warning" className="position-absolute shadow" style={{
              top: '0.5rem',
              right: '0.5rem',
            }}>{stockMessage}</Badge>
          </div>
        </Ratio>
      </div>
      <div className="product-info">
        <h1 className="product-title text-body-emphasis fs-6">{product.name}</h1>
        <div className="d-flex align-items-center justify-content-between">
          <p className="product-price text-accent small mb-0">${product.price.toFixed(2)}</p>
          <Button
            size="sm"
            className="rounded-3"
            style={{
              aspectRatio: 1
            }}
            disabled={!product.stock || product.stock < 1}
            onClick={() => handleCart(product)}
          >
            <FaCartPlus />
          </Button>
        </div>
      </div>
    </div>
  );
}