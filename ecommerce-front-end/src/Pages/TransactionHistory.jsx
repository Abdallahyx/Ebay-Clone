import Nav from "../Home/Navbar/Nav";
import "../Components/ProductHistory.css";
import { useEffect } from "react";
import { useState } from "react";
function TransactionHistory() {
  const [transactionhistory, setTransactionHistory] = useState([]);
  const displayTransactionHistory = async () => {
    let currentPage = 1;
    let allResults = [];
    while (true) {
      const response = await fetch(
        `http://127.0.0.1:8000/transactions/customer/?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        break;
      }
      allResults = allResults.concat(data.results);
      currentPage++;
    }
    setTransactionHistory(allResults);
  };
  useEffect(() => {
    displayTransactionHistory();
  }, []);

  const rendertransactionhistory = () => {
    return transactionhistory.map((order) => {
      return (
        <div className="productdetails report">
          <p className="detail ">
            {new Date(order.timestamp).toLocaleString()}
          </p>
          <p className="detail ">{order.description}</p>
          <p className="detail ">{order.amount}</p>
          <p className="detail ">{order.status}</p>
        </div>
      );
    });
  };
  return (
    <div>
      <Nav />
      <div className="justifywrapper">
        <h1>Transaction History</h1>
        <div className="HistoryWrapper">
          <div className="producttitles">
            <h3>Time Stamp</h3>
            <h3>Paid by</h3>
            <h3>Amount</h3>
            <h3>Status</h3>
          </div>

          {rendertransactionhistory()}
        </div>
      </div>
    </div>
  );
}
export default TransactionHistory;
