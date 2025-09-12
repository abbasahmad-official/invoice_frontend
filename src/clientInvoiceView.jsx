import React, { useEffect, useRef, useState } from "react";
import { FileText, Calendar, Mail } from "lucide-react";
import Button from "./ui/Button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./styles/invoice-view.css";
import { useParams } from "react-router-dom";
import { getInvoiceForClient } from "./admin/api";


const ClientInvoiceView = () => {
  const invoiceRef = useRef();
  const {invoiceId} = useParams();
  const [invoice, setInvoice] = useState({});
  // console.log(invoiceId)


useEffect(() => {
  if (invoiceId && invoiceId.trim() !== '') {
    const fetchInvoice = async () => {
      const data = await getInvoiceForClient(invoiceId);
      setInvoice(data);
    };

    fetchInvoice();
  }
}, [invoiceId]);


const downloadPDF = () => {
  const pdf = new jsPDF("p", "mm", "a4");
  let top = 20;
  const left = 15;

  // Title
  pdf.setFontSize(18);
  pdf.text("INVOICE", left, top);
  top += 10;

  // Invoice Details
  pdf.setFontSize(12);
  pdf.text(`Invoice Number: ${invoice._id}`, left, top);
  top += 7;
  pdf.text(`Issue Date: ${formatDate(invoice.createdAt)}`, left, top);
  top += 7;
  pdf.text(`Due Date: ${formatDate(invoice.dueDate)}`, left, top);
  top += 10;

  // Client Info
  pdf.setFontSize(14);
  pdf.text("Client Information:", left, top);
  top += 7;
  pdf.setFontSize(12);
  pdf.text(`Name: ${invoice.client?.name || "N/A"}`, left, top);
  top += 6;
  pdf.text(`Email: ${invoice.client?.email || "N/A"}`, left, top);
  top += 6;
  pdf.text(`Phone: ${invoice.client?.phone || "N/A"}`, left, top);
  top += 10;

  // Items Header
  pdf.setFontSize(14);
  pdf.text("Items:", left, top);
  top += 8;

  pdf.setFontSize(12);
  pdf.text("Description", left, top);
  pdf.text("Qty", left + 70, top);
  pdf.text("Price", left + 90, top);
  pdf.text("Total", left + 120, top);
  top += 6;

  // Items Loop
  invoice.items?.forEach((item) => {
    const name = item.productId?.name || "N/A";
    const qty = item.quantity;
    const price = item.price;
    const totalPrice = (qty * price).toFixed(2);

    pdf.text(name, left, top);
    pdf.text(String(qty), left + 70, top);
    pdf.text(`$${price}`, left + 90, top);
    pdf.text(`$${totalPrice}`, left + 120, top);
    top += 6;
  });

  top += 10;

  // Summary
  pdf.setFontSize(14);
  pdf.text("Summary:", left, top);
  top += 7;
  pdf.setFontSize(12);
  pdf.text(`Subtotal: $${subtotal}`, left, top);
  top += 6;
  pdf.text(`Tax (${invoice.tax || 0}%): $${taxAmount}`, left, top);
  top += 6;
  pdf.text(`Discount (${invoice.discount || 0}%): $${discountAmount}`, left, top);
  top += 6;
  pdf.text(`Total: $${total}`, left, top);
  top += 10;

  // Footer
  pdf.setFontSize(10);
  pdf.text("Thank you for your business!", left, top);

  // Save
  pdf.save(`invoice-${invoice._id}.pdf`);
};



  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const calculateInvoiceSummary = (items = [], tax = 0, discount = 0) => {
  const subtotal = items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  const taxAmount = (tax / 100) * subtotal;
  const discountAmount = (discount / 100) * subtotal;
  const total = subtotal + taxAmount - discountAmount;

  return {
    subtotal: subtotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    total: total.toFixed(2),
  };
};

const {
  subtotal,
  taxAmount,
  discountAmount,
  total
} = calculateInvoiceSummary(invoice?.items, invoice?.tax, invoice?.discount);


  return (
    <div className="invoice-single-page">
      <div className="invoice-header">
       
        <h3>Invoice</h3>
        <div onClick={downloadPDF}>
          <Button blackHover={true} icon="Download" text="PDF" backgroundColor="#000" color="#fff" />
        </div>
      </div>

      <div ref={invoiceRef} className="invoice-content">
        <p className="created-date">Created {formatDate(invoice.createdAt)}</p>

        <section className="details">
          <div>
            <h4>Invoice Number</h4>
            <p>{invoice._id}</p>
          </div>
          <div>
            <h4>Issue Date</h4>
            <p>{invoice.createdAt && formatDate(invoice.createdAt)}</p>
          </div>
          <div>
            <h4>Due Date</h4>
            <p>{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <h4>Total Amount</h4>
            <p>${invoice.totalAmount}</p>
          </div>
        </section>

        <section className="client-info" >
          <h4>Client Information</h4>
          <div className="item">
            <p><strong>Name:</strong> {invoice.client?.name || "N/A"}</p>
            <p><strong>Email:</strong> {invoice.client?.email || "N/A"}</p>
            <p><strong>Phone:</strong> {invoice.client?.phone || "N/A"}</p>
          </div>

        </section>


        <section className="items">
          <h4>Items</h4>
          <table>
            <thead>
              <tr>
                <th>Description</th><th>Qty</th><th>Price</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(invoice.items) && invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.productId?.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
       <section className="summary">
  <div>
    <span>Subtotal</span>
    <span>${subtotal}</span>
  </div>
  <div>
    <span>Tax ({invoice?.tax || 0}%)</span>
    <span>${taxAmount}</span>
  </div>
  <div>
    <span>Discount ({invoice?.discount || 0}%)</span>
    <span>${discountAmount}</span>
  </div>
  <div className="total">
    <span>Total</span>
    <span>${total}</span>
  </div>
</section>
<div style={{textAlign: "center", width: "fit-content", margin: "0 auto" }}>
<Button text={"Pay Invoice"} blackHover={true} icon="CreditCard"/>
</div>
      </div>
    </div>
  );
};

export default ClientInvoiceView;
