import {API} from "../config"


export const signup = (signupData) => {
      return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(signupData)
      })
        .then(response => {
          if (!response.ok) {
            return response.json();
          }
          return response.json();
        })
        .catch(error => {
          console.error('Error signing up', error);
          throw error; // rethrow so caller can handle
        });
    
}

export const signin = (signinData) => {
      return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(signinData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error('Error signiing in', error);
          throw error; // rethrow so caller can handle
        });
    
}

export const authenticate = (data, next) => {
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
  }

  export const signout = ( next) => {
  if (typeof window !== "undefined") {
    // Remove token from localStorage (client-side logout)
    localStorage.removeItem("jwt");

    // Call backend to handle server-side logout
    return fetch(`${API}/signout`, {
      method: "POST",
     

    })
      .then(response => {
        console.log("Signout response:", response);
        next(); // Now call the callback after server response
      })
      .catch(err => console.log("Signout error:", err));
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const jwt = localStorage.getItem("jwt");

  // Catch empty, undefined, or invalid string values
  if (!jwt || jwt === "undefined" || jwt === "null") {
    return false;
  }

  try {
    const parsedJwt = JSON.parse(jwt);

    // Optional: validate JWT structure
    if (!parsedJwt.token) {
      return false;
    }

    // Optional: check if expired (example assumes `expiresAt` is a timestamp in ms)
    if (parsedJwt.expiresAt && Date.now() > parsedJwt.expiresAt) {
      localStorage.removeItem("jwt"); // auto-clean expired token
      return false;
    }

    return parsedJwt;
  } catch (err) {
    console.error("Failed to parse JWT from localStorage", err);
    return false;
  }
};
