import React, { useState, useEffect } from 'react'
import { User } from "lucide-react"
import Button from './Button'
import { updateProduct } from "../admin/api"
import { isAuthenticated } from "../auth/api"

const UpdateProductForm = ({ onSuccess ,product, setProduct }) => {
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
    const data = await updateProduct(
      product._id,
      { name, description, price, createdBy },
      token
    );

    if (data.error) {
      console.log("error", data.error);
    } else {
      setSuccess("Product updated successfully ✅");
      onSuccess()

    }
  };

  // Prefill fields when editing
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
    }
  }, [product]);

  return (
    <div className="client-form-container">
      <div className="container">
        <div className="client-create-header">
          <div onClick={() => setProduct(false)}>
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
              <input
                type="number"
                id="price"
                value={price}
                onChange={handleChange("price")}
              />
            </div>
          </div>
        </div>

        <div className="btns-group">
          <div onClick={() => setProduct(false)}>
            <Button backgroundColor="white" text="Cancel" color="black" noIcon={true} />
          </div>
          <div onClick={handleSubmit}>
            <Button
              border="1px solid lightgray"
              blackHover={true}
              text="Save Product"
              icon='Save'
            />
          </div>
        </div>

        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
};

export default UpdateProductForm;
