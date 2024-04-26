import "./SelectType.css";
import Logo from "../SVGs/Logo.svg";
import { useNavigate } from "react-router-dom";
function SelectType()
{
    const navigate= useNavigate();

    return (
        <div className="wrapperr">
          <div className="logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="borderr">
            <form className="LoginContainerr">
                <h1>Create Your Shoppable Business Account.</h1>
                <p>Do you want to become:</p>
             
              <div className="buttonss">
                <button
                onClick={() => {
                    navigate("/signupseller");
                }}
                 >Become a Seller</button>
                <button 
                onClick={() => {
                    navigate("/signup");
                }
                }>Become a Buyer</button>
              </div>
              
              <div className="Backtohome">
              <p>Already have an account? <a href="/login">Login Now</a></p>
                <a href="/home">Back to Home</a>
              </div>
            </form>
          </div>
        </div>
      );
}
export default SelectType;