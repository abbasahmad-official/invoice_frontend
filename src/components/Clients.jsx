import React, {useState, useEffect, Fragment} from 'react'
import Button from '../ui/Button'
import SearchBar from '../ui/Search'
import Table from '../ui/Table'
import {listClients, updateClient, getClient} from "../admin/api"
import CreateClientForm from '../ui/CreateClientForm'
import UpdateClientForm from "../ui/UpdateClientForm"
import { isAuthenticated } from '../auth/api'

// import '../styles/clients.css'

const Clients = ({directLink="", activeSection="", setDirectLink}) => {
const {user, token} = isAuthenticated();

  const [clients, setClients] = useState([]);
  const [client, setClient] =useState();
  const [createClient, setCreateClient] = useState(false)
  const [updateClient, setUpdateClient]= useState({clientId: "", clientinfo:"", updateStatus:false})
  const [error, setError] = useState(false);
const [loading, setLoading] = useState(true); 
const tableHeadNames = ["Client", "Contact", "Location", "Invoices", "Added", "Actions"];
const [shouldReloadClients, setShouldReloadClients] = useState(false);


const [searchTerm, setSearchTerm] = useState('');

const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
  console.log(e.target.value)
};
// 
useEffect(() => {
  listClients(user.organization)
    .then((data) => { 
      setClients(data); // update state
    })
    .catch((err) => {
      console.error("Failed to load clients:", err);
    });
}, [shouldReloadClients]);

useEffect(() => {
  if (directLink === "clients" && activeSection === "clients") {
    setCreateClient(true);
    setDirectLink("")
  }
}, [directLink, activeSection]);



useEffect(() => {
  const fetchClient = async () => {
    if (updateClient?.clientId) {
      try {
        const data = await getClient(updateClient.clientId);
        setClient(data);
      } catch (err) {
        console.error("Failed to fetch client:", err);
      }
    }
  };

  fetchClient();

}, [updateClient]);

const filteredClients = clients.filter((client) =>
  client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  client.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
);

  return (
    <Fragment>
   

    {!createClient && !client && <div>
      <Fragment>
      <div className="dashboard-header">
                <div className="info">
                    <h2>Clients</h2>
                    <p>Manage your client information and contacts</p>
                </div>
                <div onClick={()=> setCreateClient(true)}>
                <Button text="Add Client" blackHover={true} />
                </div>
    </div>
    <SearchBar value={searchTerm} onChange={handleSearchChange} />
    <Table onSuccess={() => setShouldReloadClients(prev => !prev)} setUpdateClient={setUpdateClient} header='All Clients' subHeader='Manage your client database' tableHeadNames={tableHeadNames} clients={filteredClients}/>
      </Fragment>
      
{/* router.get("/client/search", listSearch); */}
    </div>}
      {createClient && <CreateClientForm setCreateClient={setCreateClient} onSuccess={() => setShouldReloadClients(prev => !prev)} />}
      {client && <UpdateClientForm setUpdateClient={setUpdateClient} client={client} setClient={setClient}  onSuccess={() => setShouldReloadClients(prev => !prev)} />}
    
      </Fragment>
  )
}

export default Clients
