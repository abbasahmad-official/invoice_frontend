import React, { useState, useEffect, useContext, Children, createContext } from "react";
import { isAuthenticated } from "./auth/api";
import { convertCurrency } from "./admin/api";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const { user, token } = isAuthenticated();
  const [currency, setCurrency] = useState(null);
  const[currencyCode, setCurrencyCode] = useState(user?.currency.code)

  const currencyChange = async () => {
    const data = await convertCurrency("USD");
    setCurrency(data.rates[user?.currency.code]);
  };

  useEffect(() => {
    currencyChange();
  }, [currencyCode]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext)
