import Nav from "../Home/Navbar/Nav";
import CartProducts from "../Cart/CartProduct";
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