import React from "react";
import { useState } from "react";
import { useEffect } from "react";
function getCookie(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null; // Cookie not found
}
const cookiee = getCookie("cookie");
function SuccessPage({ token }) {
  const [displayedmsg, setDisplayedmsg] = useState(
    "Please wait while we process your payment..."
  );
  const [isRendered, setIsRendered] = useState(false);
  const redirectToSuccess = async () => {
    console.log("token successpage", token);
    console.log("cookiee", getCookie("cookie"));

    const currentUrl = window.location.href;

    // Extract id from the URL path

    // Extract search parameters
    const searchParams = new URLSearchParams(currentUrl.split("?")[1]);

    // Get individual search parameters
    const value = searchParams.get("value");
    const paymentId = searchParams.get("paymentId");
    const tokenn = searchParams.get("token");
    const payerId = searchParams.get("PayerID");

    // Now you can use these variables as needed, for example, log them
    console.log("Value:", value);
    console.log("Payment ID:", paymentId);
    console.log("Token:", tokenn);
    console.log("Payer ID:", payerId);
    const response = await fetch(
      `http://127.0.0.1:8000/payments/user/add-balance/complete/?value=${value}&paymentId=${paymentId}&token=${tokenn}&PayerID=${payerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${cookiee}`,
        },
      }
    );
    if (response.ok) {
      setIsRendered(true);
      if (isRendered) {
        setDisplayedmsg("Payment Successful");
      }
    } else {
      if (!isRendered) {
        setDisplayedmsg("Payment Successful");
      }
    }
    const data = await response.json();

    console.log(data);

    // Redirect or perform operations with extracted data
    // For example, redirect to another page with extracted id and parameters
    // window.location.href = `/another-page?id=${id}&paymentId=${paymentId}&token=${token}&PayerID=${payerId}`;
  };
  // Empty dependency array ensures useEffect runs only once after component mount
  useEffect(() => {
    redirectToSuccess();
  }, []);

  return (
    <div className="success-page">
      {" "}
      {/* Consistent naming convention */}
      <div className="success-container">
        {" "}
        {/* More descriptive class name */}
        <div className="success-message">
          {" "}
          {/* Clearer class name */}
          <h2>{displayedmsg}</h2>
          <h3>Thank you for shopping with us!</h3>
        </div>
      </div>
    </div>
  );
}
export default SuccessPage;
