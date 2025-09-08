import React, { useEffect, useState } from 'react';
import { FileText, Calendar, DollarSign } from 'lucide-react';
import Button from './Button';
import '../styles/CreateClientForm.css'; // Reusing same styles
import Dropdown from "./Dropdown"
import { listProducts, listClients, createInvoice, getClientsByUser, getProductsByUser } from "../admin/api"
import { isAuthenticated } from '../auth/api';

const CreateInvoiceForm = ({ onSuccess ,setCreateInvoice }) => {
  const { user, token } = isAuthenticated();
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
    dueDate: '',
    createdBy: `${user._id}`
  });
  const [success, setSuccess] = useState("");

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
    const cleanedItems = form.items.filter(
      (item) => item.productId && item.quantity > 0
    );

    const cleanedForm = {
      ...form,
      items: cleanedItems,
    };

    // ✅ Remove invalid recurring fields if not applicable
    if (!form.isRecurring) {
      delete cleanedForm.frequency;
      delete cleanedForm.startDate;
      delete cleanedForm.endDate;
    }

    try {
      const data = await createInvoice(cleanedForm, token);
      onSuccess()
      // console.log("Invoice created:", data);
    } catch (error) {
      console.error("Invoice creation failed:", error);
    }
    setForm({
      client: '',
      items: [{ productId: '', quantity: 1, price: '' }],
      tax: 0,
      discount: 0,
      totalAmount: 0,
      status: 'Pending',
      dueDate: '',
      isRecurring: false,
      frequency: '',
      startDate: '',
      endDate: '',
      createdBy: user._id,
    });
    setSuccess("Invoice created successfully ✅")
    
  };


  const totalAmount = () => {
    if (form.items.length > 0) {

    }
  }


  useEffect(() => {
    const fetchProducts = async () => {
      const data = await (user.role == "admin" ? listProducts() : getProductsByUser(user._id, token))
      if (data.error) {
        console.log("error fetching products", data.error);
      } else {
        console.log(data)
        setProducts(data)
      }
    }

    const fetchClients = async () => {
      const data = await (user.role == "admin" ? listClients() : getClientsByUser(user._id, token))
      if (data.error) {
        console.log("error fetching products", data.error);
      } else {
        console.log(data)
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
  }, [form.items, form.tax, form.discount]);



  return (
    <div className="client-form-container">
      <div className="container">
        {/* Header */}
        <div className="client-create-header">
          <div onClick={() => setCreateInvoice(false)}>
            <Button icon="ArrowLeftIcon" backgroundColor="transparent" text="Back to Invoices" border="none" color="black" />
          </div>
          <div className="info">
            <h3>Create Invoice</h3>
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
                {Array.isArray(clients) && clients.map((client, i) => { return <option key={i} value={client._id}>{client.name}</option> })}
              </select>
            </div>


            <div className="field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
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


           {form.status !== "Paid" && <div className="field">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>}
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
                  {Array.isArray(products) && products.map((product) => (
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
                      blackHover={true}
                      icon="Trash2"

                    />
                  </div>
                )}
              </div>
            ))}
            <div onClick={addItem}>
              <Button text="Add Item" blackHover={true} />
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
          <div onClick={() => setCreateInvoice(false)}>
            <Button backgroundColor="white" text="Cancel" color="black" noIcon={true} />
          </div>
          <div onClick={handleSubmit}>
            <Button border="1px solid lightgray" icon="Save" blackHover={true} text="Save Invoice" />
          </div>
        </div>
          {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
};

export default CreateInvoiceForm;
