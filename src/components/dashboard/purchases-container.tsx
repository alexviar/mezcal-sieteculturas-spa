import { useEffect, useState } from "react";
import { Eye, Pen } from "@/assets/icons";
import Modal from "../modal";
import { useModal } from "@/models/context/useModal";
import ViewPurchase from "./modal/view-purchase";
import UpdatePurchase from "./modal/update-purchase";
import { PaginationComponent } from "../pagination";
import { PurchaseData, PurchaseFilter, PurchaseWithProduct, useGetPurchasesQuery } from "@/api/services/purchaseApi";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { PurchaseFilterActionButton } from "./PurchaseFilterActionButton";
import { FaSyncAlt } from "react-icons/fa";
import Loader from "../loader";
import { getErrorMessage } from "@/api/getErrorMessage";

export default function PurchasesContainer() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<PurchaseFilter>({
    status: '1'
  })
  const getPurchases = useGetPurchasesQuery({
    page,
    perPage: 30,
    filter
  })
  const purchasesPage = getPurchases.currentData
  const purchases = purchasesPage?.data ?? []
  const { setContent, setOpen, reload, setReload } = useModal();

  useEffect(() => {
    setPage(1);
  }, [reload]);

  const handleView = (data: PurchaseWithProduct) => {
    setContent(<ViewPurchase data={data} />);
    setOpen(true);
  };

  const handleUpdate = (data: PurchaseWithProduct) => {
    setContent(<UpdatePurchase data={data} />);
    setOpen(true);
  };

  return (
    <>
      <div className="products-container">
        <div className="heading-row">
          <span>Lista de Compras</span>
          <Row className="gx-1">
            <Col>
              <Button style={{ aspectRatio: 1, width: 36, padding: 0 }} onClick={()=>{
                getPurchases.refetch()
              }}>
                <FaSyncAlt className="mt-n1" />
              </Button>
            </Col>
            <Col>
              <PurchaseFilterActionButton defaultValues={filter} onFilter={(newFilter)=>{
                setFilter(newFilter)
              }}/>
            </Col>
          </Row>
        </div>
        {getPurchases.isFetching && <Loader />}
        {getPurchases.isError && <Alert variant="danger" dismissible>
          {getErrorMessage(getPurchases.error)}
        </Alert>}
        <Table responsive>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Valor de compra</th>
              <th>¿Enviada?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.customerName}</td>
                <td>${purchase.value.toFixed(2)}</td>
                <td>{!purchase.shipped ? "No" : "Sí"}</td>
                <td className="action-cell">
                  <button onClick={() => handleView(purchase)}>
                    <Eye />
                  </button>
                  <button onClick={() => handleUpdate(purchase)}>
                    <Pen />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {purchasesPage && <PaginationComponent
          pagination={{
            current_page: page,
            total_pages: purchasesPage.lastPage,
            total_products: purchasesPage.total,
          }}
          onPageChange={(page) => setPage(page)}
        />}
      </div>
      <Modal header="Compras" />
    </>
  );
}
