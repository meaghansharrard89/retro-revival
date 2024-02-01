import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import About from "../pages/About";
import Shop from "../pages/Shop";
import Social from "../pages/Social";
import NavBar from "./NavBar";
import ScrollToTop from "../components/ScrollToTop";
import Login from "./Login";
import Checkout from "../components/Checkout";
import Profile from "../pages/Profile";
import { OrderProvider } from "../components/OrderContext";

function App() {
  const [user, setUser] = useState();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("/check_session")
      .then((r) => r.json())
      .then((u) => setUser(u));
  }, []);

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  return (
    <OrderProvider>
      <Router>
        <NavBar cartCount={cartCount} user={user} setUser={setUser} />
        <main>
          <Switch>
            <Route exact path="/">
              <Home user={user} setUser={setUser} />
            </Route>
            <Route exact path="/about">
              <About user={user} setUser={setUser} />
            </Route>
            <Route exact path="/shop">
              <Shop
                user={user}
                setUser={setUser}
                updateCartCount={updateCartCount}
              />
            </Route>
            <Route exact path="/social">
              <Social user={user} setUser={setUser} />
            </Route>
            <Route exact path="/cart">
              <Cart
                user={user}
                setUser={setUser}
                updateCartCount={updateCartCount}
                cartCount={cartCount}
              />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/checkout">
              <Checkout />
            </Route>
            <Route exact path="/profile">
              <Profile user={user} setUser={setUser} />
            </Route>
          </Switch>
        </main>
      </Router>
    </OrderProvider>
  );
}

export default App;
