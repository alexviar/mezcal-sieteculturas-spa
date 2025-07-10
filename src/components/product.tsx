import { getErrorMessage } from "@/api/getErrorMessage";
import { useGetCatalogQuery } from "@/api/services/storeApi";
import { useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
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
    if (products) {
      return <div className="w-100 px-3 py-4">
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
