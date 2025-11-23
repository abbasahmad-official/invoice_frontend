import React, { useEffect, useState } from "react";
import "../styles/parts.css";
import { Trash2, Edit, Download, Eye, Ban, PlayCircle } from "lucide-react";
import {
  removeOrg,
  removeClient,
  removeInvoice,
  removeProduct,
  updateClient,
  updateInvoice,
  updateProduct,
  getInvoice,
  updateUser,
  updateOrg,
  removeManager,
  convertCurrency,
  generatePDFByTemplate
} from "../admin/api";
import { isAuthenticated } from "../auth/api";
import jsPDF from "jspdf";
import { useCurrency } from "../CurrencyContext";
import SpinningWheel from "./SpinningWheel";

const Table = ({
  // setManager,
  setCreateUpdateManager,
   setUpdateManager,
  setCreateUpdateOrg,
  setUpdateOrg,
  onSuccess,
  setViewInvoiceId,
  setUpdateInvoiceId,
  form,
  setForm,
  setUpdateInvoice,
  setUpdateProduct,
  setUpdateClient,
  setViewInvoice,
  header = "Header",
  subHeader = "Sub Header",
  tableHeadNames = [],
  invoices = [],
  clients = [],
  products = [],
  orgs = [],
  managers = [],
  setManagers = null,
  setShouldReloadProducts = null,
  setOrgs = null
}) => {
  const [error, setError] = useState([]);
  const { user, token } = isAuthenticated();
  const [invoice, setInvoice] = useState({});
  const [loading, setLoading] = useState(false)
  const [invId, setInvId] = useState(null)
  const [orgRemoveId, setOrgRemoveId] = useState(null)
  // const [currency, setCurrency]=  useState(null)
const {currency, setCurrencyCode} = useCurrency({})
 


  useEffect(()=>{
    setCurrencyCode(user?.currency.code)
// currencyChange()
//   }, [])
//   const currencyChange = async() =>{
//     const data = await convertCurrency("USD")
//     setCurrency(data.rates[user?.currency.code])
}, [])

  const removeItem = (mode, id) => {
    setLoading(true)
    if (mode == "product") {
      removeProduct(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
           setLoading(false)
        } else {
          // console.log(data);
          setLoading(false)
          onSuccess();
        }
      });
    } else if (mode == "client") {
      removeClient(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
           setLoading(false)
        } else {
          // console.log(data);
           setLoading(false)
          onSuccess();
        }
      });
    } else if (mode == "invoice") {
      removeInvoice(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
           setLoading(false)
        } else {
          // console.log(data);
           setLoading(false)
          onSuccess();
        }
      });
    } else if (mode == "org") {
      setOrgRemoveId(id)
      removeOrg(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
           setLoading(false)
        } else {
          // console.log(data);
           setLoading(false)
          onSuccess();
        }
      });
    } else if (mode == "manager") {
      removeManager(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
           setLoading(false)
        } else {
          // console.log(data);
           setLoading(false)
          onSuccess();
        }
      });
    }
  };

  const fetchInvoice = async (invoiceId) => {
    setUpdateInvoiceId(invoiceId);
    try {
      const data = await getInvoice(invoiceId, token);
      if (data.error) {
        console.log(data.error);
      } else {
        // console.log(data);
        const cleanedForm = {
          ...data,
          client: data.client._id,
          items: data.items.map((item) => ({
            productId: item.productId._id, // normalize to just ID
            quantity: item.quantity,
            price: item.price || item.productId?.price || 0,
          })),
        };

        setForm(cleanedForm);
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };



  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });


  const downloadPDF = async (invoice) => {
    setLoading(true)
    setInvId(invoice._id)
    const blob = await generatePDFByTemplate(invoice) 
     if (!blob) {
      setLoading(false)
    console.error("Failed to generate PDF");
    setLoading(false);
    return;
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `invoice_${invoice?.invoiceNumber}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  setInvId(null)
  setLoading(false)
  };

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
    calculateInvoiceSummary(invoice?.items, invoice?.tax, invoice?.discount);


  const updateStatus = async (manager) => {
    const updatedManager  = {...manager,
      status: manager.status == "active"?"suspended":"active"
    }  
    const data = await updateUser(updatedManager, updatedManager._id, token)

    if(data.error){
      console.log(data.error)
    } else {
      // ✅ Immutably update the state array so React re-renders
      setManagers(prevManagers =>
        prevManagers.map(m =>
          m._id === manager._id ? { ...m, status: data.status } : m
        )
      );

      setShouldReloadProducts(prev => !prev)
    }
  }

    const updateStatusOrg = async (org) => {
    const updatedOrg  = {...org,
      status: org.status == "active"?"suspended":"active"
    }  
    
    const data = await updateOrg(org._id, updatedOrg)

    if(data.error){
      console.log(data.error)
    } else {
  
      setOrgs(prevOrgs =>
        prevOrgs.map(m =>
          m._id === org._id ? { ...m, status: data.status } : m
        )
      );

      setShouldReloadProducts(prev => !prev)
    }
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <p>{header}</p>
        <p>{subHeader}</p>
      </div>
      <div className="table-content">
        <table>
          <thead>
            <tr>
              {tableHeadNames.map((head, index) => (
                <th key={index}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 &&
              invoices.map((invoice, index) => {
                const paddedIndex = String(index + 1).padStart(3, "0"); // '001', '002', etc.
                const invoiceCode = `IV-${paddedIndex}`; // 'Iv-001'
                const formattedDate = new Date(
                  invoice.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short", // Jan
                  day: "numeric", // 15
                  year: "numeric", // 2025
                });
                const formattedDueDate = new Date(
                  invoice.dueDate
                ).toLocaleDateString("en-US", {
                  month: "short", // Jan
                  day: "numeric", // 15
                  year: "numeric", // 2025
                });
                return (
                  <tr key={index}>
                    <td>
                      <div className="td1">
                        <span>{invoice?.invoiceNumber}</span>
                        <p>{formattedDate}</p>
                      </div>
                    </td>
                    <td>
                      {invoice.client ? invoice.client.name : "client removed"}
                    </td>
                    <td>{user?.currency.symbol} {(invoice.totalAmount * currency).toFixed(2)}</td>
                    <td>
                      <div className={`${invoice.status}`}>
                        <p>{invoice.status}</p>
                      </div>
                    </td>
                    <td>{formattedDueDate}</td>
                    <td>
                      <div className="icons">
                        <Eye
                          size={25}
                          onClick={() => {
                            setViewInvoice(true);
                            setViewInvoiceId(invoice._id);
                          }}
                        />
                        <Edit
                          size={25}
                          onClick={() => {
                            setUpdateInvoice(true);
                            fetchInvoice(invoice._id);
                          }}
                        />
                       {(loading && invId == invoice?._id)? <SpinningWheel size={25}/>:<Download
                          size={25}
                          onClick={() => downloadPDF(invoice)}
                        />}
                        <Trash2
                          size={25}
                          color="red"
                          onClick={() => removeItem("invoice", invoice._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

            {clients.length > 0 &&
              clients.map((client, index) => {
                const formattedDate = new Date(
                  client.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short", // Jan
                  day: "numeric", // 15
                  year: "numeric", // 2025
                });

                return (
                  <tr key={index}>
                    <td>
                      <div className="td1">
                        <span>{client.name}</span>
                        <p>{client.email}</p>
                      </div>
                    </td>
                    <td>{client.phone}</td>
                    <td>{client.address}</td>
                    <td>
                      <div style={{textAlign:"center"}}>
                        <p>{client.invoiceCount || "invoices"}</p>
                      </div>
                    </td>
                    <td>{formattedDate}</td>
                    <td>
                      <div className="icons">
                        {/* <Eye  size={25}/> */}
                        <Edit
                          size={25}
                          onClick={() =>
                            setUpdateClient({
                              clientId: client._id,
                              clientInfo: client,
                              updateStatus: true,
                            })
                          }
                        />
                        {/* <Download size={25} /> */}
                        <Trash2
                          size={25}
                          color="red"
                          onClick={() => removeItem("client", client._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            {products.length > 0 &&
              products.map((product, index) => {
                const formattedDate = new Date(
                  product.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short", // Jan
                  day: "numeric", // 15
                  year: "numeric", // 2025
                });
                return (
                  <tr key={index}>
                    <td>
                      <div className="td1">
                        <span>{product.name}</span>
                        <p>{product.description}</p>
                      </div>
                    </td>
                    {/* <td>{product.category || "category"}</td> */}
                    <td>{user?.currency.symbol} {(product.price * currency).toFixed(2)}</td>
                    {/* <td>
                      <div>
                        <p>unit per hour</p>
                      </div>
                    </td> */}
                    <td>{formattedDate}</td>
                    <td>
                      <div className="icons">
                        {/* <Eye  size={25}/> */}
                        <Edit
                          size={25}
                          onClick={() => {
                            setUpdateProduct(product);
                          }}
                        />
                        {/* <Download size={25} /> */}
                        <Trash2
                          size={25}
                          color="red"
                          onClick={() => removeItem("product", product._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            {orgs.length > 0 &&
              orgs.map((org, index) => {
                const formattedDate = new Date(
                  org.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short", // Jan
                  day: "numeric", // 15
                  year: "numeric", // 2025
                });
                return (
                  <tr key={index}>
                    <td>
                      <div className="td1">
                        <span>{org.name}</span>
                        <p>{org.description}</p>
                      </div>
                    </td>
                    <td>{org.email || "category"}</td>
                   
                    <td>
                      <div className={`${org.status}`}>
                        <p>{org.status}</p>
                      </div>
                      </td>
                   
                    <td>
                      <div>
                        <p>One Time Purchase</p>
                      </div>
                    </td>
                    <td>{formattedDate}</td>
                    <td>
                      <div className="icons">
                        {/* <Eye  size={25}/> */}
                        {org.status== "active"?<Ban
                        onClick={()=>updateStatusOrg(org)}
                        color="red"
                        />:<PlayCircle
                        onClick={()=>updateStatusOrg(org)}
                        color="green"
                        />}
                        <Edit
                          size={25}
                          onClick={() => {
                            setCreateUpdateOrg(true);
                            setUpdateOrg(org);
                          }}
                        />
                        {/* <Download size={25} /> */}
                         {(loading && orgRemoveId == org?._id)? <SpinningWheel size={25}/>:<Trash2
                          size={25}
                          onClick={() => removeItem("org", org._id)}
                        />}
                        {/* <Trash2
                          size={25}
                          color="red"
                          onClick={() => removeItem("org", org._id)}
                        /> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            {managers.length > 0 &&
              managers.map((manager, index) => {
                if (manager.name ===  user.name) return null;
                const formattedDate = new Date(
                  manager.createdAt
                ).toLocaleDateString("en-US", {
                  month: "short", // Jan
                  day: "numeric", // 15
                  year: "numeric", // 2025
                });
                return (
                  <tr key={index}>
                    <td>
                      <div className="td1">
                        <span>{manager.name}</span>
                        <p>{manager.description}</p>
                      </div>
                    </td>
                    <td>{manager.email || "category"}</td>
                       <td>
                      <div className={`${manager.status}`}>
                        <p>{manager.status}</p>
                      </div>
                      </td>
                   
                    {/* <td>
                      <div>
                        <p>One Time Purchase</p>
                      </div>
                    </td> */}
                    <td>{formattedDate}</td>
                    <td>
                      <div className="icons">
                        {/* <Eye  size={25}/> */}
                        {manager.status== "active"? <Ban
                        onClick={()=>updateStatus(manager)}
                        color="red"
                          size={25}
                        />: <PlayCircle
                        onClick={()=>updateStatus(manager)} 
                        size={25}
                        color="green"
                        />}
                        <Edit
                          size={25}
                          onClick={() => {
                            setCreateUpdateManager(true);
                            setUpdateManager(manager);
                          }}
                        />
                        {/* <Download size={25} /> */}
                        <Trash2
                          size={25}
                          color="red"
                          onClick={() => removeItem("manager", manager._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
