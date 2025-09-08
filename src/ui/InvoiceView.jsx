import React, { useEffect, useRef } from "react";
import { FileText, Calendar, Mail } from "lucide-react";
import Button from "./Button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/invoice-view.css";


const InvoiceView = ({ setViewInvoice, seeInvoice }) => {
  const invoiceRef = useRef();
  useEffect(() => {
    console.log(seeInvoice);
  }, [])

  const downloadPDF = async () => {
    const element = invoiceRef.current;
    const pdf = new jsPDF("p", "mm", "a4");
    const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("invoice.pdf");
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
} = calculateInvoiceSummary(seeInvoice?.items, seeInvoice?.tax, seeInvoice?.discount);


  return (
    <div className="invoice-single-page">
      <div className="invoice-header">
        <div onClick={() => setViewInvoice(false)}>
          <Button icon="ArrowLeftIcon" color="black" backgroundColor="transparent" text="Back" />
        </div>
        <h3>Invoice</h3>
        <div onClick={downloadPDF}>
          <Button blackHover={true} icon="Download" text="PDF" backgroundColor="#000" color="#fff" />
        </div>
      </div>

      <div ref={invoiceRef} className="invoice-content">
        <p className="created-date">Created {formatDate(seeInvoice.createdAt)}</p>

        <section className="details">
          <div>
            <h4>Invoice Number</h4>
            <p>{seeInvoice._id}</p>
          </div>
          <div>
            <h4>Issue Date</h4>
            <p>{formatDate(seeInvoice.createdAt)}</p>
          </div>
          <div>
            <h4>Due Date</h4>
            <p>{formatDate(seeInvoice.dueDate)}</p>
          </div>
          <div>
            <h4>Total Amount</h4>
            <p>${seeInvoice.totalAmount}</p>
          </div>
        </section>

        <section className="client-info" >
          <h4>Client Information</h4>
          <div className="item">
            <p><strong>Name:</strong> {seeInvoice.client?.name || "N/A"}</p>
            <p><strong>Email:</strong> {seeInvoice.client?.email || "N/A"}</p>
            <p><strong>Phone:</strong> {seeInvoice.client?.phone || "N/A"}</p>
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
              {Array.isArray(seeInvoice.items) && seeInvoice.items.map((item, idx) => (
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
    <span>Tax ({seeInvoice?.tax || 0}%)</span>
    <span>${taxAmount}</span>
  </div>
  <div>
    <span>Discount ({seeInvoice?.discount || 0}%)</span>
    <span>${discountAmount}</span>
  </div>
  <div className="total">
    <span>Total</span>
    <span>${total}</span>
  </div>
</section>


      </div>
    </div>
  );
};

export default InvoiceView;
