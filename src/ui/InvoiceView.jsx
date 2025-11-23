import React, { useEffect, useRef, useState } from "react";
import { FileText, Calendar, Mail } from "lucide-react";
import Button from "./Button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/invoice-view.css";
import { createInvoiceSend, generateHTML, generatePDFByTemplate, sendEmail } from "../admin/api";
import { isAuthenticated } from "../auth/api";
import Success from "./Success";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import InvoicePDF from "../ui/InvoicePdf";
import "../styles/viewInvoice.css";
import { generatePDF } from "../admin/api";
import SpinningWheel from "./SpinningWheel";

const InvoiceView = ({ setViewInvoice, seeInvoice }) => {
  const invoiceRef = useRef();
  const [htmlContent, setHtmlContent] = useState("")
  const { user, token } = isAuthenticated();
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [initialLoad,setInitialLoading] = useState(false)
const loadCSS = async (path) => {
  const res = await fetch(path);
  return await res.text();
};

useEffect(()=>{
  if(seeInvoice){
    getTemplateHTML()
  }
},[seeInvoice])

const getTemplateHTML = async()=>{
    if(!seeInvoice?._id){
      setInitialLoading(true)
      return
    }
    setInitialLoading(true)
    const html = await generateHTML(seeInvoice?._id)
    if(!html){
      console.log("no template retrived")
      setInitialLoading(false)
    } else{
     setInitialLoading(false)
     setHtmlContent(html)
   }
}

  const downloadPDF = async () => {
    setLoading(true)
  if (!seeInvoice) return;
   const blob = await generatePDFByTemplate(seeInvoice)
  if (!blob) {
    console.error("Failed to generate PDF");
    setLoading(false);
    return;
  }
 const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = `invoice_${seeInvoice?.invoiceNumber}.pdf`;
document.body.appendChild(link); // optional but safer
link.click();
document.body.removeChild(link);
 URL.revokeObjectURL(url);
console.log("reachedEnd")
  setLoading(false)
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
      return acc + item.price * item.quantity;
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

  const { subtotal, taxAmount, discountAmount, total } =
    calculateInvoiceSummary(
      seeInvoice?.items,
      seeInvoice?.tax,
      seeInvoice?.discount
    );

  const sendEmailUser = async () => {
    //
    if (seeInvoice && seeInvoice.client.email) {
      setLoadingSend(true);
      try {
        const data = await sendEmail(seeInvoice, token);
        if (data.error) {
          console.log(data.error);
        } else {
          setLoadingSend(false);
          setSuccessMessage("Email sent successfully");
          // Optionally clear after 3s:
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      } catch (error) {
        console.log(error);
        setLoadingSend(false)
      }

      //  console.log(data)
    }
  };
  return (
    <div className="invoice-single-page">
      {successMessage && <Success message={successMessage} />}

      {/* --- Header Buttons --- */}
      <div className="top-buttons">
        <div onClick={() => setViewInvoice(false)}>
          <Button
            icon="ArrowLeftIcon"
            color="black"
            backgroundColor="transparent"
            text="Back"
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
         {/* { seeInvoice &&<PDFDownloadLink
            document={<InvoicePDF seeInvoice={seeInvoice} />}
            fileName={`invoice_${seeInvoice.invoiceNumber}.pdf`}
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>} */}
          <div  onClick={downloadPDF}>
          <Button loading={loading} blackHover={true} icon="Download" text="PDF" backgroundColor="#000" color="#fff" />
        </div>
          <div onClick={sendEmailUser}>
            <Button
              blackHover={true}
              icon="Send"
              text={"Send"}
              backgroundColor="#000"
              color="#fff"
              loading={loadingSend}
            />
          </div>
        </div>
      </div>

      <div >
        {/* <div className="invoice-content"> */}
{initialLoad? <SpinningWheel size={60}/> :<iframe
    ref={invoiceRef}
    style={{ width: "100%", height: "1000px", border: "none" }}
    srcDoc={htmlContent} // this is your fetched HTML string
    title="Invoice Preview"
  />}
{/* </div> */}

        {/* --- Modern Header --- */}
   {/* <div className="invoice-template-wrapper">

  {/* HEADER BLUE BAND */}
  {/* <div className="inv-header">
    <div className="inv-left">
      <h2 className="inv-logo-text"><img src="" alt="logo" /></h2>

      <p className="inv-to-title">Invoice To:</p>
      <p className="inv-client-name">{seeInvoice.client?.name}</p>
      <p className="inv-client-role">
        {seeInvoice.client?.email}
      </p>
    </div>

    <div className="inv-right">
      <h1 className="inv-title">INVOICE</h1>

      <p><strong>Invoice No:</strong> #{seeInvoice.invoiceNumber}</p>
      <p><strong>Due Date:</strong> {formatDate(seeInvoice.dueDate)}</p>
      <p><strong>Invoice Date:</strong> {formatDate(seeInvoice.createdAt)}</p>
    </div>
  </div>

  {/* ADDRESS BAR */}
  {/* <div className="inv-address-bar">
    <span className="inv-icon">📍</span>
    <span>{seeInvoice.client?.address || "No address provided"}</span>
  </div>

  {/* CONTACT + PAYMENT INFO */}
  {/* <div className="inv-info-block">
    <div className="inv-contact">
      <p><strong>Phone:</strong> {seeInvoice.client?.phone}</p>
      <p><strong>Email:</strong> {seeInvoice.client?.email}</p>
      <p><strong>Address:</strong> {seeInvoice.client?.address}</p>
    </div>

    <div className="inv-payment">
      <p><strong>Account No:</strong> {seeInvoice.accountNo || "N/A"}</p>
      <p><strong>Account Name:</strong> {seeInvoice.client?.name}</p>
      <p><strong>Branch Name:</strong> {seeInvoice.branchName || "Main Branch"}</p>
    </div>
  </div>

  {/* ITEMS TABLE */}
  {/* <table className="inv-table">
    <thead>
      <tr>
        <th>DESCRIPTION</th>
        <th>SUBTOTAL</th>
        <th>QTY</th>
        <th>SUBTOTAL</th>
      </tr>
    </thead>

    <tbody>
      {seeInvoice.items?.map((item, i) => (
        <tr key={i}>
          <td>{item.productId?.name}</td>
          <td>Rs {item.price.toFixed(2)}</td>
          <td>{item.quantity}</td>
          <td>Rs {(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* TERMS + SUMMARY */}
  {/* <div className="inv-bottom-section">
    <div className="inv-terms">
      <h4>TERM AND CONDITIONS</h4>
      <p>
        Please send payment within 30 days of receiving this invoice.  
        A 10% interest fee applies on late invoices.
      </p>

      <h4 style={{ marginTop: "20px" }}>THANK YOU FOR YOUR BUSINESS</h4>

      <p>📞 {seeInvoice.client?.phone}</p>
      <p>📧 {seeInvoice.client?.email}</p>
      <p>📍 {seeInvoice.client?.address}</p>
    </div>

    <div className="inv-summary">
      <p><span>Sub-total:</span> Rs {subtotal}</p>
      <p><span>Discount:</span> Rs {discountAmount}</p>
      <p><span>Tax:</span> Rs {taxAmount}</p>

      <p className="inv-total"><span>Total:</span> Rs {total}</p>
    </div>
  </div>

  {/* SIGNATURE AREA */}
  {/* <div className="inv-sign">
    <div>
      <p className="inv-sign-line"></p>
      <p className="inv-sign-name">Administrator</p>
    </div>
  </div>
</div> */} 

      </div>
    </div>
  );
};

export default InvoiceView;
