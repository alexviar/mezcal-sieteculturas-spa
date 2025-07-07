import { getErrorMessage } from "@/api/getErrorMessage";
import { PurchaseWithProduct, useGeneratePurchaseReceiptMutation } from "@/api/services/purchaseApi";
import Loader from "@/components/loader";
import { toast } from "react-toastify";

interface ViewPurchaseProps {
  data: PurchaseWithProduct;
}

export default function ViewPurchase({ data }: ViewPurchaseProps) {
  const [downloadReceipt, downloadReceiptState] = useGeneratePurchaseReceiptMutation()

  const isDownloading = downloadReceiptState.isLoading

  const handleDownloadOrder = async () => {
    try {
      const { downloadUrl } = await downloadReceipt(data.id).unwrap()

      const url = downloadUrl;
      const link = document.createElement('a');
      link.href = url;
      if (!(window as { ReactNativeWebView?: unknown }).ReactNativeWebView) {
        link.target = '_blank';
      }
      link.download = `purchase_order_${data.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading purchase order:", error);
      toast.error(<>
        <p>Hubo un error al descargar la orden. Por favor, inténtalo nuevamente.</p>
        {getErrorMessage(error as any)}
      </>);
    }
  };

  return (
    <div className="product-card-modal">
      <div className="product-info">
        <h1 className="product-title">Compra de {data.customerName}</h1>
        <p className="product-description">
          Fecha de compra: {data.date} <br />
          Valor de compra: ${data.value} MXN
          <br />
          ¿Producto enviado?: {!data.shipped ? "No" : "Sí"}
          <br />
          ¿Metodo de pago?: {data.paymentType}
          <br />
          Fecha de envío:{" "}
          {data.shippingDate === null
            ? "No se ha enviado"
            : data.shippingDate}
          <br />
        </p>
        <h2>Datos del cliente:</h2>

        <p className="product-description">
          Mail del cliente: {data.customerMail} <br />
          Teléfono del cliente: {data.customerPhone} <br />
          Dirección del cliente: {data.customerAddress} <br />
          Ciudad del cliente: {data.customerCity} <br />
          Estado del cliente: {data.customerState} <br />
        </p>
        <button
          className="download-btn"
          onClick={handleDownloadOrder}
          disabled={isDownloading} // Deshabilitar botón si está descargando
        >
          {isDownloading ? "Descargando..." : "Descargar orden"}
        </button>
        {isDownloading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
