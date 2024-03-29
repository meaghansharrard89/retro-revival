import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import About from "../pages/About";
import Shop from "../pages/Shop";
import Social from "../pages/Social";
import NavBar from "./NavBar";
import Login from "./Login";
import CheckoutModal from "../components/CheckoutModal";
import Profile from "../pages/Profile";
import { OrderProvider } from "../components/OrderContext";
import { ChatProvider } from "./ChatContext";
import { UserProvider } from "./UserContext";
import Chatbot from "../components/Chatbot";
import Footer from "../components/Footer";
import DeleteModal from "../components/DeleteModal";
import "../index.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleDeleteFromCart = (index) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    currentCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCartItems(currentCart);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const itemPrice = parseFloat(item.price.replace("$", ""));
        return total + itemPrice;
      }, 0)
      .toFixed(2);
  };

  return (
    <UserProvider>
      <OrderProvider>
        <ChatProvider>
          <div class="flex flex-col h-screen justify-between">
            <Router>
              <NavBar />
              <main class="grow">
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route exact path="/about">
                    <About />
                  </Route>
                  <Route exact path="/shop">
                    <Shop
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                      handleDeleteFromCart={handleDeleteFromCart}
                    />
                  </Route>
                  <Route exact path="/social">
                    <Social />
                  </Route>
                  <Route exact path="/cart">
                    <Cart
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                      handleDeleteFromCart={handleDeleteFromCart}
                      calculateTotal={calculateTotal}
                    />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route exact path="/checkout">
                    <CheckoutModal />
                  </Route>
                  <Route exact path="/profile">
                    <Profile />
                  </Route>
                </Switch>
              </main>
            </Router>
            <Chatbot />
            <Footer />
          </div>
        </ChatProvider>
      </OrderProvider>
    </UserProvider>
  );
}

export default App;
