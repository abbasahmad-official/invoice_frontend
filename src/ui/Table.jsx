import React, { useEffect, useState } from 'react'
import '../styles/parts.css'
import { Trash2, Edit, Download, Eye } from "lucide-react";
import { removeClient, removeInvoice, removeProduct, updateClient, updateInvoice, updateProduct, getInvoice } from "../admin/api"
import { isAuthenticated } from "../auth/api"



const Table = ({onSuccess , setViewInvoiceId ,setUpdateInvoiceId, form, setForm, setUpdateInvoice, setUpdateProduct, setUpdateClient, setViewInvoice, header = "Header", subHeader = "Sub Header", tableHeadNames = [], invoices = [], clients = [], products = [] }) => {
  const [error, setError] = useState([]);
  const { user, token } = isAuthenticated();


  // useEffect(()=>{

  // }, [])

  const removeItem = (mode, id) => {
    if (mode == "product") {
      removeProduct(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // console.log(data);
          onSuccess()
          
        }
      })
    } else if (mode == "client") {
      removeClient(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // console.log(data);
          onSuccess()
        }
      })
    } else if (mode == "invoice") {
      removeInvoice(id, token).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // console.log(data);
          onSuccess()
        }
      })
    }
  }


  const fetchInvoice = async (invoiceId) => {
    setUpdateInvoiceId(invoiceId);
    try {
      const data = await getInvoice(invoiceId, token);
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(data)
        const cleanedForm = {
          ...data,
          client: data.client._id,
          items: data.items.map(item => ({
            productId: item.productId._id, // normalize to just ID
            quantity: item.quantity,
            price: item.price || (item.productId?.price || 0),
          })),
        };

        setForm(cleanedForm);
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };



  // useEffect(()=>{
  //   fetchInvoice();
  // }, [])


  return (
    <div className='table-container'>
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
            {invoices.length > 0 && invoices.map((invoice, index) => {
              const paddedIndex = String(index + 1).padStart(3, '0'); // '001', '002', etc.
              const invoiceCode = `IV-${paddedIndex}`; // 'Iv-001'
              const formattedDate = new Date(invoice.createdAt).toLocaleDateString("en-US", {
                month: "short", // Jan
                day: "numeric", // 15
                year: "numeric" // 2025
              });
              const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString("en-US", {
                month: "short", // Jan
                day: "numeric", // 15
                year: "numeric" // 2025
              });
              return <tr key={index}>
                <td><div className="td1"><span>{invoice?.invoiceNumber}</span><p>{formattedDate}</p></div></td>
                <td>{invoice.client ? invoice.client.name : "client removed"}</td>
                <td>{invoice.totalAmount}</td>
                <td><div className={`${invoice.status}`}><p>{invoice.status}</p></div></td>
                <td>{formattedDueDate}</td>
                <td><div className="icons">
                  <Eye size={25} onClick={() => {setViewInvoice(true)
                    setViewInvoiceId(invoice._id);
                  }} />
                  <Edit size={25} onClick={() => {
                    setUpdateInvoice(true)
                    fetchInvoice(invoice._id)
                  }} />
                  <Download size={25} onClick={() => setViewInvoice(true)} />
                  <Trash2 size={25} color='red' onClick={() => removeItem("invoice", invoice._id)} />
                </div></td>
              </tr>
            })
            }

            {clients.length > 0 && clients.map((client, index) => {
 const formattedDate = new Date(client.createdAt).toLocaleDateString("en-US", {
                month: "short", // Jan
                day: "numeric", // 15
                year: "numeric" // 2025
              });

              return <tr key={index} >
                <td><div className="td1"><span>{client.name}</span><p>{client.email}</p></div></td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td><div><p>invoices</p></div></td>
                <td>{formattedDate}</td>
                <td><div className="icons">
                  {/* <Eye  size={25}/> */}
                  <Edit size={25} onClick={() => setUpdateClient({
                    clientId: client._id,
                    clientInfo: client,
                    updateStatus: true
                  })} />
                  {/* <Download size={25} /> */}
                  <Trash2 size={25} color='red' onClick={() => removeItem("client", client._id)} />
                </div></td>
              </tr>
            })}
            {products.length > 0 && products.map((product, index) => {
const formattedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
                month: "short", // Jan
                day: "numeric", // 15
                year: "numeric" // 2025
              });
              return <tr key={index} >
                <td><div className="td1"><span>{product.name}</span><p>{product.description}</p></div></td>
                <td>{product.category || "category"}</td>
                <td>{product.price}</td>
                <td><div><p>unit per hour</p></div></td>
                <td>{formattedDate}</td>
                <td><div className="icons">
                  {/* <Eye  size={25}/> */}
                  <Edit size={25} onClick={() => {

                    setUpdateProduct(product)
                  }} />
                  {/* <Download size={25} /> */}
                  <Trash2 size={25} color='red' onClick={() => removeItem("product", product._id)} />
                </div></td>
              </tr>
            })}

          </tbody>


        </table>
      </div>
    </div>
  )
}

export default Table
