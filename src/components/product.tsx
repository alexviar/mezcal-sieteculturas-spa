import { getErrorMessage } from "@/api/getErrorMessage";
import { useGetCatalogQuery } from "@/api/services/storeApi";
import { useState } from "react";
import { Alert } from "react-bootstrap";
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
      return <div
        className={`${products.length > 1 ? "products-grid" : "products-list"}`}
      >
        {products.map((product) => {
          return <ProductCard product={product} />
        })}
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
