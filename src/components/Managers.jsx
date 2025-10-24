import React,{useState, useEffect, Fragment} from 'react'
import Button from '../ui/Button'
import SearchBar from '../ui/Search'
import Table from '../ui/Table'
import TagCard from '../ui/TagCard'
import {getAllOrganizations, getOrganizationsByStatus, getManagers, getManagersByStatus} from "../admin/api"
import CreateOrgForm from '../ui/CreateOrgForm'
import UpdateOrgForm from '../ui/UpdateOrgForm'
import UpdateManagerForm from '../ui/UpdateManagerForm'
import { isAuthenticated } from '../auth/api'
import CreateManagerForm from '../ui/CreaterManagerForm'
import {PauseCircle, Ban, Slash, CheckCircle, Check, PlayCircle} from "lucide-react"
// import '../styles/clients.css'


const Managers = ({directLink= "", activeSection="", setDirectLink}) => {

  const {user, token} = isAuthenticated();

  
  const [org, setOrg] = useState({});
  const [manager, setManager] = useState({});
  const [managers, setManagers] = useState([]);
  const [managerLength, setManagerLength] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [updateManager, setUpdateManager] = useState({});
  const [updateOrg, setUpdateOrg] = useState({});
  const [createUpdateManager, setCreateUpdateManager] = useState(false)
  const [length, setLength] = useState(0);
  const [orglength, setOrgLength] = useState(0);
  const [activeManagerLength, setActiveManagerLength] = useState(0);
  const [suspendedManagerLength, setSuspendedManagerLength] = useState(0);

  const [error, setError] = useState(false);
const [loading, setLoading] = useState(true); 
const [createManager, setCreateManager] = useState(false);
const tableHeadNames = ["Manager Name", "Admin Email", "Status", "Plan", "Created", "Actions"];  
const [searchTerm, setSearchTerm] = useState('');
const [shouldReloadProducts, setShouldReloadProducts] = useState(false);

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  // console.log(e.target.value)
};

useEffect(() => {
  // listProducts()
    getManagers(user.organization ,token)
     .then(data=> {
    setManagers(data);
    setManagerLength(data.length)
  })
    .catch(error => {
    console.log("error in getting managers", error)
   });

      getManagersByStatus("active", user.organization, token)
    .then(data => {
      setActiveManagerLength(data);
    })
    .catch(error => {
      console.log("error in fetching active organization numbers:", error)
    })

        getManagersByStatus("suspended", user.organization, token)
    .then(data => {
      setSuspendedManagerLength(data);
      
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
  if(updateManager && Object.keys(updateManager).length > 0){
    setManager(updateManager);
   
  }
},[updateManager])




const filteredManagers = managers.filter((manager) =>
  manager.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  manager.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  manager.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
);



return (

    <Fragment>
    {!createManager && !createUpdateManager  && org && <div>
      <div className="dashboard-header">
                <div className="info">
                    <h2>Managers</h2>
                    <p>Manage all managers</p>
                </div>
                <div onClick={()=> setCreateManager(true)} >
                <Button text="Add Manager" blackHover={true}/>
                </div>
    </div>
    <div className="cards">
        
    </div>
    <div className="tag-card-container">
        <TagCard icon="Globe" iconColor="blue" tagName="Total Managers" numbers={managerLength} />
        <TagCard icon="CheckCircle" iconColor="green" tagName="Active Managers" numbers={activeManagerLength} />
        <TagCard icon="AlertTriangle" iconColor="red" tagName="Suspended Managers" numbers={suspendedManagerLength} />
   

    </div>
    <SearchBar value={searchTerm} onChange={handleSearchChange} placeholder=' Search organization by name or admin email...'/>
    <Table setShouldReloadProducts={setShouldReloadProducts} onSuccess={()=> setShouldReloadProducts(prev => !prev)} setUpdateManager={setUpdateManager} setCreateManager={setCreateManager} setCreateUpdateManager={setCreateUpdateManager} header='All Managers' subHeader='Administer all businesses using the system.' managers={filteredManagers} tableHeadNames={tableHeadNames} setManagers={setManagers} />
    </div>}
     {createManager && <CreateManagerForm onSuccess={()=> setShouldReloadProducts(prev => !prev)} setCreateManager={setCreateManager}/>} 
     { createUpdateManager && manager && <UpdateManagerForm onSuccess={()=> setShouldReloadProducts(prev => !prev)}  setCreateUpdateManager={setCreateUpdateManager}  setUpdateManager={setUpdateManager} updateManager={updateManager}/>}
    </Fragment>
  )
}

export default Managers
