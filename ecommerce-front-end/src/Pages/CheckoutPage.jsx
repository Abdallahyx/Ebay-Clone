import Nav from "../Home/Navbar/Nav";
import Footer from "../Components/Footer";
import Checkout from "../Components/Checkout";
function CheckoutPage(props) {

    console.log(props.checkoutprice+"checkout")
    return (
        <div>
            <Nav/>
            <Checkout price={props.checkoutprice} />
            <Footer/>
        </div>
    )
}
export default CheckoutPage;