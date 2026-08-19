import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { About } from "./pages/About";
import { Checkout } from "./pages/Checkout";
import { CheckoutSuccess } from "./pages/CheckoutSuccess";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { Products } from "./pages/Products";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
