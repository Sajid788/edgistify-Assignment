import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/api";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  sizes:any
  brand:string
  discount:string
  rating:number
  reviews:string
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log("product", products);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 className="text-3xl font-bold mb-8">Products</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          
          className="group border border-neutral-300 rounded-lg  bg-white hover:shadow-lg transition"
        >
          <div className="p-4">
            {/* Product Image */}
            <Link
          key={product._id}
          to={`/products/${product._id}`}>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-[250px] object-cover rounded-md"
              loading="lazy"
            />
           </Link>
            {/* Brand Tag */}
            <div className="mt-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                {product.brand}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-lg font-semibold mt-2">{product.title}</h2>

            {/* Price & Discount */}
            <p className="text-gray-600">
              <span className="text-xl font-bold">$ {product.price}</span>
              
            </p>

            {/* Rating */}
            <p className="text-yellow-500 text-sm">
              Rating: <span className="font-bold">{product.rating}</span> ⭐ ({product.reviews} reviews)
            </p>
       
       <div className="flex items-center justify-between mt-3">
            {/* Size Selector */}
            <div className="">
              <label className="text-sm font-semibold">Sizes:</label>
              <select className="ml-2 border px-2 py-1 rounded-md cursor-pointer">
                {product.sizes.map((size:any) => (
                  <option key={size} value={size} className="cursor-pointer">
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Add to Cart Button */}
            <button className="  px-4 cursor-pointer bg-[#319795] text-white py-1.5 rounded-md hover:bg-teal-700 transition">
              🛒 Add Cart
            </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default Products;
