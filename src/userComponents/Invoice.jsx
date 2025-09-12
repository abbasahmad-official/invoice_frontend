import React, { Fragment, useEffect, useState } from 'react'
import Button from '../ui/Button'
import '../styles/dashboard.css'
import '../styles/invoice.css'
import SearchBar from '../ui/Search'
import Table from '../ui/Table'
import { listInvoices, getInvoicesByUser, getInvoice } from '../admin/api'
import CreateInvoiceForm from '../ui/CreateInvoiceForm'
import InvoiceView from '../ui/InvoiceView'
import UpdateInvoiceForm from '../ui/UpdateInvoiceForm'
import { isAuthenticated } from '../auth/api'

const Invoice = ({directLink="", activeSection="", setDirectLink}) => {
  const [invoices, setInvoices] = useState([]);
  const [updateInvoice, setUpdateInvoice] = useState(false);
  const [error, setError] = useState(false);
const [loading, setLoading] = useState(true);
const [createInvoice, setCreateInvoice] = useState(false)
const [viewInvoice, setViewInvoice] = useState(false)
const tableHeadNames = ["Invoice", "Client", "Amount", "Status", "Due Date", "Actions"];
const [searchTerm, setSearchTerm] = useState('');
const [status, setStatus] = useState('')
const [shouldReloadInvoices, setShouldReloadInvoices] = useState(false);
const {user, token} = isAuthenticated()
const [invoice, setInvoice] = useState({})

const [form, setForm] = useState({
    client: '',
    items: [{ productId: '', quantity: 1, price: '' }],
    tax: 0,
    discount: 0,
    totalAmount: 0,
    status: 'Pending',
    isRecurring: false,
    frequency: '',
    startDate: '',
    endDate: '',
    createdBy: `${user._id}`
  });

const [updateInvoiceId,setUpdateInvoiceId] = useState();
const [viewInvoiceId, setViewInvoiceId] = useState(null);




 useEffect(() => {
  // listInvoices()
  getInvoicesByUser(user._id, token)
    .then((data) => {
      setInvoices(data);
    })
    .catch((err) => {
      console.error("Failed to load invoices:", err);
    });
}, [shouldReloadInvoices]);

useEffect(() => {
  if (directLink === "invoices" && activeSection === "invoices") {
    setCreateInvoice(true);
    setDirectLink("")
  }
}, [directLink, activeSection]);

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  console.log(e.target.value)
};

useEffect(()=>{
  const invoiceGetter = async() => {
 if(!viewInvoiceId.trim()) return ""
   else{
    const view = await getInvoice(viewInvoiceId, token);
    setInvoice(view);
   }
  }
  invoiceGetter();
 
},[viewInvoiceId])


const filteredInvoices = invoices
  .map((invoice, index) => {
    const invoiceCode = `Iv-${String(index + 1).padStart(3, '0')}`;
     
    return { ...invoice, invoiceCode }; // Add invoiceCode to each invoice object
  })
  .filter((invoice) => {
   const formattedDate = new Date(invoice.createdAt).toLocaleDateString("en-US", {
                month: "short", // Jan
                day: "numeric", // 15
                year: "numeric" // 2025
              });
    
    const matchesSearch =
      invoice?.invoiceNumber?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.totalAmount?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
      formattedDate.toLowerCase().includes(searchTerm.toLowerCase()); 

    const matchesStatus =
      status && status !== "All Status"
        ? invoice.status === status
        : true;

    return matchesSearch && matchesStatus;
  });


// useEffect(()=>{
//   console.log(status == "All Status")
//   filteredInvoices.push
// }, [status])


  return (
    <Fragment>
   {!createInvoice && !viewInvoice && !updateInvoice && <div>
      <div className="dashboard-header">
                <div className="info">
                    <h2>Invoices</h2>
                    <p>Manage and track all your invoices</p>
                </div>
                <div onClick={() => setCreateInvoice(true)}>
                <Button text="Create Invoice" blackHover={true} />
                </div>
    </div>
    <SearchBar status={true} setStatus={setStatus}  onChange={handleSearchChange} value={searchTerm} />
    <Table setViewInvoiceId={setViewInvoiceId} onSuccess={()=> setShouldReloadInvoices(prev=> !prev)} setUpdateInvoiceId={setUpdateInvoiceId} form={form} setForm={setForm} setUpdateInvoice={setUpdateInvoice} setViewInvoice={setViewInvoice} header='All Invoices' subHeader='Click on an invoice to view details' tableHeadNames={tableHeadNames} invoices={filteredInvoices} />
    </div>}
    
    {createInvoice  && <CreateInvoiceForm onSuccess={()=> setShouldReloadInvoices(prev=> !prev)} setCreateInvoice={setCreateInvoice}/> }
    {viewInvoice && <InvoiceView setViewInvoice={setViewInvoice}  seeInvoice={invoice} />}
    {updateInvoice && <UpdateInvoiceForm onSuccess={()=> setShouldReloadInvoices(prev=> !prev)} updateInvoiceId={updateInvoiceId} setViewInvoice={setViewInvoice} form={form} setForm={setForm} setUpdateInvoice={setUpdateInvoice}/>}

    </Fragment>
  )
}

export default Invoice
