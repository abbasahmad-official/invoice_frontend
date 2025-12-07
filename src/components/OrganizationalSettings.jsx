import React, { Fragment, useEffect, useRef, useState } from "react";
import { isAuthenticated } from "../auth/api";
import "../styles/setting.css";
import { Edit, Trash2, StopCircle, Flashlight } from "lucide-react";
import {
  uploadLogo,
  removeLogo,
  getLogo,
  getCurrencies,
  saveCurrency,
  getLogoPic,
  setTemplateName,
  getOrganization
} from "../admin/api";
import { API } from "../config";
import Select from "react-select";
import { useCurrency } from "../CurrencyContext";
import SpinningWheel from "../ui/SpinningWheel";
import Success from "../ui/Success";
import Button from "../ui/Button";
import Error from "../ui/Error";

const OrganizationalSettings = ({
  directLink = "",
  activeSection = "",
  setDirectLink,
  refreshLogo,
}) => {
  const { user, token } = isAuthenticated();
  const { setCurrencyCode } = useCurrency();
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState("PKR");
  const [logo, setLogo] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [currrencies, setCurrencies] = useState([]);
  const[isPremium, setIsPremium] = useState(false)

  const inputRef = useRef(null);
  const [companyName, setCompanyName] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [logoRemove, setLogoRemove] = useState(false);
  const [organization, setOrganization] = useState("")

  const [selectedTemplate, setSelectedTemplate] = useState("invoice-template.html");

  const invoiceTemplates = [

    {
      id: 1,
      name: "Classic",
      img: "/template-invoice.png",
      htmlName:"invoice-template.html"
    },
    {
      id: 2,
      name: "Bold Header",
      img: "/template-invoice2.png",
       htmlName:"invoice-template2.html"
    },
  ];

  useEffect(() => {
    fetchLogo();
    fetchLogoPic();
    fetchCurrencies();
    fetchOrganization()
  }, []);
  const fetchOrganization = async() =>{
     try {
      const data = await getOrganization(user.organization, token);
      // console.log(data);
      // console.log(data)
      if (!data.error) {
        console.log(API + data.path);
        setOrganization(data);
  setIsPremium(data?.plan !== "Free")
  setSelectedTemplate(data.templateName)
      }
    } catch (err) {
      console.error("Error fetching logo:", err);
    }
  }


  const fetchLogo = async () => {
    try {
      const data = await getLogo(user.organization, token);
      console.log(data);
      // console.log(data)
      if (data?.status === 404) {
        setCompanyName("SimplyBill");
      }
      if (!data.error) {
        console.log(API + data.path);
        setCompanyName(data?.companyName);
        // setTakeLogo(data)
        // setImagePreviewUrl(API + data.path); // API is your base URL
      }
    } catch (err) {
      console.error("Error fetching logo:", err);
    }
  };
  const fetchLogoPic = async () => {
    try {
      const blob = await getLogoPic(user.organization, token);
      const imageUrl = URL.createObjectURL(blob);
      // console.log(imageUrl)
      setImagePreviewUrl(imageUrl);
    } catch (error) {
      console.error("Failed to fetch logo pic:", error);
      setImagePreviewUrl(null);
    }
  };

  const fetchCurrencies = async () => {
    const data = await getCurrencies();
    setCurrencies(data);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setCompanyName(e.target.value);
  };

 const handleSave = async () => {
  setLoading(true);
  setSuccess(null);
  setError(null);
  console.log(selectedTemplate);

  try {
    // 1️⃣ Save currency first
    const updateCurrency = await saveCurrency(user?._id, selected?.value);
    if (!updateCurrency) {
      setError("No currency found");
      setLoading(false);
      return;
    }

    if (updateCurrency.error) {
      setError(updateCurrency.error);
      setLoading(false);
      return;
    }

    // Update JWT and context with new currency
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      const jwt = JSON.parse(storedJwt);
      if (jwt.user) {
        jwt.user.currency = updateCurrency;
        localStorage.setItem("jwt", JSON.stringify(jwt));
        setCurrencyCode(updateCurrency?.code);
        setSuccess("Currency saved");
        setTimeout(() => {
          setSuccess(null);
        }, 6000);
        console.log("LocalStorage updated with new user currency!");
      }
    }

    // 2️⃣ Now upload logo (if selected)
    if (isPremium) {
      if (logo || companyName) {
        const formData = new FormData();
        if (logo) formData.append("logo", logo);
        formData.append("organization", user.organization);
        formData.append("companyName", companyName);

        const data = await uploadLogo(formData, token);
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        refreshLogo();
      }
    }

    // 3️⃣ Template selection (merged function)
    try {
      const data = await setTemplateName(
        user.organization,
        selectedTemplate,
        token
      );

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      } else {
        setSuccess(data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
      return;
    }

    // Final success
    setSuccess("Settings saved successfully");
    successTimeout();
    setIsReadOnly(true);

  } catch (err) {
    console.error(err);
    setError("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

const successTimeout = ()=>{
  setTimeout(()=>{setSuccess("")},3000)
}

  const removeLogoButton = async () => {
    try {
      setLogoRemove(true);
      setError(null);
      setSuccess(null);

      const data = await removeLogo(user.organization, token);
      if (data.error && data.status === 404) {
        setSuccess(null);
        setImagePreviewUrl(null);
        setCompanyName("");
        setError(data.error);
        setLogoRemove(false);
      } else {
        setError(null);
        console.log(data.message);
        setImagePreviewUrl(null);
        setCompanyName("");
        refreshLogo();
        setSuccess(data.message);
        successTimeout();
        setLogoRemove(false);
      }
    } catch (error) {
      setLogoRemove(false);
      console.log(error);
    }
  };

  const changeName = () => {
    if (inputRef?.current?.readOnly == true) {
      inputRef.current.readOnly = false;
      setIsReadOnly((prev) => !prev);
    } else {
      inputRef.current.readOnly = true;
      setIsReadOnly((prev) => !prev);
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
      {success && <Success message={success} />}
      <h2 className="settings-title">Settings</h2>
      <p className="settings-subtitle">
        Manage system appearance and preferences
      </p>
 {/* Preferences Section */}
      <div className="settings-card currency-card">
        <h3 className="settings-section-title">Preferences</h3>

        <div className="settings-row">
          <p className="settings-label">Currency</p>

          <div className="selection" id="selection">
            <p>{selected?.name}</p>
            <div className="selection-component">
              <Select
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999, // ensures dropdown is above everything
                  }),
                  menu: (base) => ({
                    ...base,
                    maxHeight: "205px", // maximum height of dropdown
                    overflowY: "auto", // scroll if too many items
                  }),
                }}
                value={selected}
                onChange={setSelected}
                placeholder="Select Currency"
                options={options}
                menuPortalTarget={document.body}
              />
            </div>
          </div>
        </div>

        {/* <a href="https://restcountries.com/v3.1/all?fields=currencies
" download>currencies</a> */}
        {/* <button onClick={fetchCurrencies}>Get Currencies</button> */}
      </div>

      {/* Appearance Section */}
      <div className="settings-card" style={{ position: "relative", borderBottom:!isPremium?"2px solid gray":"" }}>
        {!isPremium && (
          <div className="premium-overlay">
            <div className="premium-badge">
              <Flashlight size={18} color="#ffbb00" />
              <span>
                Logo and company name customization is a Premium-only feature.
              </span>
            </div>
          </div>
        )}

        <h3 className="settings-section-title">Appearance</h3>

        {/* Logo Upload */}
        <div className="settings-row">
          <div>
            <p className="settings-label">Custom Logo</p>
            <p className="settings-description">
              Upload or change your dashboard logo
            </p>
          </div>

          {/* Custom Upload Box */}
          <div className={`upload-container  ${isReadOnly ? "read-only" : ""}`}>
            <input
              type="file"
              id="logo-upload"
              onChange={handleLogoChange}
              className="hidden-file-input"
              accept="image/*"
            />

            <label htmlFor="logo-upload" className="custom-upload-box">
              {imagePreviewUrl ? (
                <Fragment>
                  <img
                    src={imagePreviewUrl}
                    alt="Logo Preview"
                    className={`uploaded-logo`}
                  />
                </Fragment>
              ) : (
                <span className="upload-plus">+</span>
              )}
            </label>
            {/* <div style={{display: "flex", justifyContent: "flex-end", cursor: "pointer"}}>
                {imagePreviewUrl &&<Trash2 size={18} onClick={removeLogoButton}/>}
        </div> */}
          </div>
        </div>

        {/* Dark Mode */}
        <div className="settings-row">
          <div>
            <p className="settings-label">Company Name</p>
            <p className="settings-description">Enter your company name</p>
          </div>
          <div
            className="input-company"
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <input
              ref={inputRef}
              className={`${isReadOnly ? "read-only" : ""}`}
              readOnly={isReadOnly}
              value={companyName}
              onChange={handleChange}
              type="text"
              style={{ borderRadius: "10px", padding: "5px", outline: "none" }}
            />
            <div className="company-name">
              {isReadOnly && (
                <Button
                  onClick={() => setIsReadOnly(false)}
                  text={"Edit"}
                  icon="Edit"
                  blackHover={true}
                />
              )}
              <Button
                loading={logoRemove}
                onClick={removeLogoButton}
                icon="Trash2"
                text={"Remove"}
                blackHover={true}
              />
            </div>
          </div>
        </div>
      </div>

     
      {/* Invoice Template Section */}
      <div className="settings-card" style={{ position: "relative", borderBottom:!isPremium?"2px solid gray":""}}>
          {!isPremium && (
          <div className="premium-overlay">
            <div className="premium-badge">
              <Flashlight size={18} color="#ffbb00" />
              <span>
                Invoice template customization is a Premium-only feature.
              </span>
            </div>
          </div>
        )}
        <h3 className="settings-section-title">Invoice Template</h3>
        <p className="settings-description">
          Choose an invoice template layout for your  invoices.
        </p>

        <div className="template-grid">
          {invoiceTemplates.map((t) => (
            <div
              key={t.id}
              className={`template-box ${
                (selectedTemplate) === t.htmlName ? "template-selected" : ""
              }`}
              onClick={() => setSelectedTemplate(t.htmlName)}
            >
              <img className="template-img" src={t.img} alt={t.name} loading="lazy" />
              <div className="template-footer">
                <p>{t.name}</p>
                {(selectedTemplate) === t.htmlName && (
                  <span className="selected-badge">Selected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="save-btn select-padding" onClick={handleSave}>
        {loading ? <SpinningWheel size={25} /> : "Save Changes"}
      </button>
      {error && <Error message={error} />}
    </div>
  );
};

export default OrganizationalSettings;
