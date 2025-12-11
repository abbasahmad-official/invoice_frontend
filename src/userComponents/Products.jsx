import React,{useState, useEffect, Fragment} from 'react'
import Button from '../ui/Button'
import SearchBar from '../ui/Search'
import Table from '../ui/Table'
import TagCard from '../ui/TagCard'
import {listProducts, getProduct, getProductsByUser, listClientInvoicesCount} from "../admin/api"
import CreateProductForm from '../ui/CreateProductForm'
import UpdateProductForm from '../ui/UpdateProductForm'
import { isAuthenticated } from '../auth/api'
import { useCurrency } from '../CurrencyContext'
// import '../styles/clients.css'


const Products = ({directLink= "", activeSection="", setDirectLink}) => {

  const {user, token} = isAuthenticated();
  const {currency} = useCurrency()

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState();
  const [updateProduct, setUpdateProduct] = useState({});
  const [length, setLength] = useState(0);
  const [error, setError] = useState(false);
const [loading, setLoading] = useState(true); 
const [createProduct, setCreateProduct] = useState(false);
const tableHeadNames = ["Product/Service", "Price", "Added", "Actions"];  
const [searchTerm, setSearchTerm] = useState('');
const [shouldReloadProducts, setShouldReloadProducts] = useState(false);

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  // console.log(e.target.value)
};


useEffect(() => {
  // listProducts()
getProductsByUser(user._id, token)
    .then((data) => { 
      setProducts(data); // update state
      setLength(data.length);
    })
    .catch((err) => {
      console.error("Failed to load products:", err);
    });
}, [shouldReloadProducts]);



useEffect(() => {
  if (directLink === "products" && activeSection === "products") {
    setCreateProduct(true);
    setDirectLink("")
  }
}, [directLink, activeSection]);

const avgPrice = products.reduce((acc, product) => acc + product.price, 0) / (products.length || 1);
  
useEffect(() => {
  const fetchProduct = async () => {
    if (updateProduct?._id) {
      try {
        const data = await getProduct(updateProduct._id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
  };

  fetchProduct();

}, [updateProduct]);


const filteredProducts = products.filter((product) =>{
  const priceCurrencyChange = (product.price * currency).toFixed(2)
return(
  product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  priceCurrencyChange?.toString().toLowerCase().includes(searchTerm.toLowerCase()) 
)
}

);



return (

    <Fragment>
    {!createProduct && !product && <div>
      <div className="dashboard-header">
                <div className="info">
                    <h2>Products & Services</h2>
                    <p>Manage your products and services catalog</p>
                </div>
                <div onClick={()=> setCreateProduct(true)} >
                <Button text="Add Product" blackHover={true}/>
                </div>
    </div>
    <div className="cards">
        
    </div>
    <div className="tag-card-container">
    <TagCard icon="Package" iconColor="blue" tagName="Total Products" numbers={length}/>
    {/* <TagCard icon="Tag" iconColor="green" tagName={"Categories"} numbers={0} /> */}
    <TagCard icon2={user?.currency.symbol} icon2Color={"purple"} icon="DollarSign" iconColor="purple" tagName={"Avg. Price"} numbers={(avgPrice * currency).toFixed(2)} />

    </div>
    <SearchBar value={searchTerm} onChange={handleSearchChange}/>
    <Table onSuccess={()=> setShouldReloadProducts(prev => !prev)} setUpdateProduct={setUpdateProduct} header='All Products' subHeader='Your products and services catalog' products={filteredProducts} tableHeadNames={tableHeadNames} />
    </div>}
     {createProduct && <CreateProductForm onSuccess={()=> setShouldReloadProducts(prev => !prev)} setCreateProduct={setCreateProduct}/>} 
     {product && <UpdateProductForm onSuccess={()=> setShouldReloadProducts(prev => !prev)}  product={product} setProduct={setProduct} setUpdateProduct={setUpdateProduct}/>}
    </Fragment>
  )
}

export default Products
