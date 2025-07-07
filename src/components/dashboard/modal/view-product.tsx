import { Product } from "@/models/entities";
import Image from "next/image";

interface ViewProductProps {
  product: Product;
}
export default function ViewProduct({ product }: ViewProductProps) {
  return (
    <div className="product-card-modal">
      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">
          {product.presentation}
        </p>
        <div style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: product.description }} />
        {product.stock && product.stock < 5 ? (
          <span className="stock-warning">¡Quedan pocas unidades!</span>
        ) : null}
        <span style={{ marginBottom: '0.5rem' }}>Costo de envío: ${product.shippingValue.toFixed(2)}</span>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
      <div className="product-image">
        <Image
          src={product.images[0]}
          alt={product.name}
          className="main-image"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
    </div>
  );
}
