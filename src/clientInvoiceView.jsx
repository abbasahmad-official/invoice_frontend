import React, { useEffect, useRef, useState } from "react";
import { FileText, Calendar, Mail } from "lucide-react";
import Button from "./ui/Button";
import "./styles/invoice-view.css";
import { useParams } from "react-router-dom";
import { getInvoiceForClient ,stripePayment, generatePDF, generatePDFByTemplate,generatePDFPublic, generateHTML } from "./admin/api";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {stripeKey} from "./config.js"
import PaymentForm from "./ui/PaymentForm";
import SpinningWheel from "./ui/SpinningWheel.jsx";

const stripePromise = loadStripe(stripeKey);

const ClientInvoiceView = () => {
  const invoiceRef = useRef();
  const {invoiceId} = useParams();
  const [invoice, setInvoice] = useState({});
const [loading, setLoading] = useState(true);
const [pdfLoading, setPdfLoading] = useState(false);
const [initialLoad,setInitialLoading] = useState(false)
const [htmlContent, setHtmlContent] = useState("");
const [formShow, setFormShow] = useState(false)

const [status,setStatus] = useState("")


useEffect(() => {
  console.log(invoiceId)

  if (invoiceId && invoiceId.trim() !== '') {
  fetchInvoice();
  getTemplateHTML();
}

}, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const data = await getInvoiceForClient(invoiceId);
      if(data.error){
        console.log("error", data.error)
      } else {
        setStatus(data.status);
        setInvoice(data);
        console.log(data)
      }
    } catch (err) {
      console.error("Failed to fetch invoice", err);
    } finally {
      setLoading(false);
    }
  };


const getTemplateHTML = async()=>{
    if(!invoiceId){
      setInitialLoading(true)
      return
    }
    setInitialLoading(true)
    const html = await generateHTML(invoiceId)
    if(!html){
      console.log("no template retrived")
      setInitialLoading(false)
    } else{
     setInitialLoading(false)
     setHtmlContent(html)
   }
}


if (loading) return <p>Loading invoice............</p>;



  const downloadPDF = async () => {
    setPdfLoading(true)
  if (!invoice) return;


if (!invoiceRef.current) {
  console.error("invoiceRef is not ready");
  setPdfLoading(false);
  return;
}
   const blob = await generatePDFByTemplate(invoice);
  if (!blob) {
    console.error("Failed to generate PDF");
    setPdfLoading(false);
    return;
  }
 const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = `invoice_${invoice?.invoiceNumber}.pdf`;
document.body.appendChild(link); // optional but safer
link.click();
document.body.removeChild(link);

 URL.revokeObjectURL(url);
console.log("reachedEnd")
  // document.body.removeChild(link);
  setPdfLoading(false)
};


  return (
    <div className="invoice-single-page">
      <div style={{display:"flex", justifyContent:"flex-end"}} className="invoice-header">
     <button
  onClick={() => setFormShow(true)}
  style={{
    padding: "5px 28px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(90deg, #4CAF50, #45A049)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    marginRight:"10px"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  }}
>
  Proceed To Payment
</button>

        {/* <h3>Invoice</h3> */}
        <div style={{}} onClick={downloadPDF}>
          <Button loading={pdfLoading} blackHover={true} icon="Download" text="PDF" backgroundColor="#000" color="#fff" />
        </div>
      </div>

     <div style={{height:"100%"}}>
        {initialLoad? <SpinningWheel size={60}/> :<iframe
            ref={invoiceRef}
            style={{ width: "100%", height: "700px", border: "none" }}
            srcDoc={htmlContent} // this is your fetched HTML string
            title="Invoice Preview"
          />}
      </div>
      <div style={{   }}>

  {formShow && <Elements stripe={stripePromise}>
    <PaymentForm  invoice={invoice && invoice} setFormShow={setFormShow} />    
   </Elements>}
      </div>
    </div>
  );
};

export default ClientInvoiceView;
