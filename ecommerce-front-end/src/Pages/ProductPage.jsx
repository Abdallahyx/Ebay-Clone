import Nav from "../Home/Navbar/Nav";
import Item from "../Components/Item";
import Footer from "../Components/Footer";
import { useParams } from "react-router-dom";
function ProductPage() {
  const { slug } = useParams();
  return (
    <div>
      <Nav />
      <Item slug={slug} />
      <Footer />
    </div>
  );
}
export default ProductPage;
