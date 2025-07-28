import { getErrorMessage } from "@/api/getErrorMessage";
import { useGetCatalogQuery } from "@/api/services/storeApi";
import Image from "next/image";
import { useState } from "react";
import { Alert, Button, Col, Ratio, Row } from "react-bootstrap";
import { FaChevronRight } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { EmptyState } from "./EmptyState";
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
        <EmptyState
          imageSrc={Logo}
          imageAlt="Logo"
          title="¡Ups! Parece que no hay productos aquí todavía."
          message="Estamos trabajando para traer las mejores selecciones para ti. ¡Vuelve pronto!"
        />
      )
    }
    if (products) {
      return (
        <Row className="g-4 justify-content-center">
          {products.map((product) => {
            return (
              <Col key={product.id} xs={6} md={3} lg={4}>
                <ProductCard product={product} />
              </Col>
            )
          })}
        </Row>
      )
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
          minHeight: '100dvh',
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
      <div id="products" className="w-100 p-3 bg-body">
        <h2 className="fs-5 fw-bold">Nuestros productos</h2>
        {renderContent()}
      </div>
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
