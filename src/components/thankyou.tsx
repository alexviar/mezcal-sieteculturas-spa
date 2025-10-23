'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  appName,
  bankAccountClabe,
  bankAccountHolderName,
  bankName,
} from "../configs/app";

export default function Thankyou() {
  const params = useSearchParams();
  const showClabe = params.get("show-clabe") === "1";
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const brandName = appName || "Siete Culturas";
  const hasBankInfo =
    Boolean(bankAccountHolderName) &&
    Boolean(bankAccountClabe) &&
    Boolean(bankName);

  useEffect(() => {
    if (copyState !== "copied") {
      return;
    }

    const timeout = setTimeout(() => setCopyState("idle"), 2500);
    return () => clearTimeout(timeout);
  }, [copyState]);

  const handleCopy = () => {
    if (!bankAccountClabe || !navigator?.clipboard?.writeText) {
      return;
    }

    navigator.clipboard
      .writeText(bankAccountClabe)
      .then(() => setCopyState("copied"))
      .catch(() => setCopyState("idle"));
  };

  return (
    <div className="thanks-container">
      <h1>Gracias por tu compra</h1>
      <p>
        Deseamos que disfrutes de tu producto y esperamos tenerte de vuelta
        pronto en {brandName}.
      </p>
      {showClabe && (
        <section className="bank-transfer-card">
          <h2>Transferencia interbancaria</h2>
          {hasBankInfo ? (
            <>
              <p>
                Completa tu pago realizando una transferencia a nombre de{" "}
                <strong>{bankAccountHolderName}</strong> en{" "}
                <strong>{bankName}</strong>, la CLABE interbancaria para
                capturar el deposito es:
              </p>
              <div className="clabe-highlight">
                <div>
                  <span className="clabe-value">{bankAccountClabe}</span>
                </div>
                <button
                  type="button"
                  className="clabe-copy-button"
                  onClick={handleCopy}
                >
                  Copiar CLABE
                </button>
              </div>
              {copyState === "copied" && (
                <p className="clabe-copy-feedback">
                  CLABE copiada al portapapeles.
                </p>
              )}
              <p className="clabe-steps small text-body-secondary">
                Puedes completar tu pago accediendo a tu banca en línea, utiliza
                la CLABE para la transferencia y verifica la información antes de
                confirmar pago.
              </p>
            </>
          ) : (
            <p>
              Te enviamos el recibo de tu compra junto con los datos bancarios para tu
              transferencia al correo que proporcionaste. Si necesitas asistencia inmediata,
              contactanos por nuestros canales habituales.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
