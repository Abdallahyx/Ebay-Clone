import { useEffect, useState } from "react";
import "../Components/Inventory.css";
let categories = [];
const displayCategories = async () => {
  try {
    const responsecategories = await fetch(
      "http://127.0.0.1:8000/products/categories/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!responsecategories.ok) {
      throw new Error("Failed to fetch categories");
    } else {
      const datacategories = await responsecategories.json();
      categories = datacategories.results;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
const categoryOptions = () => {
  return categories.map((categories) => {
    return <option value={categories.id}>{categories.slug}</option>;
  });
};
displayCategories();
function Inventory() {
  const [remainingQuantity, setRemainingQuantity] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [size, setSize] = useState([]);

  const displayInventory = async () => {
    let currentPage = 1;
    let allResults = [];
    while (true) {
      const response = await fetch(
        `http://127.0.0.1:8000/store/inventory/?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        break;
      }
      const data = await response.json();
      allResults = allResults.concat(data.results);
      currentPage++;
    }
    await setRemainingQuantity(allResults);
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
    console.log("validate");
    console.log(newProduct.category);
    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("category", newProduct.category);
    formData.append("slug", newProduct.slug);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("discount", newProduct.discount);
    formData.append("photo", newProduct.photo);
  
    newProduct.variations.forEach((item) => {
      formData.append("variations", JSON.stringify(item));
    });
    console.log(newProduct.variations);
    console.log(formData);
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
  const handleEditProduct = async (updatedProduct) => {
    const newQuantity = [...remainingQuantity];
    const index = newQuantity.findIndex((p) => p.id === updatedProduct.id);
    newQuantity[index] = updatedProduct;
    setRemainingQuantity(newQuantity);
    const formData = new FormData();
    formData.append("title", updatedProduct.title);
    formData.append("category", updatedProduct.category);
    formData.append("slug", updatedProduct.slug);
    formData.append("price", updatedProduct.price);
    formData.append("description", updatedProduct.description);
    formData.append("discount", updatedProduct.discount);
    // Append other product data

    updatedProduct.variations.forEach((item) => {
      formData.append("variations", JSON.stringify(item));
    });
    const response = await fetch(
      `http://127.0.0.1:8000/store/update/${updatedProduct.slug}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );
    displayInventory();
    console.log("response");
    console.log(await response.json());
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
  const handleSizeChange = (event, index) => {
    console.log(event.target.value);
    console.log("f");
    console.log(index);
    let siz = Array(size.length).fill(0);
    for (let i = 0; i < size.length; i++) {
      if (size[i]) {
        siz[i] = size[i];
      }
    }
    siz[index] = event.target.value;
    setSize(siz);
  };
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
            <p className="detail">
              {product.title}
              {product.variations.length > 1 ? (
                <select
                  onChange={(event) => {
                    handleSizeChange(event, index);
                  }}
                  className="sizeoptions"
                >
                  {product.variations.map((variation, i) => {
                    return (
                      <option value={i} key={i}>
                        {variation.size}
                      </option>
                    );
                  })}
                </select>
              ) : (
                ""
              )}
            </p>
            <p className="detail">${product.price_with_discount}</p>
            <p className="detail sold">
              {product.variations.length > 1
                ? size[index]
                  ? product.variations[size[index]].quantity_sold
                  : product.variations[0].quantity_sold
                : product.variations[0].quantity_sold}
            </p>
            {product.variations[size[index] ? size[index] : 0]
              .quantity_in_stock === 0 ? (
              <p className="detail remaining">Sold out!</p>
            ) : (
              <p className="detail remaining">
                {product.variations.length > 1
                  ? size[index]
                    ? product.variations[size[index]].quantity_in_stock
                    : product.variations[0].quantity_in_stock
                  : product.variations[0].quantity_in_stock}
              </p>
            )}

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
  const [variations, setVariations] = useState([
    { size: "default", quantity_in_stock: 0 },
  ]);
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
      variations,
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
    setVariations([{ size: "", quantity_in_stock: 0 }]);
  };

  const handleAddVariation = () => {
    setVariations([...variations, { size: "", quantity_in_stock: 0 }]);
  };

  const handleSizeChange = (index, value) => {
    const updatedVariations = [...variations];
    // Check if the input value is empty, if so, set it to "default"
    updatedVariations[index].size = value.trim() === "" ? "default" : value;
    setVariations(updatedVariations);
  };

  const handleQuantityChange = (index, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index].quantity_in_stock = value;
    setVariations(updatedVariations);
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
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categoryOptions()}
          </select>
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
        <label>
          Variations:
          {variations.map((variation, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Size"
                defaultValue={"default"}
                value={variation.size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={variation.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddVariation}>
            Add New Variation
          </button>
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
  const [variations, setVariations] = useState(product.variations);

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
      variations,
    };
    onSubmit(updatedProduct);
  };

  const handleAddVariation = () => {
    setVariations([...variations, { size: "default", quantity_in_stock: 0 }]);
  };

  const handleSizeChange = (index, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index].size = value;
    setVariations(updatedVariations);
  };

  const handleQuantityChange = (index, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index].quantity_in_stock = value;
    setVariations(updatedVariations);
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
          <select>
            <option value="">All Categories</option>
            {categoryOptions()}
          </select>
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
        <label>
          Variations:
          {variations.map((variation, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Size"
                value={variation.size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={variation.quantity_in_stock}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddVariation}>
            Add New Variation
          </button>
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
