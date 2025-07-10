import { getErrorMessage } from "@/api/getErrorMessage";
import { useGetCatalogQuery } from "@/api/services/storeApi";
import Image from "next/image";
import { useState } from "react";
import { Alert, Button, Col, Ratio, Row } from "react-bootstrap";
import { FaChevronRight } from "react-icons/fa";
import Logo from "../assets/logo.png";
import Loader from "./loader";
import { PaginationComponent } from "./pagination";
import { ProductCard } from "./ProductCard";

export default function Products() {
  const [page, setPage] = useState(1);

  const getProducts = useGetCatalogQuery({
    page,
    perPage: 30
  });

  const productsPage = getProducts.currentData
  const products = productsPage?.data

  function renderContent() {
    if (getProducts.data?.total == 0) {
      return (
        <div id="products" className="w-100 px-3 py-4 bg-body">
          <div className="w-100 p-5 text-center d-flex flex-column align-items-center">
            <Image
              src={Logo}
              alt="No products available"
              width={150}
              height={150}
              className="mb-4"
            />
            <p className="fs-5 fw-bold">¡Ups! Parece que no hay productos aquí todavía.</p>
            <p className="text-muted">Estamos trabajando para traer las mejores selecciones para ti. ¡Vuelve pronto!</p>
          </div>
        </div>
      )
    }
    if (products) {
      return <div id="products" className="w-100 px-3 py-4 bg-body">
        <Row className="g-4 justify-content-center">
          {products.map((product) => {
            return (
              <Col key={product.id} md={6}>
                <ProductCard product={product} />
              </Col>
            )
          })}
        </Row>
      </div>
    }
    if (getProducts.isError) {
      return <Alert variant='danger' dismissible>
        <div><strong>Error.</strong></div>
        <p>{getErrorMessage(getProducts.error)}</p>
      </Alert>
    }
    return <Loader message="Cargando..." />
  }

  return (
    <>
      <div
        className="w-100 p-5 d-flex align-items-center justify-content-center flex-column"
        style={{
          maxWidth: '28rem',
          height: '100dvh',
          marginTop: -64
        }}
      >
        <Ratio aspectRatio="1x1">
          <div>
            <Image
              src={Logo}
              alt="Loading"
              fill
              priority
              className="object-fit-contain"
              style={{ maxWidth: '28rem' }}
            />
          </div>
        </Ratio>
        <p className="text-center mb-0">
          Descubre la tradición ancestral del mezcal, donde cada gota cuenta una historia de siete culturas milenarias
        </p>
        <Button as="a" href="#products" className="mt-4 py-3 px-4 d-flex align-items-center gap-3 rounded-pill">
          Explora nuestros productos
          <FaChevronRight />
        </Button>
      </div>
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
