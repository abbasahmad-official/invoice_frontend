import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "./Button";
import { stripePayment, updateInvoiceForUserPay } from "../admin/api";

const PaymentForm = ({ invoice, setFormShow }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    cardNumber: null,
    expiry: null,
    cvc: null,
  });

  const handleChange = (event, field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: event.error ? event.error.message : null,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Prevent submission if any errors exist
    if (errors.cardNumber || errors.expiry || errors.cvc) {
      alert("Please fix the errors before submitting");
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;

    setLoading(true);

    try {
      const data = await stripePayment(invoice.totalAmount);
      const { clientSecret } = data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: invoice.client?.name || "Client",
          },
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("✅ Payment successful!");
        invoice.status = "Paid";
        await updateInvoiceForUserPay(invoice._id, invoice);
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "white",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "30px 30px 20px 30px",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        zIndex: 1000,
      }}
    >
      {/* Close Button */}
      <button
        onClick={()=> setFormShow(false)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ×
      </button>

      {invoice.status === "Paid" ? (
        <p
          style={{
            width: "fit-content",
            padding: "12px 16px",
            backgroundColor: "lightGreen",
            borderRadius: "6px",
            margin: "0 auto",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          ✅ This Invoice is Paid
        </p>
      ) : (
        <form onSubmit={handlePayment}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Pay Invoice
          </h2>

          {/* Card Number */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
            >
              Card Number
            </label>
            <div
              style={{
                padding: "12px",
                border: `1px solid ${errors.cardNumber ? "red" : "#ccc"}`,
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <CardNumberElement
                options={{ style: { base: { fontSize: "16px", color: "#333" } } }}
                onChange={(e) => handleChange(e, "cardNumber")}
              />
            </div>
            {errors.cardNumber && (
              <p style={{ color: "red", marginTop: "5px" }}>{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry and CVC */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
              >
                Expiry
              </label>
              <div
                style={{
                  padding: "12px",
                  border: `1px solid ${errors.expiry ? "red" : "#ccc"}`,
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <CardExpiryElement
                  options={{ style: { base: { fontSize: "16px", color: "#333" } } }}
                  onChange={(e) => handleChange(e, "expiry")}
                />
              </div>
              {errors.expiry && (
                <p style={{ color: "red", marginTop: "5px" }}>{errors.expiry}</p>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}
              >
                CVC
              </label>
              <div
                style={{
                  padding: "12px",
                  border: `1px solid ${errors.cvc ? "red" : "#ccc"}`,
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <CardCvcElement
                  options={{ style: { base: { fontSize: "16px", color: "#333" } } }}
                  onChange={(e) => handleChange(e, "cvc")}
                />
              </div>
              {errors.cvc && (
                <p style={{ color: "red", marginTop: "5px" }}>{errors.cvc}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: "center" }}>
            <Button
              text={loading ? "Processing..." : "Pay Invoice"}
              blackHover={true}
              icon="CreditCard"
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
