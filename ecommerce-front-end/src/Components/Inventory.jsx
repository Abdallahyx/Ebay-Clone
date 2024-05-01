import { useEffect, useState } from "react";
import "../Components/Inventory.css";
function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
function Inventory() {
  const [remainingQuantity, setRemainingQuantity] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const displayInventory = async () => {
    const response = await fetch("http://127.0.0.1:8000/store/inventory/", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    await setRemainingQuantity(data.results);
    console.log(remainingQuantity);
  };
  useEffect(() => {
    displayInventory();
  }, []);
  const handleIncrement = (index) => {
    const newQuantity = [...remainingQuantity];
    newQuantity[index].quantity++;
    setRemainingQuantity(newQuantity);
  };

  const handleDecrement = (index) => {
    const newQuantity = [...remainingQuantity];
    if (newQuantity[index].quantity > 0) {
      newQuantity[index].quantity--;
      setRemainingQuantity(newQuantity);
    }
  };

  const handleAddProduct = async (newProduct) => {
    const variations = [
      { size: "M", quantity_in_stock: 142 },
      {size: "L", quantity_in_stock: 141},]
    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("category", newProduct.category);
    formData.append("slug", newProduct.slug);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("discount", newProduct.discount);
    formData.append("photo", newProduct.photo);
    formData.append("variations",JSON.stringify(variations)); 
    // Append other product data

    const response = await fetch("http://127.0.0.1:8000/store/create/", {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("response", data);

    const updatedRemainingQuantity = [
      ...remainingQuantity,
      {
        id: remainingQuantity.length + 1,
        ...newProduct,
        quantity: 0,
        img: data.image_url,
      }, // Assuming the response contains the image URL
    ];

    setRemainingQuantity(updatedRemainingQuantity);
    setShowAddForm(false);
    await displayInventory();
    console.log(formData);
  };
  const handleEditProduct = (updatedProduct) => {
    const newQuantity = [...remainingQuantity];
    const index = newQuantity.findIndex((p) => p.id === updatedProduct.id);
    newQuantity[index] = updatedProduct;
    setRemainingQuantity(newQuantity);
    setShowEditForm(false);
    setEditingProduct(null);
  };
  const handleRemoveProduct = async (slug) => {
    console.log(slug);
    const response = await fetch(
      `http://127.0.0.1:8000/store/delete/${slug}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    displayInventory();

    setRemainingQuantity(
      remainingQuantity.filter((product) => product.slug !== slug)
    );
  };
  console.log(remainingQuantity);
  return (
    <div className="justifywrapper">
      <h1>Inventory</h1>
      <button className="buttonbasic" onClick={() => setShowAddForm(true)}>
        Add New Product
      </button>
      {showAddForm && (
        <AddProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      <div className="HistoryWrapper">
        <div className="producttitles">
          <h3>Item Image</h3>
          <h3>Item Name</h3>
          <h3>Item Price</h3>
          <h3>Sold</h3>
          <h3>Remaining</h3>
          <h3>Modify Remaining</h3>
          <h3>Actions</h3>
        </div>
        {remainingQuantity.map((product, index) => (
          <div className="productdetails" key={index}>
            <div className="detail">
              {typeof product.photo === "string" && (
                <img
                  src={
                    "Images/" +
                    product.photo.substring(product.photo.lastIndexOf("/") + 1)
                  }
                  alt="product"
                />
              )}
              {/* Ensure that img attribute is used */}
            </div>
            <p className="detail">{product.title}</p>
            <p className="detail">${product.price.toFixed(2)}</p>
            <p className="detail sold">Sold Quantity</p>
            {product.quantity === 0 ? (
              <p className="detail remaining">Sold out!</p>
            ) : (
              <p className="detail remaining">{product.quantity}</p>
            )}
            <div className="detail">
              <button
                className="buttonbasic"
                onClick={() => handleIncrement(index)}
              >
                +
              </button>
              <button
                className="decrementButton"
                onClick={() => handleDecrement(index)}
              >
                -
              </button>
            </div>
            <div className="detail actionButtons">
              <button
                className="editButton stylebutton"
                onClick={() => {
                  setEditingProduct(product);
                  setShowEditForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="removeButton stylebutton"
                onClick={() => handleRemoveProduct(product.slug)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {showEditForm && (
        <EditProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setShowEditForm(false)}
          onRemove={() => handleRemoveProduct(editingProduct.id)}
        />
      )}
    </div>
  );
}

function AddProductForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(0);
  const [photo, setImageFile] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      title,
      category,
      slug,
      price,
      description,
      discount,
      photo,
      quantity,
    };
    onSubmit(newProduct);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setSlug("");
    setPrice(0);
    setDescription("");
    setDiscount(0);
    setImageFile(null);
    setQuantity(0);
  };

  return (
    <div className="formContainer">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <label>
          Slug:
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Discount:
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Image Upload:
          <input
            className="upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button className="buttonbasic" type="submit">
          Add
        </button>
        <button className="buttonbasic" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

function EditProductForm({ product, onSubmit, onCancel, onRemove }) {
  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState(product.category);
  const [slug, setSlug] = useState(product.slug);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [discount, setDiscount] = useState(product.discount);
  const [photo, setImageFile] = useState(null);
  const [quantity, setQuantity] = useState(product.quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      id: product.id,
      title,
      category,
      slug,
      price,
      description,
      discount,
      photo,
      quantity,
    };
    onSubmit(updatedProduct);
  };

  return (
    <div className="formContainer">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
        <label>
          Slug:
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Discount:
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Image Upload:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <button className="buttonbasic" type="submit">
          Save
        </button>
        <button className="buttonbasic" onClick={onCancel}>
          Cancel
        </button>
        <button className="buttonbasic" onClick={onRemove}>
          Remove
        </button>
      </form>
    </div>
  );
}

export default Inventory;
