import "./Register.css";
import Logo from "../SVGs/Logo.svg";
import React, { useState } from "react";

function Register() {
  const [companyNameVisible, setCompanyNameVisible] = useState(false);

  const handleRoleChange = (event) => {
    if (event.target.value === "seller") {
      setCompanyNameVisible(true);
    } else {
      setCompanyNameVisible(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="border">
        <form className="LoginContainer">
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            placeholder="First and last name"
            name="name"
            required
          />
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Enter email" name="email" required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <label htmlFor="password">Re-enter Password</label>
          <input type="password" name="repassword" required />
          <label htmlFor="role">I am a</label>
          <select id="role" name="role" onChange={handleRoleChange} required>
            <option value="">Select...</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          {companyNameVisible && (
            <>
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                placeholder="Enter company name"
                name="companyName"
                required
              />
            </>
          )}
          <div className="buttonss">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
