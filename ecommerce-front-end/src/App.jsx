maria
mariaashraf_
Invisible

Abdallah — 04/29/2024 9:17 PM
const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/logout/", {
        method: "GET",
        headers: {
          Authorization: Token ${localStorage.getItem('token')},
        },
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
};
Abdallah — 04/29/2024 9:31 PM
document.cookie = "token=your_token_here; max-age=3600; secure; samesite=lax; path=/";
fetch('http://127.0.0.1:8000/accounts/logout/', {
    method: 'GET',
    headers: {
        'Authorization': 'Token your_token_here'
    },
    credentials: 'include'
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});
Abdallah — 04/29/2024 10:07 PM
Image
Ahmed Wael — 04/30/2024 12:12 AM
```js
function generateBoard() {
    const board = new Array(4).fill().map(()=>new Array(3).fill("0"))
    for(let i = 0; i < 3; i++) {
        board[0][i] = "B"
        board[3][i] = "W"
Expand
message.txt
3 KB
Ahmed Wael — 04/30/2024 12:32 AM
function generateBoard() {
  const board = new Array(4).fill().map(() => new Array(3).fill('0'));
  for (let i = 0; i < 3; i++) {
    board[0][i] = 'B';
    board[3][i] = 'W';
  }
Expand
message.txt
3 KB
magdy — 04/30/2024 12:42 AM
function generateBoard() {
  const board = new Array(4).fill().map(() => new Array(3).fill('0'));

  for (let i = 0; i < 3; i++) {
    board[0][i] = 'B';
    board[3][i] = 'W';
Expand
message.txt
3 KB
function generateBoard() {
  const board = new Array(4).fill().map(() => new Array(3).fill('0'));

  for (let i = 0; i < 3; i++) {
    board[0][i] = 'B';
    board[3][i] = 'W';
Expand
message.txt
3 KB
magdy — 04/30/2024 3:11 AM
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>

using namespace std;
Expand
message.txt
4 KB
marline — 04/30/2024 3:46 AM
Image
Abdallah — 04/30/2024 9:41 PM
const formData = new FormData();

// Append the image file to the form data
// 'image' is the name of the field that the backend expects
// imageFile is a File object representing the image
formData.append('image', imageFile);

fetch('http://127.0.0.1:8000/api/products/', {
    method: 'POST',
    body: formData,
    headers: {
        'Authorization': 'Token your-token-here'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});
Ahmed Wael — 04/30/2024 9:58 PM
import { useState } from "react";
import "../Components/Inventory.css";
function Inventory() {
  const [remainingQuantity, setRemainingQuantity] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
Expand
message.txt
10 KB
Ahmed Wael — 04/30/2024 10:06 PM
5las 3amaltaha @Abdallah
Abdallah — 04/30/2024 10:08 PM
import { useState } from "react";
import "../Components/Inventory.css";

function Inventory() {
  const [remainingQuantity, setRemainingQuantity] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
Expand
message.txt
5 KB
Ahmed Wael — 05/01/2024 12:29 AM
@Abdallah mesh 3aref adelete product men el mawke3 😂  t3ala 2oly a3melha ezay
Abdallah — 05/01/2024 1:11 AM
https://codenames.game/room/file-superhero-shark
Join me for a game of Codenames
You are invited to join a Codenames game.
Image
Abdallah — 05/01/2024 8:36 PM
json 
{
    "title": "hoodie65",
    "category": 1,
    "slug": "hoodie65",
    "price": 100,
    "price_with_discount": 90,
    "description": "Product Description",
    "photo": null,
    "discount": 10,
    "product_images": [],
    "variations": [
        {
            "size": "M",
            "quantity_in_stock": 142
        },
        {
            "size": "S",
            "quantity_in_stock": 9000
        }
    ]
}
\
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
    const [title, setTitle] = useState('');
Expand
message.txt
3 KB
Abdallah — 05/01/2024 8:57 PM
```
import React, { useState } from 'react';

const ProductForm = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
Expand
message.txt
3 KB
Ahmed Wael — 05/01/2024 9:03 PM
415 (Unsupported Media Type)
Ahmed Wael — 05/01/2024 9:13 PM
ERROR
Failed to fetch
TypeError: Failed to fetch
    at handleAddProduct (http://localhost:3000/main.66a129acf41ccc5f5382.hot-update.js:97:28)
    at handleSubmit (http://localhost:3000/main.66a129acf41ccc5f5382.hot-update.js:358:5)
    at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:17516:18)
    at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:17560:20)
    at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:17617:35)
    at invokeGuardedCallbackAndCatchFirstError (http://localhost:3000/static/js/bundle.js:17631:29)
    at executeDispatch (http://localhost:3000/static/js/bundle.js:21774:7)
    at processDispatchQueueItemsInOrder (http://localhost:3000/static/js/bundle.js:21800:11)
    at processDispatchQueue (http://localhost:3000/static/js/bundle.js:21811:9)
    at dispatchEventsForPlugins (http://localhost:3000/static/js/bundle.js:21820:7)
Abdallah — 05/01/2024 11:14 PM
const formData = new FormData();

formData.append('title', 'hoodie65');
formData.append('category', '1');
formData.append('slug', 'hoodie65');
formData.append('price', '100');
formData.append('price_with_discount', '90');
formData.append('description', 'Product Description');
formData.append('discount', '10');

const variations = [
    {
        size: 'M',
        quantity_in_stock: 142
    },
    {
        size: 'S',
        quantity_in_stock: 9000
    }
];

// Append each variation as a separate form data entry
variations.forEach((variation, index) => {
    for (const key in variation) {
        formData.append(`variations[${index}][${key}]`, variation[key]);
    }
});

// Assuming `input` is a file input element and `files` are the selected files
const input = document.querySelector('input[type="file"]');
const files = input.files;

for (let i = 0; i < files.length; i++) {
    formData.append(`product_images[${i}]`, files[i]);
}

fetch('http://your-api-url/products', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
Abdallah — 05/02/2024 12:42 AM
    def to_internal_value(self, data):
        # If the input is a QueryDict (as it will be for multipart form data),
        # convert it into a standard dictionary
        if isinstance(data, QueryDict):
            data = data.dict()

        # If variations is a string (as it will be for multipart form data),
        # parse it into a list
        if isinstance(data.get("variations"), str):
            data["variations"] = json.loads(data["variations"])

        return super().to_internal_value(data)
variations.forEach((variation, index) => {
    for (const key in variation) {
        formData.append(`variations[${index}][${key}]`, variation[key]);
    }
});
marline — 05/02/2024 12:47 AM
Attachment file type: acrobat
1900263_lab_4.pdf
94.08 KB
Ahmed Wael — 05/02/2024 12:53 AM
'Expected a list of items but got type "dict"
Abdallah — 05/02/2024 12:57 AM
const variations = [
    {
        size: 'M',
        quantity_in_stock: 142
    },
    {
        size: 'S',
        quantity_in_stock: 9000
    }
];

// Convert variations to JSON and append as a string
formData.append('variations', JSON.stringify(variations));
Abdallah — 05/02/2024 1:08 AM
const formData = new FormData();

// Append product details
formData.append('title', 'hoodie65');
formData.append('category', '1');
formData.append('slug', 'hoodie65');
formData.append('price', '100');
formData.append('description', 'Product Description');
formData.append('discount', '10');

const variations = [
    {
        size: 'M',
        quantity_in_stock: 142
    },
    {
        size: 'S',
        quantity_in_stock: 9000
    }
];

// Convert variations to JSON and append as a string
formData.append('variations', JSON.stringify(variations));

// Assuming input is a file input element and files are the selected files
const input = document.querySelector('input[type="file"]');
const files = input.files;

for (let i = 0; i < files.length; i++) {
    formData.append(product_images[${i}], files[i]);
}

fetch('http://your-api-url/products', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));const formData = new FormData();

// Append product details
formData.append('title', 'hoodie65');
formData.append('category', '1');
formData.append('slug', 'hoodie65');
formData.append('price', '100');
formData.append('description', 'Product Description');
formData.append('discount', '10');

const variations = [
    {
        size: 'M',
        quantity_in_stock: 142
    },
    {
        size: 'S',
        quantity_in_stock: 9000
    }
];

// Convert variations to JSON and append as a string
formData.append('variations', JSON.stringify(variations));


fetch('http://127.0.0.1:8000/store/create/', {
    method: 'POST',
headers: {
        "Content-Type": "application/json",
        Authorization: Token b7849493c508f47e344bcae6a54ea1d64f1cc6b4,
      },
    body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
// Convert each variation to JSON and append as a string
variations.forEach((variation, index) => {
    formData.append(`variations[${index}]`, JSON.stringify(variation));
});
Abdallah — 05/02/2024 1:16 AM
postForm.customList.forEach(item => {
 formData.append('custom_list', item);
});
Abdallah — 05/02/2024 1:33 AM
if isinstance(data.get("variations"), list):
        data["variations"] = [json.loads(variation) for variation in data["variations"]]
if isinstance(data, QueryDict):
        data = data.dict()
        # If variations is a list of strings (as it will be if each object was stringified),
        # parse each string into a dictionary
        if "variations" in data:
            data["variations"] = [json.loads(variation) for variation in data.getlist("variations")]
Ahmed Wael — 05/02/2024 1:38 AM
data["variations"] = [json.loads(variation) for variation in data.getlist("variations")]
AttributeError: 'dict' object has no attribute 'getlist'
Abdallah — 05/02/2024 1:39 AM
if "variations" in data:
            data = {**data.dict(), "variations": [json.loads(variation) for variation in data.getlist("variations")]}
        else:
            data = data.dict()
Ahmed Wael — 05/02/2024 1:39 AM
if "variations" in data:
            data = {**data.dict(), "variations": [json.loads(variation) for variation in data.getlist("variations")]}
        else:
            data = data.dict()
Abdallah — 05/02/2024 1:42 AM
if isinstance(data, QueryDict):
            if "variations" in data:
            data = {**data.dict(), "variations": [json.loads(variation) for variation in data.getlist("variations")]}
def to_internal_value(self, data):
    # If the input is a QueryDict (as it will be for multipart form data),
    # handle it directly without converting to a standard dictionary
    if isinstance(data, QueryDict):
        # If variations is a list of strings (as it will be if each object was stringified),
        # parse each string into a dictionary
        if "variations" in data:
            data = {**data.dict(), "variations": [json.loads(variation) for variation in data.getlist("variations")]}
        else:
            data = data.dict()

    return super().to_internal_value(data)
Abdallah — 05/02/2024 6:28 PM
sb-7mbsh30598583@personal.example.com
]kO/$t5)
Ahmed Wael — 05/03/2024 6:35 PM
edit discount
MickieMonic05 — 05/03/2024 7:44 PM
https://github.com/PhilopateerMoheb1/Distributed-Computer-System
GitHub
GitHub - PhilopateerMoheb1/Distributed-Computer-System
Contribute to PhilopateerMoheb1/Distributed-Computer-System development by creating an account on GitHub.
GitHub - PhilopateerMoheb1/Distributed-Computer-System
Ahmed Wael — 05/03/2024 11:28 PM
GET /orders/order/30/?token=b925f6081c25d18c93d521569887a874f952a3ef&paymentId=PAYID-MY2UQTQ9LW04184V1544750L&token=EC-1S913043VY133531K&PayerID=6382V9BW53TDE
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "error": "Invalid token."
}
Abdallah — 05/03/2024 11:33 PM
class OrderPaypalPaymentComplete(OrderMixin, APIView):
    permission_classes = [IsAuthenticated, IsCustomer]
    authentication_classes = [SessionAuthentication, CustomTokenAuthentication]

    def get(self, *args, **kwargs):
        token_key = self.request.query_params.get("token")
        if token_key:
            # Add the token to the request headers
            self.request.META['HTTP_AUTHORIZATION'] = f'Token {token_key}'

        # Now the authenticate method in your CustomTokenAuthentication class should be able to find the token in the request headers
        try:
            user_auth_tuple = self.request.user.auth.authenticate(self.request)
            if user_auth_tuple is not None:
                self.request.user, self.request.auth = user_auth_tuple
        except AuthenticationFailed:
            return Response({"error": "Invalid token."})
class OrderPaypalPaymentComplete(OrderMixin, APIView):
    permission_classes = [IsCustomer]
    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]  # Only authenticated users with `IsCustomer` permission
    authentication_classes = [
        SessionAuthentication,
        CustomTokenAuthentication,
    ]  # Auth classes

    def initial(self, request, *args, **kwargs):
        token_key = request.query_params.get("token")
        if token_key:
            # Add the token to the request headers
            request.META["HTTP_AUTHORIZATION"] = f"Token {token_key}"
        super().initial(request, *args, **kwargs)

    def get(self, *args, **kwargs):
        mixin = OrderMixin()
        order_id = kwargs["order_id"]
        payment_id = self.request.query_params.get("paymentId")
        payer_id = self.request.query_params.get("PayerID")
        if paypal_complete_payment(payment_id, payer_id):
            try:
                order = Order.objects.get(id=order_id)
            except (Exception,):
                return Response({"error": "Order error."})
            order.payment_info.is_paid = True
            order.payment_info.save()

            coupons = []  # Initialize coupons as an empty list
            for item in order.items.all():
                item_coupons = find_coupons(item)
                if item_coupons.coupons:
                    coupons = item_coupons.coupons
            for (
                coupon
            ) in coupons:  # This will not raise an error if coupons is an empty list
                if get_coupon(coupon):
                    UserCoupons.objects.create(coupon=coupon, user=self.request.user)
            order.payment_info.total_amount = order.total_amount
            order.payment_info.save()

        return Response({"success": "You successfully paid for order!"})
`
Abdallah — 05/03/2024 11:40 PM
class OrderPaypalPaymentComplete(OrderMixin, APIView):
    permission_classes = [IsCustomer]
    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]  # Only authenticated users with `IsCustomer` permission
    authentication_classes = [
        SessionAuthentication,
        CustomTokenAuthentication,
    ]  # Auth classes

    def get(self, *args, **kwargs):
        mixin = OrderMixin()
        order_id = kwargs["order_id"]
        payment_id = self.request.query_params.get("paymentId")
        payer_id = self.request.query_params.get("PayerID")
        if paypal_complete_payment(payment_id, payer_id):
            try:
                order = Order.objects.get(id=order_id)
            except (Exception,):
                return Response({"error": "Order error."})
            order.payment_info.is_paid = True
            order.payment_info.save()

            coupons = []  # Initialize coupons as an empty list
            for item in order.items.all():
                item_coupons = find_coupons(item)
                if item_coupons.coupons:
                    coupons = item_coupons.coupons
            for (
                coupon
            ) in coupons:  # This will not raise an error if coupons is an empty list
                if get_coupon(coupon):
                    UserCoupons.objects.create(coupon=coupon, user=self.request.user)
            order.payment_info.total_amount = order.total_amount
            order.payment_info.save()

        return Response({"success": "You successfully paid for order!"})
class CustomTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # Try to get the token from the 'Authorization' header
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b"token":
            # If the token is not in the header, try to get it from the cookie
            token = request.COOKIES.get("token")
            if not token:
                # If the token is not in the cookie, try to get it from the URL parameters
                token = request.query_params.get("token")
                if not token:
                    return None
            try:
                token_obj = (
                    self.get_model().objects.select_related("user").get(key=token)
                )
                return token_obj.user, token
            except self.get_model().DoesNotExist:
                raise AuthenticationFailed(_("Invalid token."))

        if len(auth) == 1:
            msg = _("Invalid token header. No credentials provided.")
            raise AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _("Invalid token header. Token string should not contain spaces.")
            raise AuthenticationFailed(msg)

        return self.authenticate_credentials(auth[1].decode("utf-8"))
Abdallah — 05/03/2024 11:47 PM
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import get_authorization_header
from django.utils.translation import gettext as _


class CustomTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # Try to get the token from the 'Authorization' header
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b"token":
            # If the token is not in the header, try to get it from the cookie
            token = request.COOKIES.get("token")
            if not token:
                # If the token is not in the cookie, try to get it from the URL parameters
                token = request.query_params.get("usertoken")
                if not token:
                    return None
            try:
                token_obj = (
                    self.get_model().objects.select_related("user").get(key=token)
                )
                return token_obj.user, token
            except self.get_model().DoesNotExist:
                raise AuthenticationFailed(_("Invalid token."))

        if len(auth) == 1:
            msg = _("Invalid token header. No credentials provided.")
            raise AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _("Invalid token header. Token string should not contain spaces.")
            raise AuthenticationFailed(msg)

        return self.authenticate_credentials(auth[1].decode("utf-8"))
def paypal_create_order(value, order_id, user_token):
    payment_url = None
    payment = paypalrestsdk.Payment(
        {
            "intent": "sale",
            "payer": {"payment_method": "paypal"},
            "transactions": [
                {
                    "amount": {"total": str(value), "currency": "USD"},
                    "description": f"Payment for order #{order_id}",
                }
            ],
            "redirect_urls": {
                "return_url": f"http://127.0.0.1:8000/orders/order/{order_id}/?usertoken={user_token}",
                "cancel_url": f"http://127.0.0.1:8000/orders/order/{order_id}/?usertoken={user_token}",
            },
        }
    )

    if payment.create():
        for link in payment.links:
            if link.rel == "approval_url":
                payment_url = link.href
    else:
        return payment.error
    return payment_url
Abdallah — 05/04/2024 10:12 PM
const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');
maria — Today at 12:01 AM
Attachment file type: acrobat
project_spring_2024_cse334s.pdf
120.09 KB
Ahmed Wael — Today at 12:57 AM
import "./AccountSeller.css";
import address from "../SVGs/address.svg";
import addresshover from "../SVGs/addresshover.svg";
import dashboard from "../SVGs/dashboard.svg";
import dashboardhover from "../SVGs/dashboardhover.svg";
import payment from "../SVGs/payment.svg";
Expand
message.txt
7 KB
adjusting the css of the page and fixing the colors
`css
.container .title p
{
    font-size: 2em;
    color: #000;
    margin: 0;
    padding: 0;
}
.title
{
    margin: 8%;
}
.container
{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.container .components
{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}
.mainmenu
{
    align-self: flex-start;
    width: 70%;
}
.options img
{
    margin:10px;
    width:4%;
    transition: transform 0.5s;
}

.options
{
    margin-top: 0;
    margin-left: 4%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-self: flex-start;
}
.item
{

    cursor: pointer;
    margin: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.item:hover
{

    img{

        transition: 0.5s;
        transform: scale(1.3);
    }
}
.firstname
{
    color: gray;
}
user 
{
    color: rgb(114, 111, 111);
    font-weight: 600;

}
h3{
    margin: 10px 0 10px 0;
    font-weight: 500;
}
.menuitem
{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin: 30px;
}
.text
{
    width: 70%;
}
h4
{
    color:gray
}
.components a{
    color: black;
}
.linkss
{
    display: flex;
    flex-direction: row;

}
.linkss a
{
    margin: 10px;
    padding: 10px;

}
adding styling to links
Ahmed Wael — Today at 1:07 AM
fixing rendering infinity loop
import "./AccountSeller.css";
import address from "../SVGs/address.svg";
import addresshover from "../SVGs/addresshover.svg";
import dashboard from "../SVGs/dashboard.svg";
import dashboardhover from "../SVGs/dashboardhover.svg";
import payment from "../SVGs/payment.svg";
Expand
message.txt
7 KB
Ahmed Wael — Today at 1:20 AM
.container .title p
{
    font-size: 2em;
    color: #000;
    margin: 0;
    padding: 0;
}
.title
{
    margin: 8%;
}
.container
{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.container .components
{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}
.mainmenu
{
    align-self: flex-start;
    width: 70%;
}
.options img
{
    margin:10px;
    width:4%;
    transition: transform 0.5s;
}

.options
{
    margin-top: 0;
    margin-left: 4%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-self: flex-start;
}
.item
{

    cursor: pointer;
    margin: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.item:hover
{

    img{

        transition: 0.5s;
        transform: scale(1.3);
    }
}
.firstname
{
    color: gray;
}
user 
{
    color: rgb(114, 111, 111);
    font-weight: 600;

}
h3{
    margin: 10px 0 10px 0;
    font-weight: 500;
}
.menuitem
{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    margin: 30px;
}
.text
{
    width: 70%;
}
h4
{
    color:gray
}
adding more styling to the page and fixing margins
Ahmed Wael — Today at 1:34 AM
.centerloader {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
Expand
Loader.css
1 KB
import "ldrs/trefoil";
import "./Loader.css";
import { waveform } from 'ldrs'

function Loader() {
  waveform.register()
Expand
Loader.jsx
1 KB

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function NavigationListener({ setLoading }) {
  const location = useLocation();
Expand
NavigationListener.jsx
1 KB
Ahmed Wael — Today at 1:42 AM
handling the loader in appjsx
import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Login/Login";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import SellerProfilePage from "./Pages/SellerProfilePage";
import ShopPage from "./Pages/ShopPage";
import RegisterationType from "./Pages/RegisterationType";
import SellerRegisteration from "./Pages/SellerRegisteration";
import OrderHistory from "./Pages/OrderHistory";
import InventoryPage from "./Pages/InventoryPage";
import ProductPage from "./Pages/ProductPage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import SuccessPage from "./Pages/SuccessPage";
import TransactionHistory from "./Pages/TransactionHistory";
import TransactionHistorySeller from "./Pages/TransactionHistorySeller";
import PaymentHistory from "./Pages/PaymentHistory";
import Loader from "./Components/Loader"; // Import your Loader component
import NavigationListener from "./Components/NavigationListener";
import { useState, useEffect } from "react";
const token = localStorage.getItem("token");
function App() {

  const [loading, setLoading] = useState(false); // State to track loading status
  const [checkoutprice, setCheckoutPrice] = useState();


  const passPrice = (price) => {
    setCheckoutPrice(price);
  }
  console.log(loading);
  return (
    <BrowserRouter>  {/* Wrap everything here */}
      <NavigationListener setLoading={setLoading} /> {/* Pass the setLoading function to the NavigationListener component */}
      {loading? <Loader/>:<Routes></Routes>} {/* Render the Loader component when loading is true */}

      <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registerationtype" element={<RegisterationType/>}/>
      <Route path="/signupbuyer" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/signupseller" element={<SellerRegisteration />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="" element={<Login />} />
      <Route path="/account" element={<ProfilePage />} />{" "}
      <Route path="/selleraccount" element={<SellerProfilePage />} />{" "}
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/orderhistory" element={<OrderHistory/>}/> {/*should be orderhistory+accountid*/}
      <Route path="/inventory" element={<InventoryPage/>}/> {/*should be orderhistory+accountid*/}
      <Route path="/product/:slug" element={<ProductPage />} /> {/*Route for product page*/}
      <Route path="/cart" element={<CartPage passPrice={passPrice} />} />
      <Route path="/checkout" element={<CheckoutPage checkoutprice={checkoutprice}/>} />
      <Route path="/verify" element={<SuccessPage />} />
      <Route path="/transactionhistorycustomer" element={<TransactionHistory />} />
      <Route path="/transactionhistoryseller" element={<TransactionHistorySeller />} />
      <Route path="/paymenthistory" element={<PaymentHistory />} />
      <Route path="/success/*" element={<SuccessPage token={token}/>} />
    </Routes>}
      
    </BrowserRouter>
  );
}

export default App;
Collapse
message.txt
4 KB
﻿
import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Login/Login";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import SellerProfilePage from "./Pages/SellerProfilePage";
import ShopPage from "./Pages/ShopPage";
import RegisterationType from "./Pages/RegisterationType";
import SellerRegisteration from "./Pages/SellerRegisteration";
import OrderHistory from "./Pages/OrderHistory";
import InventoryPage from "./Pages/InventoryPage";
import ProductPage from "./Pages/ProductPage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import SuccessPage from "./Pages/SuccessPage";
import TransactionHistory from "./Pages/TransactionHistory";
import TransactionHistorySeller from "./Pages/TransactionHistorySeller";
import PaymentHistory from "./Pages/PaymentHistory";
import Loader from "./Components/Loader"; // Import your Loader component
import NavigationListener from "./Components/NavigationListener";
import { useState, useEffect } from "react";
const token = localStorage.getItem("token");
function App() {

  const [loading, setLoading] = useState(false); // State to track loading status
  const [checkoutprice, setCheckoutPrice] = useState();


  const passPrice = (price) => {
    setCheckoutPrice(price);
  }
  console.log(loading);
  return (
    <BrowserRouter>  {/* Wrap everything here */}
      <NavigationListener setLoading={setLoading} /> {/* Pass the setLoading function to the NavigationListener component */}
      {loading? <Loader/>:<Routes></Routes>} {/* Render the Loader component when loading is true */}

      <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registerationtype" element={<RegisterationType/>}/>
      <Route path="/signupbuyer" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/signupseller" element={<SellerRegisteration />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="" element={<Login />} />
      <Route path="/account" element={<ProfilePage />} />{" "}
      <Route path="/selleraccount" element={<SellerProfilePage />} />{" "}
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/orderhistory" element={<OrderHistory/>}/> {/*should be orderhistory+accountid*/}
      <Route path="/inventory" element={<InventoryPage/>}/> {/*should be orderhistory+accountid*/}
      <Route path="/product/:slug" element={<ProductPage />} /> {/*Route for product page*/}
      <Route path="/cart" element={<CartPage passPrice={passPrice} />} />
      <Route path="/checkout" element={<CheckoutPage checkoutprice={checkoutprice}/>} />
      <Route path="/verify" element={<SuccessPage />} />
      <Route path="/transactionhistorycustomer" element={<TransactionHistory />} />
      <Route path="/transactionhistoryseller" element={<TransactionHistorySeller />} />
      <Route path="/paymenthistory" element={<PaymentHistory />} />
      <Route path="/success/*" element={<SuccessPage token={token}/>} />
    </Routes>}
      
    </BrowserRouter>
  );
}
export default App;

