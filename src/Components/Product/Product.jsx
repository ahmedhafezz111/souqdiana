import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import ProductTimer from '../ProductTimer/ProductTimer';

export default function Product() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9000/products");
        if (Array.isArray(response.data) && response.data.length > 0) {
          setProducts(response.data);
        } else {
          console.error("Response data is not an array or is empty:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();

    return () => {
      // Cleanup function
    };
  }, []);

  return (
    <>
      <section className='py-5 bg-light'>
        <div className="container">
          <div className="row">
            <h1>Products</h1>
            {products.length > 0 ? products.map((product, index) => (
              <div key={index} className="col-lg-4">
                <div className="card my-2">
                  <img src={product.image_url} className='card-img-top' height={200} alt="" />
                  <div className="card-body text-center">
                    <h5 className='card-title text-center'>{product.product_name}</h5>
                    <p className='card-text text-center'>{product.title}</p>
                    <p className='card-text text-center'>Start Price: {product.start_price} <span>$</span></p>
                    <ProductTimer endDate={product.end_date} /> {/* Pass the end date of the product */}
                    <Link to={`/product/${product.id}`} className="btn btn-success">Bid Now</Link> {/* Use Link to navigate to product detail */}
                  </div>
                </div>
              </div>
            )) : (
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
