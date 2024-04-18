import React, { useState } from "react";
import "./Register.css";
import Logo from "../SVGs/Logo.svg";

function RegisterSeller() {
  const [step, setStep] = useState(1); // State to manage the current step

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Define form components for each step
  const stepForms = [
      <form className="LoginContainer">
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" name="username" required />
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="Enter email" name="email" required />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
        />
        <label htmlFor="Confirmpassword">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          name="repassword"
          required
        />
        <label htmlFor="Firstname">First name</label>
        <input type="text" placeholder="Firstname" name="Firstname" required />
        <label htmlFor="Surname">Surname</label>
        <input type="text" placeholder="Surname" name="Surname" required />

        <div className="buttonss">
          <button onClick={nextStep}>Next</button>
        </div>
      </form>,
      <form className="LoginContainer">
        <label htmlFor="gender">Gender</label>
    
        <select name="gender" required>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label htmlFor="phone">Phone number</label>
        <input type="number" placeholder="Phone number" name="phone" required />
        <label htmlFor="storename">Store name</label>
        <input type="text" placeholder="Store name" name="storename" required />
        <label htmlFor="storeaddress">Store address</label>
        <input
          type="text"
          placeholder="Store address"
          name="storeaddress"
          required
        />
        <label htmlFor="storecity">Store city</label>
        <input type="text" placeholder="Store city" name="storecity" required />
        <label htmlFor="storecountry">Store country</label>
        <input
          type="text"
          placeholder="Store country"
          name="storecountry"
          required
        />
        <label htmlFor="storephonenumber">Store Phone number</label>
        <input
          type="text"
          placeholder="Store Phone number"
          name="storephonenumber"
          required
        />
        <div className="buttonss">
          <button className="prevstep" onClick={prevStep}>
            Previous
          </button>
          <button type="submit">Register</button>
        </div>
      </form>
  ];

  return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="border">
      {stepForms[step - 1]}
      </div>
    </div>
  );
}

export default RegisterSeller;
