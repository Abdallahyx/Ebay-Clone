import React from 'react';
import {useState} from 'react';
import { useEffect } from 'react';
function getCookie(name) {
  const cookies = document.cookie.split(";").map(cookie => cookie.trim());
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null; // Cookie not found
}
function SuccessPage({token}) {
  const [displayedmsg,setDisplayedmsg]= useState('Please wait while we process your payment...')
  const redirectToSuccess= async()=>{
    

    console.log("token successpage",token)
    console.log("cookie",getCookie("cookie"))
    const cookiee=getCookie("cookie")
    const currentUrl = window.location.href;
    
    // Extract id from the URL path
    const id = currentUrl.split("/")[4]; // Assuming the id is the 4th segment in the path

    // Extract search parameters
    const searchParams = new URLSearchParams(currentUrl.split("?")[1]);
    
    // Get individual search parameters
    const paymentId = searchParams.get("paymentId");
    const tokenn = searchParams.get("token");
    const payerId = searchParams.get("PayerID");
    
    // Now you can use these variables as needed, for example, log them
    console.log("ID:", id);
    console.log("Payment ID:", paymentId);
    console.log("Token:", tokenn);
    console.log("Payer ID:", payerId);
    const response= await fetch(`http://127.0.0.1:8000/orders/order/${id}/?paymentId=${paymentId}&token=${tokenn}&PayerID=${payerId}`,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${cookiee}`,
        },
    }
    )
    if(response.ok)
      {
        setDisplayedmsg("Payment Successful")
      }
      else
      {
        setDisplayedmsg("Payment Failed")
      }
    const data = await response.json();
    
    console.log(data);
    
    // Redirect or perform operations with extracted data
    // For example, redirect to another page with extracted id and parameters
    // window.location.href = `/another-page?id=${id}&paymentId=${paymentId}&token=${token}&PayerID=${payerId}`;
  }
  useEffect(() => {
    redirectToSuccess();
    // Extract the current URL
   
  }, []); // Empty dependency array ensures useEffect runs only once after component mount

  
  return (
    <div className="success-page"> {/* Consistent naming convention */}
      <div className="success-container"> {/* More descriptive class name */}
        <div className="success-message"> {/* Clearer class name */}
          <h2>{displayedmsg}</h2>
          <h3>Thank you for shopping with us!</h3>
        </div>
      </div>
    </div>
  );
}
export default SuccessPage;
