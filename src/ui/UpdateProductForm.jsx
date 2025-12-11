import React, { useState, useEffect, useRef } from 'react'
import { User } from "lucide-react"
import Button from './Button'
import { updateProduct } from "../admin/api"
import { isAuthenticated } from "../auth/api"
import { useCurrency } from '../CurrencyContext'

const UpdateProductForm = ({ onSuccess ,product, setProduct, setUpdateProduct }) => {
  const { user, token } = isAuthenticated();
  const {currency} = useCurrency()

  // States for controlled values
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)
    const errorRef = useRef(null)
   const successRef  = useRef(null)
  const createdBy = user._id;


  const showError = () => {
  if (!error) return ""

return <div ref={errorRef} className='tasks' style={{background: "#FF7081", padding:"10px", marginBottom:"9px",borderRadius:"10px"}}>
   <p style={{margin: "0 auto"}}>{error}</p>
</div>
}


  // Controlled input handler
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (field === "name") {
      setName(value);
    } else if (field === "description") {
      setDescription(value);
    } else if (field === "price") {
      setPrice(value);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    setSuccess(null)
    setError(null)
    setLoading(true)
    // console.log((price/currency).toFixed(2))
    let priceAfterCurrencyChange = (price/currency).toFixed(2)
    
    const data = await updateProduct(
      product._id,
      { name, description, price:priceAfterCurrencyChange, createdBy },
      token
    );
    if(!data){
      setLoading(false)
      console.log("nothing returned")
    }

    if (data.error) {
      setLoading(false)
      setSuccess(null)
      setError(data.error)
      setTimeout(()=>{
        if(errorRef.current){
          errorRef.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      },100)
      // console.log("error", data.error);
    } else {
      setLoading(false)
      setError(null)
      setSuccess("Product updated successfully ✅");
       if(successRef.current){
          successRef.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      onSuccess()

    }
  };

  // Prefill fields when editing
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice((product.price * currency).toFixed(2) || "");
    }
  }, [product]);

  return (
    <div className="client-form-container">
      <div className="container">
        <div className="client-create-header">
          <div onClick={() => {
            setProduct(null)
            setUpdateProduct(null)
            }}>
            <Button
              icon="ArrowLeftIcon"
              backgroundColor="transparent"
              text="Back to Products"
              border="none"
              color="black"
            />
          </div>
          <div className="info">
            <h3>Update Product</h3>
            <p>Enter product information for invoicing</p>
          </div>
        </div>

        <div className="basic-info">
          <div className="head">
            <p><User size={15} /> Product Information</p>
            <p>Basic details about your product or service</p>
          </div>
          <div className="fields product-fields">
            <div className="field product-field">
              <label htmlFor="product">Product/Service Name</label>
              <input
                type="text"
                id="product"
                style={{ width: "100%" }}
                value={name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                style={{ width: "100%" }}
                value={description}
                onChange={handleChange("description")}
              />
            </div>
            <div className="field">
              <label htmlFor="price">Price</label>
              <div style={{display: "flex",backgroundColor:"#F3F3F5",  border:"1px solid lightgray", borderRadius:"6px"}}>
              <p style={{padding:"2px",}}>{user?.currency.symbol}</p>
              <input
              className='border-left'
                type="number"
                id="price"
                value={price}
                onChange={handleChange("price")}
                />
                </div>
            </div>
          </div>
        </div>

        <div className="btns-group">
        <div
  onClick={() => {
    setProduct(null);        // closes the update modal
    setUpdateProduct(null);  // clear the selected product id
  }}
>
  <Button backgroundColor="white" text="Cancel" color="black" noIcon={true} />
</div>

          <div onClick={handleSubmit}>
            <Button
            loading={loading}
              border="1px solid lightgray"
              blackHover={true}
              text="Save Product"
              icon='Save'
            />
          </div>
        </div>

        {success && <p ref={successRef} style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
};

export default UpdateProductForm;
