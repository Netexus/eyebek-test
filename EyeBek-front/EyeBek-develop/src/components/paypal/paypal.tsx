"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalButton() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
      }}
    >
      <PayPalButtons
        createOrder={async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
          });

          const data = await res.json();
          return data.id;
        }}
        onApprove={async (data) => {
          // 1. PayPal aprobó el pago en UI
          console.log("Pago aprobado:", data);

          // 2. Ahora CAPTURAMOS el dinero
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderID: data.orderID }),
          });

          const capture = await res.json();

          console.log("Resultado de captura:", capture);

          if (capture.success) {
            alert("Pago completado correctamente");
          } else {
            alert("Error al capturar el pago: " + capture.message);
          }
        }}
      />
    </PayPalScriptProvider>
  );
}
