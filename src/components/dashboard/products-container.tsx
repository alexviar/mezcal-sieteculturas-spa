"use client";
import { getErrorMessage } from "@/api/getErrorMessage";
import { useGetProductsQuery } from "@/api/services/productApi";
import { Eye, Pen } from "@/assets/icons";
import { useModal } from "@/models/context/useModal";
import { Product } from "@/models/entities";
import { useEffect, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Loader from "../loader";
import Modal from "../modal";
import { PaginationComponent } from "../pagination";
import CreateProduct from "./modal/create-product";
import UpdateProduct from "./modal/update-product";
import ViewProduct from "./modal/view-product";

export default function ProductsContainer() {
  const [page, setPage] = useState(1)
  const { setContent, setOpen, reload, setReload } = useModal()
  const getProducts = useGetProductsQuery({
    page,
    perPage: 30
  })
  const productsPage = getProducts.currentData
  const products = productsPage?.data

  useEffect(() => {
    setPage(1)
  }, [reload])

  useEffect(() => {
    if (getProducts.isSuccess) {
      setReload(false)
    }
  }, [getProducts.isSuccess])

  const handleView = (product: Product) => {
    setContent(<ViewProduct product={product} />);
    setOpen(true);
  };

  const handleCreate = () => {
    setContent(<CreateProduct />);
    setOpen(true);
  };

  const handleUpdate = (product: Product) => {
    setContent(<UpdateProduct product={product} />);
    setOpen(true);
  };

  function renderContent() {
    if (products) {
      return products.map((product) => (
        <tr key={product.id}>
          <td>{product.name}</td>
          <td>${product.price.toFixed(2)}</td>
          <td
            className={
              product.stock && product.stock < 5 ? "stock-warning" : ""
            }
          >
            {product.stock}
          </td>
          <td className="action-cell">
            <button onClick={() => handleView(product)}>
              <Eye />
            </button>
            <button onClick={() => handleUpdate(product)}>
              <Pen />
            </button>
          </td>
        </tr>
      ))
    }
  }

  return (
    <>
      <div className="products-container">
        <div className="heading-row">
          <span>Lista de productos</span>
          <Button className="d-flex align-items-center justify-content-center gap-2" onClick={() => handleCreate()}><FaPlus /> Nuevo</Button>
        </div>

        {getProducts.isFetching && <Loader />}
        {getProducts.isError && <Alert variant="danger" dismissible>
          {getErrorMessage(getProducts.error)}
        </Alert>}
        <Table responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </Table>
        {productsPage && <PaginationComponent
          pagination={{
            current_page: page,
            total_pages: productsPage.lastPage,
            total_products: productsPage.total
          }}
          onPageChange={(page) => setPage(page)}
        />}
      </div>
      <Modal header="Productos" />
    </>
  );
}
