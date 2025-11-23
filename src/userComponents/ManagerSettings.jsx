import React, { Fragment, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../auth/api";
import "../styles/setting.css";
import { getCurrencies, saveCurrency } from "../admin/api";
import { API } from "../config";
import Select from "react-select";

const ManagerSettings = ({
  directLink = "",
  activeSection = "",
  setDirectLink,
  refreshLogo
}) => {
  const { user, token } = isAuthenticated();
  const [darkMode, setDarkMode] = useState(true);
  const [currrencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    const data = await getCurrencies();

    setCurrencies(data);
  };

  const handleSave = async () => {
    const updateCurrency = await saveCurrency(user?._id, selected?.value);
    if (updateCurrency.error) {
      console.log("currency error");
    } else {
      if (updateCurrency) {
        // Safely parse JWT from localStorage
        const storedJwt = localStorage.getItem("jwt");
        if (!storedJwt) {
          console.warn("No JWT found in localStorage");
          return;
        }

        const jwt = JSON.parse(storedJwt);

        // ✅ Update only if user object exists
        if (jwt.user) {
          jwt.user.currency = updateCurrency; // set the new currency
          localStorage.setItem("jwt", JSON.stringify(jwt));
          console.log("LocalStorage updated with new user currency!");
          alert("Settings saved successfully!");
          refreshLogo()
        } else {
          console.warn("JWT found but missing user data");
        }
      }
    }
  };

  const options = currrencies?.map((item) => ({
    value: item._id,
    label: item.code,
    name: item?.name,
  }));

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const usdOption = user.currency;
    setSelected({
      value: usdOption._id,
      label: usdOption.code,
      name: usdOption?.name,
    });
  }, []);
  

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <p className="settings-subtitle">
        Manage system appearance and preferences
      </p>

      {/* Preferences Section */}
      <div className="settings-card">
        <h3 className="settings-section-title">Preferences</h3>

        <div className="settings-row">
          <p className="settings-label">Currency</p>

          <div>
            <p>{selected?.name}</p>
            <Select
              value={selected}
              onChange={setSelected}
              placeholder="Select Currency"
              options={options}
            />
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ManagerSettings;
