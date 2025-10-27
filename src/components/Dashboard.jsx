import React, { useState, useEffect } from 'react'
import Button from '../ui/Button'
import '../styles/dashboard.css'
import { ArrowRight } from "lucide-react"
import Card from '../ui/Card'
import {isAuthenticated} from "../auth/api" 
import { totalRevenue,  lastInvoices, pendingRevenue, totalClientsNumbers, overdueCount, allInvoicesCount, allUsersCount } from "../admin/api"
const Dashboard = ({ setActiveSection, setDirectLink }) => {
    const {user, token} = isAuthenticated()
    const [paidRevenue, setPaidRevenue] = useState([]);
    const [remainingRevenue, setRemainingRevenue] = useState([]);
    const [clients, setClients] = useState();
    const [invoices, setInvoices] = useState();
    const [managers, setManagers] = useState();
    const [overdue, setOverdue] = useState()
    const [lastThreeInvoices, setLastThreeInvoices] = useState([]);
    // const [totalClients, setTotalClients] = useState(3);
    // const [overdueInvoices, setOverdueInvoices] = useState(1);

    useEffect(() => {
        //     // Fetch and update the state with real data from an API or database
        totalRevenue(user.organization).then(data => setPaidRevenue(data)).catch(error => console.error(error));
        pendingRevenue(user.organization).then(data => setRemainingRevenue(data)).catch(error => console.error(error));
        totalClientsNumbers(user.organization).then(data => setClients(data.count)).catch(error => console.error(error));
        allInvoicesCount(user.organization).then(data => setInvoices(data.count)).catch(error => console.error(error));
        allUsersCount(user.organization).then(data => setManagers(data.count-1)).catch(error => console.error(error));
        overdueCount(user.organization).then(data => setOverdue(data)).catch(error => console.error(error));
        lastInvoices(user.organization).then(data => setLastThreeInvoices(data)).catch(error => console.error(error));

    }
        , []);

    const totalPrice = paidRevenue.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
    const pendingPrice = remainingRevenue.reduce((acc, invoice) => acc + invoice.totalAmount, 0);

    // console.log("Total Price:", totalPrice);
    // console.log("Pending Price:", pendingPrice);

    return (
        <div>
            <div className="dashboard-header">
                <div className="info">
                    <h2>Welcome back,</h2>
                    <p>Here's what's happening with your invoices today.</p>
                </div>
                 <div onClick={()=> {setActiveSection("invoices")
                    setDirectLink("invoices")
                }} >
                <Button text="Create Invoice" blackHover={true}/>
                </div>
            </div>
            <div className="card-container">
                <Card icon="DollarSign" iconColor="green" title="Total Revenue" number={totalPrice.toFixed(2)} subtitle={`From ${paidRevenue.length} invoices`} dollar={true} />
                <Card icon="Clock" iconColor="red" title="Pending Revenue" number={pendingPrice.toFixed(2)} subtitle={`From ${remainingRevenue.length} invoices`} dollar={true} />
                <Card icon="Users" iconColor="blue" title="Total Clients" number={clients} subtitle="Active clients" />
                <Card icon="TrendingUp" iconColor="red" title="Overdue Invoices" number={overdue} subtitle="Need attention" />
            </div>
            <div className="bottom-container">
                <div className="invoices">
                    <div className="recent-invoices-header">
                        <div className="info">
                            <p>Recent Invoices</p>
                            <p>Your latest invoice activity</p>
                        </div>
                        <button className='view-all' onClick={() => setActiveSection("invoices")}>View All <ArrowRight size={15} /></button>
                    </div>
                    <div className="recent-invoices-container" style={{gap:"10px"}}>
                        {lastThreeInvoices.map((invoice, index)=> <div  key={index} className="recent-invoice" >
                            <div className="top">
                                {/* <p>{invoice._id}</p> */}
                                <p>{invoice.client?  invoice.client.name: "No Name" }</p>
                            </div>
                            <div className="middle">

                                <p>${invoice.totalAmount}</p>
                                <p>{invoice.status}</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className="bottom-right">
                    <div className="quick-actions">
                        <div className="info">
                            <p>Quick Actions</p>
                            <p>Frequently used features</p>
                        </div>
                        <div className="actions">
                            <div onClick={() => {
                                setActiveSection("invoices")
                                setDirectLink("invoices")
                            }} >
                                <Button text="Create Invoice" backgroundColor='white' width='100%' color='black' border='1px solid black' />
                            </div>
                            <div onClick={() => {
                                setActiveSection("clients")
                                setDirectLink("clients")
                            }}>
                                <Button text="Add Client" backgroundColor='white' width='100%' color='black' border='1px solid black' />
                            </div>
                            <div onClick={() => {
                                setActiveSection("products")
                                setDirectLink("products")
                            }}>
                                <Button text="Add Product" backgroundColor='white' width='100%' color='black' border='1px solid black' />
                            </div>
                        </div>
                    </div>
                    <div className="admin-overview">
                        <div className="info">
                            <p>Admin Overview</p>
                            <p>System-wide statistics</p>
                        </div>
                        <div className="items-container">
                            <div className="overview-item">
                                <p>Total Managers</p>
                                <h3>{managers}</h3>
                            </div>
                            <div className="overview-item">
                                <p>All Invoices</p>
                                <h3>{invoices}</h3>
                            </div>
                            <div className="overview-item">
                                <p>All Clients</p>
                                <h3>{clients}</h3>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard
