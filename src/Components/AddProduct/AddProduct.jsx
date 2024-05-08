import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [startPrice , setStartPrice] = useState(0);
  const [file, setFile] = useState('');
  const [endDate, setEndDate] = useState(''); // State to store the end date/time
  const navigate = useNavigate();

  const formSubmit = (e) => {
    e.preventDefault();

    // Check if any input is empty
    if (!productName || !productDescription || !startPrice || !file || !endDate) {
      alert("Please fill in all the form inputs.");
      return;
    }

    // Check if productName and productDescription contain at least 10 characters
    if (productName.length < 5 || productDescription.length < 5) {
      alert("Product name and description should contain at least 5 characters.");
      return;
    }

    // Check if startPrice exceeds the limit
    if (startPrice > 100000000) {
      alert("Start price cannot exceed 100,000,000.");
      return;
    }

    axios.post("http://localhost:9000/products", {
      product_name: productName,
      title: productDescription,
      image_url: file,
      start_price: startPrice,
      end_date: endDate, // Include the end date/time in the request
    })
    .then((data) => {
      console.log(data);
      navigate('/product');
    })
    .catch((error) => {
      console.error('Error submitting product:', error);
    });
  };

  return (
    <>
      <section className='userInputform'>
        <div className="container px-5">
          <div className="row">
            <div className="col-lg-6">
              <h2 className='py-2'>Add Your Antique </h2>
              <form onSubmit={formSubmit}>
                <div className='mt-3'>
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input type="text" placeholder="Product Name..." className="form-control w-50" id="productName" onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div className='mt-3'>
                  <label htmlFor="productDescription" className="form-label">Product Description</label>
                  <input type="text" placeholder="Product Description..." className="form-control w-50" id="productDescription" onChange={(e) => setProductDescription(e.target.value)}  />
                </div>
                <div className='mt-3'>
                  <label htmlFor="startPrice" className="form-label">Product Start Price</label>
                  <input type="number" placeholder="Product Start Price..." className="form-control w-50" id="startPrice" onChange={(e) => setStartPrice(parseFloat(e.target.value))} />
                </div>
                <div className="mt-3">
                  <label htmlFor="endDate" className="form-label">End Date/Time</label>
                  <input type="datetime-local" className="form-control w-50" id="endDate" onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="mt-1">
                  <label htmlFor="productImg" className="form-label">Product Image</label>
                  <input type="url" className='form-control' placeholder='Enter image direct link' onChange={(e) => setFile(e.target.value) }/>
                </div>
                <button className='btn btn-primary mt-3' type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
