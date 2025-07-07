import { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Product } from "@/models/entities";
import { addItem } from "@/models/redux/cart/slice";
import { toast } from "react-toastify";
import { PaginationComponent } from "./pagination";
import Loader from "./loader";
import { getErrorMessage } from "@/api/getErrorMessage";
import { useGetCatalogQuery } from "@/api/services/storeApi";
import { Alert } from "react-bootstrap";

export default function Products() {
  const [selectedImages, setSelectedImages] = useState<{
    [key: number]: string;
  }>({});
  const [cartCounts, setCartCounts] = useState<{ [key: number]: number }>({});
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const getProducts = useGetCatalogQuery({
    page,
    perPage: 30
  });

  const productsPage = getProducts.currentData
  const products = productsPage?.data

  const getStockMessage = (stock: number | undefined) => {
    if (stock === 0) {
      return "¡Producto agotado!";
    } else if (stock && stock < 5) {
      return "¡Quedan pocas unidades!";
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

  function renderContent() {
    if (products) {
      return <div
        className={`${products.length > 1 ? "products-grid" : "products-list"}`}
      >
        {products.map((product) => {
          if (product === null) return null
          const stockMessage = getStockMessage(product.stock);
          return (
            <div className="product-card" key={product.id}>
              <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-description">
                  Presentación: {product.presentation} <br />
                  Notas: {product.notes} <br />
                </p>
                <div
                  style={{ marginBottom: '0.5rem' }}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                {stockMessage && (
                  <span className="stock-warning">{stockMessage}</span>
                )}
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button
                  className="buy-button"
                  disabled={!product.stock || product.stock < 1}
                  onClick={() => handleCart(product)}
                >
                  Comprar
                </button>
              </div>
              <div className="product-image">
                <div className="product-image-container">
                  <Image
                    src={selectedImages[product.id] || product.images[0]}
                    alt={product.name}
                    className="main-image"
                    fill
                    priority
                  />
                </div>
                <div className="product-thumbnails">
                  {product.images.length > 1 && <div className="thumbnail-images">
                    {product.images.map((image, idx) => (
                      <Image
                        key={idx}
                        src={image}
                        alt={`Thumbnail ${idx + 1}`}
                        onClick={() => handleThumbnailClick(product.id, image)}
                        className="thumbnail"
                        width={40}
                        height={40}
                        loading="lazy"
                      />
                    ))}
                  </div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    }
    if(getProducts.isError){
      return <Alert variant='danger' dismissible>
        <div><strong>Error.</strong></div>
        <p>{getErrorMessage(getProducts.error)}</p>
      </Alert>
    }
    return <Loader message="Cargando..." />
  }

  return (
    <>
      {renderContent()}
      {productsPage && <PaginationComponent
        pagination={{
          current_page: productsPage.currentPage,
          total_pages: productsPage.lastPage,
          total_products: productsPage.total
        }}
        onPageChange={(page) => setPage(page)}
      />}
    </>
  );
}
