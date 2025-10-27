import {API} from "../config.js";

// 
export const listInvoices = (orgId) => {
  return fetch(`${API}/invoices?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching invoices:', error);
      throw error; // rethrow so caller can handle
    });
};

export const lastInvoices = (orgId) => {
  return fetch(`${API}/invoices/last?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching last three invoices:', error);
      throw error; // rethrow so caller can handle
    });
};

export const lastInvoicesUser = (userId) => {
  return fetch(`${API}/invoices/last/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching last three invoices By User:', error);
      throw error; // rethrow so caller can handle
    });
};
// 
export const listClients = (orgId) => {
  return fetch(`${API}/clients?orgId=${orgId}&role=user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching invoices:', error);
      throw error; // rethrow so caller can handle
    });
};
export const listProducts = (orgId) => {
  return fetch(`${API}/products?orgId=${orgId}&role=user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching invoices:', error);
      throw error; // rethrow so caller can handle
    });
};

// dashboard stats
export const totalRevenue = (orgId) => {
  return fetch(`${API}/invoices/paid?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching total revenue:', error);
      throw error; // rethrow so caller can handle
    });
};

export const totalRevenueByUser = (userId) => {
    return fetch(`${API}/invoices/paid/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching total revenue:', error);
      throw error; // rethrow so caller can handle
    });
}

export const pendingRevenueByUser = (userId) => {
    return fetch(`${API}/invoices/pending/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching total revenue:', error);
      throw error; // rethrow so caller can handle
    });
}



export const pendingRevenue = (orgId) => {
  return fetch(`${API}/invoices/pending?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching total revenue:', error);
      throw error; // rethrow so caller can handle
    });
};

export const overdueCount = (orgId) => {
  return fetch(`${API}/invoices/overdue?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching overdue revenue:', error);
      throw error; // rethrow so caller can handle
    });
};
export const overdueUserCount = (userId) => {
  return fetch(`${API}/invoices/overdue/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching overdue revenue:', error);
      throw error; // rethrow so caller can handle
    });
};


export const totalClientsNumbers = (orgId) => {
  return fetch(`${API}/clients/count?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error fetching total clients:', error);
      throw error; // rethrow so caller can handle
    });
};

export const totalClientsNumbersByUser = (userId) => {
  return fetch(`${API}/clients/count/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error fetching total clients:', error);
      throw error; // rethrow so caller can handle
    });
};

export const allInvoicesCount = (orgId) => {
  return fetch(`${API}/invoices/count?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error fetching total clients:', error);
      throw error; // rethrow so caller can handle
    });
};

export const allInvoicesCountByUser = (userId) => {
  return fetch(`${API}/invoices/count/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error fetching total clients:', error);
      throw error; // rethrow so caller can handle
    });
};

export const allUsersCount = (orgId) => {
  return fetch(`${API}/users/count?orgId=${orgId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error fetching total clients:', error);
      throw error; // rethrow so caller can handle
    });
};


// clients
export const createClient = (clientData, token) => {
  return fetch(`${API}/client/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' ,
       Authorization: `Bearer ${token}` 
    },
    body:JSON.stringify(clientData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error adding client:', error);
      throw error; // rethrow so caller can handle
    });
};
export const stripePayment = (totalAmount) => {
  return fetch(`${API}/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' ,
    },
   body: JSON.stringify({ amount: totalAmount }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error adding client:', error);
      throw error; // rethrow so caller can handle
    });
};


export const removeClient = (clientId, token) => {
  return fetch(`${API}/client/remove/${clientId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
       
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};
export const updateClient = (clientId, updateClient, token) => {
  return fetch(`${API}/client/update/${clientId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`  
    },
    body:JSON.stringify(updateClient)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};
export const getClient = (clientId) => {
  return fetch(`${API}/client/view/${clientId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};

export const searchClient = (query) => {
  return fetch(`${API}/client/search?search=${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};




// products
export const createProduct = (productData, token) => {
  return fetch(`${API}/product/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' ,
       Authorization: `Bearer ${token}` 
    },
    body:JSON.stringify(productData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error adding product:', error);
      throw error; // rethrow so caller can handle
    });
};
export const getProduct = (productId) => {
  return fetch(`${API}/product/view/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
     
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};

export const removeProduct = (productId, token) => {
  return fetch(`${API}/product/remove/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing product:', error);
      throw error; // rethrow so caller can handle
    });
};

export const updateProduct = (productId, updateProduct, token) => {
  return fetch(`${API}/product/update/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'  ,
      Authorization: `Bearer ${token}`
    },
    body:JSON.stringify(updateProduct)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};


// invoice
export const removeInvoice = (invoiceId, token) => {
  return fetch(`${API}/invoice/remove/${invoiceId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}` 
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing product:', error);
      throw error; // rethrow so caller can handle
    });
};

export const updateInvoice = (invoiceId, updateInvoice, token) => {
  return fetch(`${API}/invoice/update/${invoiceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization:`Bearer ${token}`   
    },
    body:JSON.stringify(updateInvoice)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};
export const updateInvoiceForUserPay = (invoiceId, updateInvoice) => {
  return fetch(`${API}/invoice/update/status/${invoiceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
   
    },
    body:JSON.stringify(updateInvoice)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};

export const createInvoice = (invoiceData, token) => {
  return fetch(`${API}/invoice/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json(); // 👈 get real error message
        console.error('Server responded with error:', errorData);
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error creating invoice:', error);
      throw error; // rethrow so caller can handle
    });
};

export const createInvoiceSend = (invoiceData, token) => {
  return fetch(`${API}/invoice/create/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json(); // 👈 get real error message
        console.error('Server responded with error:', errorData);
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error creating invoice:', error);
      throw error; // rethrow so caller can handle
    });
};
export const sendEmail = (invoiceData, token) => {
  return fetch(`${API}/invoice/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json(); // 👈 get real error message
        console.error('Server responded with error:', errorData);
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error creating invoice:', error);
      throw error; // rethrow so caller can handle
    });
};

export const getInvoice = (invoiceId, token) => {
  return fetch(`${API}/invoice/view/${invoiceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
     
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};
export const getInvoiceForClient = (invoiceId) => {
  return fetch(`${API}/invoice/client/view/${invoiceId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing client:', error);
      throw error; // rethrow so caller can handle
    });
};

// users apis

// clients

// get clients by user
export const getClientsByUser = (userId, token) => {
  return fetch(`${API}/clients/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching clients:', error);
      throw error; // rethrow so caller can handle
    });
};


export const getProductsByUser = (userId, token) => {
  return fetch(`${API}/products/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      throw error; // rethrow so caller can handle
    });
};

export const getInvoicesByUser = (userId, token) => {
  return fetch(`${API}/invoices/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      throw error; // rethrow so caller can handle
    });
};

// organizations
export const createOrg = (orgData, token) => {
  return fetch(`${API}/org/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' ,
       Authorization: `Bearer ${token}` 
    },
    body:JSON.stringify(orgData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error adding organization:', error);
      throw error; // rethrow so caller can handle
    });
};

export const getAllOrganizations = (token) => {
  return fetch(`${API}/orgs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching organizations:', error);
      throw error; // rethrow so caller can handle
    });
};

export const getOrganizationsByStatus = (status, token) => {
  return fetch(`${API}/org/${status}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching organizations by status:', error);
      throw error; // rethrow so caller can handle
    });
};

export const removeOrg = (orgId, token) => {
  return fetch(`${API}/org/remove/${orgId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
       
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error removing organization:', error);
      throw error; // rethrow so caller can handle
    });
};

export const updateOrg = (orgId, orgData) => {
  return fetch(`${API}/org/update/${orgId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'    
    },
    body:JSON.stringify(orgData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error updating organization:', error);
      throw error; // rethrow so caller can handle
    });
};

// users

export const getManagers = (userId, token) => {
  return fetch(`${API}/managers?userId=${userId}&role=user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`   
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error getting user:', error);
      throw error; // rethrow so caller can handle
    });
};

export const updateUser = (updatedUser, userId, token) => {
  return fetch(`${API}/user/update?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`   
    },
    body: JSON.stringify(updatedUser)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }
    )
    .catch(error => {
      console.error('Error getting user:', error);
      throw error; // rethrow so caller can handle
    });
};

export const getManagersByStatus = (status, orgId, token) => {
  return fetch(`${API}/managers/status/${status}?orgId=${orgId}&role=user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching Managers by status:', error);
      throw error; // rethrow so caller can handle
    });
};