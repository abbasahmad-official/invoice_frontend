import React, { useEffect, useState } from 'react';
import { FileText, Calendar, DollarSign } from 'lucide-react';
import Button from './Button';
import '../styles/createClientForm.css'; // Reusing same styles
import Dropdown from "./Dropdown"
import { listProducts, listClients, createInvoice, getInvoice, updateInvoice , getClientsByUser, getProductsByUser} from "../admin/api"
import { isAuthenticated } from '../auth/api';

const UpdateInvoiceForm = ({ onSuccess ,updateInvoiceId,setCreateInvoice, form, setForm, setUpdateInvoice }) => {
    const { user, token } = isAuthenticated();
const [success, setSuccess] = useState("");
    //   const [form, setForm] = useState({
    //     client: '',
    //     items: [{ productId: '', quantity: 1, price: '' }],
    //     tax: 0,
    //     discount: 0,
    //     totalAmount: 0,
    //     status: 'Pending',
    //     isRecurring: false,
    //     frequency: '',
    //     startDate: '',
    //     endDate: '',
    //     createdBy: `${user._id}`
    //   });



    const [products, setProducts] = useState([])
    const [clients, setClients] = useState([])

    const handleItemChange = (index, field, value) => {
        const newItems = [...form.items];

        if (field === 'productId') {
            const selectedProduct = products.find(p => p._id === value);
            const price = selectedProduct ? selectedProduct.price : 0;

            newItems[index].productId = value;
            newItems[index].price = price; // 💰 auto-set price
        } else {
            newItems[index][field] = value;
        }

        setForm({ ...form, items: newItems });
    };

    const addItem = () => {
        const lastItem = form.items[form.items.length - 1];
        if (!lastItem.productId) {
            alert("Please select a product before adding another item.");
            return;
        }

        setForm((prevForm) => ({
            ...prevForm,
            items: [...prevForm.items, { productId: '', quantity: 1 }],
        }));
    };


    const removeItem = (index) => {
        const newItems = form.items.filter((_, i) => i !== index);
        setForm({ ...form, items: newItems });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

const handleSubmit = async () => {
  // Clean items: must have valid productId and quantity > 0
  const cleanedItems = form.items.filter(
    (item) => item.productId && item.quantity > 0
  );

  // Normalize client: allow null if not selected
  const cleanedForm = {
    ...form,
     client: form.client === "no-client" ? null : form.client
,
    items: cleanedItems,
  };

  // Remove recurring fields if not recurring
  if (!form.isRecurring) {
    delete cleanedForm.frequency;
    delete cleanedForm.startDate;
    delete cleanedForm.endDate;
  }

  try {
    const data = await updateInvoice(updateInvoiceId,cleanedForm, token);
    onSuccess()
    // console.log("Invoice updated:", data);
    if(data.error){
        console.log(data.error)
    } else {
        setSuccess("Invoice updated Successfully ✅")
    }
  } catch (error) {
    console.error("Invoice update failed:", error);
  }
};



    const totalAmount = () => {
        if (form.items.length > 0) {

        }
    }


  useEffect(() => {
    const fetchProducts = async () => {
      const data = await (user.role == "admin"? listProducts(user.organization) : getProductsByUser(user._id, token))
      if (data.error) {
        console.log("error fetching products", data.error);
      } else {
        console.log(data)
        setProducts(data)
      }
    }

    const fetchClients = async () => {
      const data = await (user.role== "admin"? listClients(user.organization) : getClientsByUser(user._id, token))
      if (data.error) {
        console.log("error fetching products", data.error);
      } else {
        // console.log(data)
        setClients(data)
      }
    }
    
    fetchClients()
    fetchProducts()

  }, [])

    useEffect(() => {
        const subtotal = form.items.reduce((sum, item) => {
            const price = parseFloat(item.price || 0);
            const quantity = parseFloat(item.quantity || 0);
            return sum + (price * quantity);
        }, 0);

        const taxAmount = (form.tax / 100) * subtotal;
        const discountAmount = (form.discount / 100) * subtotal;
        const total = subtotal + taxAmount - discountAmount;

        setForm(prevForm => ({
            ...prevForm,
            totalAmount: total.toFixed(2),
        }));

        // console.log(form)
    }, [form.items, form.tax, form.discount]);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split('T')[0]; // → "YYYY-MM-DD"
};


    return (
        <div className="client-form-container">
            <div className="container">
                {/* Header */}
                <div className="client-create-header">
                    <div onClick={() => setUpdateInvoice(false)}>
                        <Button icon="ArrowLeftIcon" backgroundColor="transparent" text="Back to Invoices" border="none" color="black" />
                    </div>
                    <div className="info">
                        <h3>Update Invoice</h3>
                        <p>Enter invoice details below</p>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="basic-info">
                    <div className="head">
                        <p><FileText size={15} /> Invoice Information</p>
                        <p>Fill out the invoice details</p>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label>Client</label>
                            <select name="client" value={form.client} onChange={handleChange}>
                                <option value="">Select Client</option>
                               
                                {clients.map((client, i) => (
                                    <option key={i} value={client._id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            {/* <Dropdown setForm={setForm} form={form} /> */}
                              <select name="status" value={form.status} onChange={handleChange}>
                                {/* <option value="">Select Status</option> */}
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                               
                                
                            </select>

                        </div>

                        <div className="field">
                            <label>Tax (%)</label>
                            <input type="number" name="tax" value={form.tax} onChange={handleChange} />
                        </div>

                        <div className="field">
                            <label>Discount (%)</label>
                            <input type="number" name="discount" value={form.discount} onChange={handleChange} />
                        </div>

                       
                           <div className="field">
                                    <label>Due Date</label>
                                    <input type="date" name="dueDate" value={formatDate(form.dueDate)} onChange={handleChange} />
                                </div>
                    </div>
                </div>

                {/* Items */}
                <div className="basic-info">
                    <div className="head">
                        <p><DollarSign size={15} /> Invoice Items</p>
                        <p>Add products/services to the invoice</p>
                    </div>
                    <div className="fields">
                        {form.items.map((item, index) => (
                            <div className="field" key={index}>
                                <label>Product {index + 1}</label>
                                <select
                                    value={item.productId}
                                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={item.price || ''}
                                    readOnly
                                />
                                {form.items.length > 1 && (
                                    <div onClick={() => removeItem(index)}>
                                        <Button
                                            text="Remove"
                                            backgroundColor="#f44336"
                                            color="white"
                                            icon="Trash2"
                                            blackHover={true}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <div onClick={addItem}>
                            <Button text="Add Item" blackHover={true}/>
                        </div>
                         <div className="field">
                            <label>Total Amount</label>
                            <input readOnly type="number" name="totalAmount" value={form.totalAmount} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Recurring Settings */}
                <div className="basic-info">
                    <div className="head">
                        <p><Calendar size={15} /> Recurring Options</p>
                        <p>Set invoice recurrence</p>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isRecurring"
                                    checked={form.isRecurring}
                                    onChange={handleChange}
                                /> Is Recurring?
                            </label>
                        </div>
                        {form.isRecurring && (
                            <>
                                <div className="field">
                                    <label>Frequency</label>
                                    <select name="frequency" value={form.frequency} onChange={handleChange}>
                                        <option value="">Select Frequency</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>

                                <div className="field">
                                    <label>Start Date</label>
                                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                                </div>

                                <div className="field">
                                    <label>End Date</label>
                                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="btns-group">
                    <div onClick={() => setUpdateInvoice(false)}>
                        <Button backgroundColor="white" noIcon={true} text="Cancel" color="black" />
                    </div>
                    <div onClick={handleSubmit}>
                        <Button border="1px solid lightgray" icon='Save'  blackHover={true} text="Save Invoice" />
                    </div>
                </div>

                 {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
            </div>
        </div>
    );
};

export default UpdateInvoiceForm;
