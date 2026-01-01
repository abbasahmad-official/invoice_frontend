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
import { useCurrency } from "../CurrencyContext";

const InvoiceView = ({ setViewInvoice, seeInvoice }) => {
  const {currency:currencyValue} = useCurrency()
  const invoiceRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("")
  const { user, token } = isAuthenticated();
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [initialLoad,setInitialLoading] = useState(false)
  // const [currencyValue, setCurrencyValue] = useState(null)


useEffect(()=>{
  if(seeInvoice){
    getTemplateHTML()
  }
},[seeInvoice])
useEffect(() => {
  if (!invoiceRef.current || !htmlContent) return;

  const iframe = invoiceRef.current;

  const resizeIframe = () => {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    const height =
      doc.documentElement.scrollHeight || doc.body.scrollHeight;

    iframe.style.height = `${height}px`;
  };

  iframe.onload = resizeIframe;
}, [htmlContent]);


const getTemplateHTML = async()=>{
    if(!seeInvoice?._id){
      setInitialLoading(true)
      return
    }
    setInitialLoading(true)
    const html = await generateHTML(seeInvoice?._id, user?.currency, currencyValue)
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
   const blob = await generatePDFByTemplate(seeInvoice,user?.currency, currencyValue )
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

      <div className="invoice-wrapper" >
{initialLoad? <SpinningWheel size={60}/> :<iframe
    ref={invoiceRef}
    style={{ width: "100%", border: "none" }}
    srcDoc={htmlContent} // this is your fetched HTML string
    title="Invoice Preview"
  />}
      </div>
    </div>
  );
};

export default InvoiceView;
