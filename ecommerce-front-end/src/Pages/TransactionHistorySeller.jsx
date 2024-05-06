import Nav from "../Home/Navbar/Nav";
import "../Components/ProductHistory.css";
import { useEffect } from "react";
import { useState } from "react";
function TransactionHistorySeller()
{
   
    const [transactionhistory, setTransactionHistory] = useState([])
    const displayTransactionHistory = async () => {
      let currentPage = 1;
      let allResults = [];
      while(true)
        {
      const response = await fetch(`http://127.0.0.1:8000/transactions/store/?page=${currentPage}`,
        {
          method:"GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
        
      )

      if(!response.ok){
        break;
      }

      const data = await response.json();
      allResults = allResults.concat(data.results);
      currentPage++;
      
    }
      setTransactionHistory(allResults);
    }
    useEffect(() => {},[])

    const rendertransactionhistory=()=>{
      return transactionhistory.map((order)=>{
        return(
          <div className="productdetails report">
            <div className="detail">
            <img src={"Images/" +
                    order.order_item.product.photo.substring(order.order_item.product.photo.lastIndexOf("/") + 1)} alt="product" />
          </div>
          <p className="detail ">{order.order_item.product.title+" "+order.order_item.size}</p>
            <p className="detail ">{(new Date(order.timestamp)).toLocaleString()}</p>
            <p className="detail ">{order.quantity}</p>
            <p className="detail ">{"$"+order.order_item.total_price}</p>
            <p className="detail ">{order.status}</p>
          </div>
        )
      })
    }
    return (
        <div>
            <Nav />
            <div className="justifywrapper">
      <h1>Transaction History</h1>
      <div className="HistoryWrapper">
        <div className="producttitles">
            <h3>Product Image</h3>
            <h3>Product Name</h3>
          <h3>Time Stamp</h3>
          <h3>Quantity</h3>
          <h3>Amount Gained</h3>
          <h3>Status</h3>
        </div>

      </div>
    </div>
        </div>
    );
}
export default TransactionHistorySeller;