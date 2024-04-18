import "./Register.css";
import Logo from "../SVGs/Logo.svg";

function Register() {
  return (
    <div className="wrapper">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="border">
        <form className="LoginContainer">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
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
          <label htmlFor="Confirmpassword">Confirm Password</label>
          <input type="Confirmpassword"
          placeholder="Confirmpassword"
           name="repassword" required />
          <label htmlFor="Firstname">First name</label>
          <input
            type="text"
            placeholder="Firstname"
            name="Firstname"
            required
          />
          <label htmlFor="Surname">Surname</label>
          <input
            type="text"
            placeholder="Surname"
            name="Surname"
            required
          />
          <label htmlfor="Gender">Gender</label>
          <select  name="gender"  required>
            <option value="">Select...</option>
            <option value="buyer">Male</option>
            <option value="seller">Female</option>
          </select>
          <label htmlFor="phone">Phone number</label>
          <input
            type="number"
            placeholder="Phone number"
            name="phone"
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
