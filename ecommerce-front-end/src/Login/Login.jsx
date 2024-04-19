import "./Login.css";
import Logo from "../SVGs/Logo.svg";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();
  const submitHandler = function() {
    /*validate username password before navigation*/
    navigate("/home");
  };
  return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Log2o" />
      </div>
      <div className="border">
        <form onSubmit={submitHandler} className="LoginContainer">
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Enter email" name="email" required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <div className="buttonss">
            <button type="submit">Login</button>
            <a href="/registerationtype">New customer? Create your account</a>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
