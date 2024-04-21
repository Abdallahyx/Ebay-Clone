import Nav from "../Home/Navbar/Nav";
import CartProducts from "../Cart/CartProducts";
import Footer from "../Components/Footer";

function CartPage(props) {

    return (

        <div>
            <Nav/>
            <CartProducts passPrice={props.passPrice}/>
            <Footer/>
        </div>


    )
}

export default CartPage;