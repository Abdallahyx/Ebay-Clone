import "./Register.css";
import Logo from "../SVGs/Logo.svg";
function Register() {
  return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Log2o" />
      </div>
      <div className="border">
        <form className="LoginContainer">
          <label htmlFor="name">Your name</label>
          <input type="text" placeholder="First and last name" name="name" required />
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
          <input
            type="password"
            name="repassword"
            required
          />
          <div className="buttonss">
            <button type="submit">Register</button>
 
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
