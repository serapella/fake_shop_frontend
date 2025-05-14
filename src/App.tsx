import { ComingSoon } from "./pages/ComingSoon"
import { Layout } from "./components/Layout"
import { Routes, Route } from "react-router"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<ComingSoon title="Categories" />} />
      </Routes>
    </Layout>
  )
}
