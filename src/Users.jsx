import React,{useState, useEffect, Fragment} from 'react'
import Button from './ui/Button'
import SearchBar from './ui/Search'
import Table from './ui/Table'
import TagCard from './ui/TagCard'
import {getAllOrganizations, getOrganizationsByStatus} from "./admin/api"
import CreateOrgForm from './ui/CreateOrgForm'
import UpdateOrgForm from './ui/UpdateOrgForm'
import { isAuthenticated } from './auth/api'
// import '../styles/clients.css'


const Users = ({directLink= "", activeSection="", setDirectLink}) => {

  const {user, token} = isAuthenticated();

  
  const [org, setOrg] = useState({});
  const [orgs, setOrgs] = useState([]);
  const [updateOrg, setUpdateOrg] = useState({});
  const [createUpdateOrg, setCreateUpdateOrg] = useState(false)
  const [length, setLength] = useState(0);
  const [orglength, setOrgLength] = useState(0);
  const [activeOrglength, setActiveOrgLength] = useState(0);
  const [suspendedOrglength, setSuspendedOrgLength] = useState(0);

  const [error, setError] = useState(false);
const [loading, setLoading] = useState(true); 
const [createOrg, setCreateOrg] = useState(false);
const tableHeadNames = ["Org Name", "Admin Email", "Status", "Plan", "Created", "Actions"];  
const [searchTerm, setSearchTerm] = useState('');
const [shouldReloadProducts, setShouldReloadProducts] = useState(false);

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  // console.log(e.target.value)
};


useEffect(() => {
  // listProducts()
  getAllOrganizations(token)
    .then(data=> {
    setOrgs(data);
    setOrgLength(data.length)
  })
   .catch(error => {
    console.log("error in getting organizations", error)
   });

   getOrganizationsByStatus("active", token)
    .then(data => {
      setActiveOrgLength(data);
    })
    .catch(error => {
      console.log("error in fetching active organization numbers:", error)
    })

    getOrganizationsByStatus("suspended", token)
    .then(data => {
      setSuspendedOrgLength(data);
    })
    .catch(error => {
      console.log("error in fetching active organization numbers:", error)
    })

}, [shouldReloadProducts]);

useEffect(() => {
  if (directLink === "products" && activeSection === "products") {
    setCreateProduct(true);
    setDirectLink("")
  }
}, [directLink, activeSection]);

useEffect(()=>{
  if(updateOrg && Object.keys(updateOrg).length > 0){
    setOrg(updateOrg);
   
  }
},[updateOrg])




const filteredOrgs = orgs.filter((org) =>
  org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  org.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  org.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
);



return (

    <Fragment>
    {!createOrg && !createUpdateOrg  && org && <div>
      <div className="dashboard-header">
                <div className="info">
                    <h2>Super Admin Dashboard </h2>
                    <p>Manage all organizations using your SaaS platform</p>
                </div>
                <div onClick={()=> setCreateOrg(true)} >
                <Button text="Add Organization" blackHover={true}/>
                </div>
    </div>
    <div className="cards">
        
    </div>
    <div className="tag-card-container">
        <TagCard icon="Globe" iconColor="blue" tagName="Total Orgs" numbers={orglength} />
        <TagCard icon="CheckCircle" iconColor="green" tagName="Active Orgs" numbers={activeOrglength} />
        <TagCard icon="AlertTriangle" iconColor="red" tagName="Suspended Orgs" numbers={suspendedOrglength} />
   

    </div>
    <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder=' Search organization by name or admin email...'/>
    <Table setOrgs={setOrgs} setShouldReloadProducts={setShouldReloadProducts} onSuccess={()=> setShouldReloadProducts(prev => !prev)} setUpdateOrg={setUpdateOrg} setCreateOrg={setCreateOrg} setCreateUpdateOrg={setCreateUpdateOrg} header='All Organizations' subHeader='Administer all businesses using the system.' orgs={filteredOrgs} tableHeadNames={tableHeadNames} />
    </div>}
     {createOrg && <CreateOrgForm onSuccess={()=> setShouldReloadProducts(prev => !prev)} setCreateOrg={setCreateOrg}/>} 
     { createUpdateOrg && org && <UpdateOrgForm onSuccess={()=> setShouldReloadProducts(prev => !prev)}  setCreateUpdateOrg={setCreateUpdateOrg} org={org} setOrg={setOrg}/>}
    </Fragment>
  )
}

export default Users
