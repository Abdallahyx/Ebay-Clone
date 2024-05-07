import "./Login.css";
import Logo from "../SVGs/Logo.svg";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const expires = ";expires=" + expirationDate.toUTCString();
  const domain = ".localhost"; // Set domain to a common base domain
  document.cookie = name + "=" + value + expires + ";path=/;domain=" + domain;
}
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    non_field_errors: ""
  })
  async function submitHandler(e) {
    e.preventDefault();
    setErrors({
      email: "",
      password: "",
      non_field_errors: ""
    });
    const form = e.target.form;
    const formData = new FormData(form);
    const formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    setFormData(formObject);
    console.log(formObject);
    const response = await fetch('http://127.0.0.1:8000/accounts/login/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject),
    })
    console.log(response);
    const data = await response.json();
    console.log(data)
     if(!response.ok)
    {
      for(const key in data)
      {
        if(data.hasOwnProperty(key))
        {
          await setErrors((prev) => {
            return {
              ...prev,
              [key]: data[key],
            };
          });
        
        }
      }
      
    }
    else
    {
      console.log(data.message);
      localStorage.setItem('token', data.token);
      setCookie("cookie", data.token, 365);
      
      navigate('/home')
    }


    
  }
  
  
    return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Log2o" />
      </div>
      <div className="border">
        <form  className="LoginContainer">
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
          {errors.non_field_errors && <p>{errors.non_field_errors}</p>}
          <div className="buttonss">
            <button onClick={submitHandler} type="submit">Login</button>
            <a href="/registerationtype">New customer? Create your account</a>
          </div>
        </form>
      </div>
    </div>
  );

  }
export default Login;
