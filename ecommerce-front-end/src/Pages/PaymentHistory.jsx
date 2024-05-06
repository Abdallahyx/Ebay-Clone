import Nav from "../Home/Navbar/Nav";
import "../Components/ProductHistory.css";
import { useEffect } from "react";
import { useState } from "react";
function PaymentHistory()
{

    const [PHistory,setPHistory] = useState([])
    const displayPaymentHistory = async () => {
      let currentPage = 1;
      let allResults = [];
      while (true){
      const response = await fetch(http://127.0.0.1:8000/payments/user/?page=${currentPage},
        {
          method:"GET",
          headers: {
            Authorization: Token ${localStorage.getItem("token")},
          },
        }

      )
      const data = await response.json();
      if(!response.ok){
        break;
      }
      allResults = allResults.concat(data.results);
      currentPage++;
    }
      setPHistory(allResults);
    }
    useEffect(() => {displayPaymentHistory()},[])

    const renderPaymentHistory=()=>{
      return PHistory.map((order)=>{
        return(
          <div className="productdetails report">
            <p className="detail ">{(new Date(order.payment_date)).toLocaleString()}</p>
            <p className="detail ">{order.payment_method}</p>
            <p className="detail ">{order.payment_amount}</p>
            <p className="detail ">{JSON.stringify(order.is_paid)}</p>
            <p className="detail ">{order.user_info.address+","+order.user_info.city+","+order.user_info.country}</p>
          </div>
        )
      })
    }
    return (
        <div>
            <Nav />
            <div className="justifywrapper">
      <h1>Payment History</h1>
      <div className="HistoryWrapper">
        <div className="producttitles">
        <h3>Date</h3>
          <h3>Payment Method</h3>
          <h3>Paid Amount</h3>
          <h3>Is Paid</h3>
          <h3>Shipping Address</h3>
        </div>

       {renderPaymentHistory()}
      </div>
    </div>
        </div>
    );
}
export default PaymentHistory;
