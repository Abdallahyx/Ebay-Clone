import "./Register.css";
import Logo from "../SVGs/Logo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    surname: "",
    gender: "",
    phone_number: "",
    store_name: "",
    store_address: "",
    store_city: "",
    store_country:"",
    store_phone_number:"",
    non_field_errors: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    surname: "",
    gender: "",
    phone_number: "",
    store_name: "",
    store_address: "",
    store_city: "",
    store_country:"",
    store_phone_number:"",
    non_field_errors: "",
  });

  async function registerHandler(e) {
    e.preventDefault(); // Prevents the default form submission behavior
    setErrors({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      surname: "",
      gender: "",
      phone_number: "",
      store_name: "",
      store_address: "",
      store_city: "",
      store_country:"",
      store_phone_number:"",
      non_field_errors: "",
    });
    // Extracting form data
    const form = e.target.form;
    const formData = new FormData(form);
    const formObject = {};

    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }

    // Setting form data to state
    setFormData(formObject);
    const store_info = {
      store_name: `${formObject.address}`,
      store_address: `${formObject.city}`,
      store_city: `${formObject.store_city}`,
      store_country: `${formObject.country}`,
      store_phone_number: `${formObject.country}`,
    };
    const object = {
      username: `${formObject.username}`,
      email: `${formObject.email}`,
      password: `${formObject.password}`,
      confirm_password: `${formObject.confirm_password}`,
      first_name: `${formObject.first_name}`,
      surname: `${formObject.surname}`,
      gender: `${formObject.gender}`,
      phone_number: `${formObject.phone_number}`,
      store_info: store_info,
    };

    const response = await fetch(
      "http://127.0.0.1:8000/accounts/registration/store",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
      }
    );

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          setErrors((prev) => {
            return { ...prev, [key]: data[key].join() };
          });
        }
      }
    } else {
      setFormData({
        username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    surname: "",
    gender: "",
    phone_number: "",
    store_name: "",
    store_address: "",
    store_city: "",
    store_country:"",
    store_phone_number:"",
    non_field_errors: "",
      });
      navigate("/login");
      console.log("success");
    }
  }
  return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="border">
        <form className="LoginContainer">
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" name="username" required />
          {errors.username && <p>{errors.username}</p>}
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Enter email" name="email" required />
          {errors.email && <p>{errors.email}</p>}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          {errors.password && <p>{errors.password}</p>}
          <label htmlFor="Confirmpassword">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirmpassword"
            name="confirm_password"
            required
          />
          {errors.confirm_password && <p>{errors.confirm_password}</p>}
          {errors.non_field_errors && <p>{errors.non_field_errors}</p>}
          <label htmlFor="Firstname">First name</label>
          <input
            type="text"
            placeholder="Firstname"
            name="first_name"
            required
          />
          {errors.first_name && <p>{errors.first_name}</p>}
          <label htmlFor="Surname">Surname</label>
          <input type="text" placeholder="Surname" name="surname" required />
          {errors.surname && <p>{errors.surname}</p>}
          <label htmlFor="gender">Gender</label>
          <select name="gender" required>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p>{errors.gender}</p>}

          <label htmlFor="phone">Phone number</label>
          <input
            type="number"
            placeholder="Phone number"
            name="phone_number"
            required
          />
          {errors.phone_number && <p>{errors.phone_number}</p>}
          <label htmlFor="address">Store Name</label>
          <input type="text" placeholder="address" name="store_name" required />
          <label htmlFor="city">store_address</label>
          <input type="text" placeholder="city" name="store_address" required />
          <label htmlFor="country">Store City</label>
          <input type="text" placeholder="country" name="store_city" required />
          <label htmlFor="country">Store Country</label>
          <input type="text" placeholder="country" name="store_country" required />
          <label htmlFor="country">Store Number</label>
          <input type="text" placeholder="country" name="store_phone_number" required />
          

          <div className="buttonss">
            <button onClick={registerHandler} type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
