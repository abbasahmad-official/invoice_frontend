import React,{useState, useEffect} from 'react'
import {User, Package} from "lucide-react"
import Button from './Button'
import { updateProduct, createProduct } from '../admin/api'
import { isAuthenticated } from '../auth/api'


const CreateProductForm = ({onSuccess, setCreateProduct}) => {
  const { user, token } = isAuthenticated();

  // States for controlled values
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState("");
  const createdBy = user._id;

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
    const data = await createProduct(
      { name, description, price, createdBy },
      token
    );

    if (data.error) {
      console.log("error", data.error);
    } else {
      setSuccess("Product created successfully ✅");
      onSuccess()
      setName("");
      setDescription("");
      setPrice("");
      console.log(data)
    }
  };

  return (
    <div className="client-form-container">
        <div className="container">
      <div className="client-create-header">
        <div onClick={()=> setCreateProduct(false)}>

        <Button icon='ArrowLeftIcon' backgroundColor='transparent' text="Back to Clients" border='none' color='black'/>
        </div>
        <div className="info">
        <h3>Add New Client</h3>
        <p>Enter client information for invoicing</p>
        </div>  
      </div>

        <div className="basic-info">
            <div className="head">
                <p> <User size={15}/>Product Information</p>
                <p>Basic details about your product or service</p>
            </div>
            <div className="fields product-fields">
            <div className="field product-field">
            <label htmlFor="product" >Product/Service Name</label>
            <input type="text" id='product' style={{width:"100%"}} value={name}  onChange={handleChange("name")} />
            </div>
            <div className="field">
            <label htmlFor="description" >Description </label>
            <textarea name="description" id="description" style={{width:"100%"}}  value={description}onChange={handleChange("description")}></textarea>
            {/* <input type="text" id='description' /> */}
            </div>
            <div className="field">
            <label htmlFor="price" >Price</label>
            <input type="Number" id='price' value={price} onChange={handleChange("price")} />
            </div>
            </div>
        </div>

        
      

        <div className="btns-group">
            <div onClick={()=> setCreateProduct(false)}>
            <Button backgroundColor='white' text="cancel" color='black' noIcon={true} />
            </div>
            <div onClick={handleSubmit}>
            <Button  border='1px solid lightgray' blackHover={true} icon='Save' text={"Save Product"}/>
            </div>
        </div>
  {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
    </div>
    </div>
  )
}

export default CreateProductForm
