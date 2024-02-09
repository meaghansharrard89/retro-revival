import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Signup from "../components/Signup";
import Login from "../components/Login";
import { useOrder } from "../components/OrderContext";
import { useUser } from "../components/UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ErrorModal from "../components/ErrorModal";

function Cart({ cartItems, setCartItems, handleDeleteFromCart }) {
  const location = useLocation();
  const { user, setUser } = useUser();
  const { setCompletedOrder } = useOrder();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    cardName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prevBillingInfo) => ({
      ...prevBillingInfo,
      [name]: value,
    }));
  };

  const isBillingInfoComplete = () => {
    const { cardName, cardNumber, expirationDate, cvv } = billingInfo;
    const isCardNumberValid = /^\d{16}$/.test(cardNumber);
    const isExpirationDateValid = /^\d{2}\/\d{2}$/.test(expirationDate);
    const isCvvValid = /^\d{3,4}$/.test(cvv);

    return (
      cardName !== "" &&
      isCardNumberValid &&
      isExpirationDateValid &&
      isCvvValid
    );
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = parseFloat(item.price.replace("$", ""));
        return total + itemPrice;
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = async (e) => {
    try {
      if (cartItems.length === 0) {
        setError({
          title: "Error",
          message: "Cannot checkout with an empty cart.",
        });
        return;
      }
      if (!isBillingInfoComplete()) {
        setError({
          title: "Error",
          message:
            "Please fill out all billing information before confirming the order.",
        });
        return;
      }
      const orderDetails = cartItems.map((item) => ({
        item_id: item.id,
      }));
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_details: orderDetails,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();

      setCompletedOrder(orderDetails);
      localStorage.removeItem("cart");
      history.push("/checkout", { username: user.firstname });
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      setError({ title: "Error", message: `Error: ${error.message}` });
    }
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, [location]);

  return (
    <>
      <div className="App">
        <center>
          <h1>Register a new account</h1>
          <Formik>
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="text"
                  name="fullname"
                  placeholder="Enter your fullname"
                />
                <ErrorMessage name="fullname" component="div" />

                <Field
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                />
                <ErrorMessage name="email" component="div" />

                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" />

                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </center>
      </div>

      <div id="cart">
        <h1>Shopping Cart</h1>
        <h3>Your Items:</h3>
        {cartItems.map((cartItem, index) => (
          <div
            key={index}
            style={{ border: "1px solid #ccc", padding: "10px" }}
          >
            <h3>{cartItem.name}</h3>
            <p>Price: {cartItem.price}</p>
            <p>{cartItem.description}</p>
            <img
              src={cartItem.image_url}
              alt={cartItem.imageAlt}
              width="200px"
            />
            <p>Quantity: 1</p>
            <button onClick={() => handleDeleteFromCart(index)}>
              Delete from Cart
            </button>
          </div>
        ))}
        <p>Total: ${calculateTotal()}</p>
        {/*Logged in or new user*/}
        {user && user.email ? (
          <div>
            <h2>Welcome, {user.firstname}!</h2>
            <p>Enter your billing information to complete your order:</p>
            <form>
              <label>
                Name on Card:
                <input
                  type="text"
                  name="cardName"
                  value={billingInfo.cardName}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Card Number:
                <input
                  type="text"
                  name="cardNumber"
                  value={billingInfo.cardNumber}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Expiration Date:
                <input
                  type="text"
                  name="expirationDate"
                  value={billingInfo.expirationDate}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                CVV:
                <input
                  type="text"
                  name="cvv"
                  value={billingInfo.cvv}
                  onChange={handleChange}
                />
              </label>
            </form>
            <button
              onClick={handleCheckout}
              disabled={!isBillingInfoComplete()}
            >
              Confirm order
            </button>
          </div>
        ) : (
          <div className="forms-container">
            <div className="form-section existing-user">
              <h2>Have an existing account? Log in:</h2>
              <br />
              <Login user={user} setUser={setUser} />
            </div>
            <div className="form-section new-user">
              <h2>New here? Create an account:</h2>
              <br />
              <Signup user={user} setUser={setUser} />
            </div>
          </div>
        )}
      </div>
      {/* Error modal */}
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
}

export default Cart;
