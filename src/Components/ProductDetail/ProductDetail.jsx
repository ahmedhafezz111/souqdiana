import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import ProductTimer from '../ProductTimer/ProductTimer';

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [currentBid, setCurrentBid] = useState('');
  const [storedBid, setStoredBid] = useState('');
  const [countdown, setCountdown] = useState(300); // Initial countdown time in seconds
  const [yourBidValue, setYourBidValue] = useState('');
  const [yourBidStatus, setYourBidStatus] = useState('');
  const { productId } = useParams();

  useEffect(() => {
    // Fetch product details when component mounts
    axios.get(`http://localhost:9000/products/${productId}`)
      .then(response => {
        setProduct(response.data);
        setStoredBid(response.data.current_bid);
        const bidFromLocalStorage = localStorage.getItem(`product_${productId}_bid`);
        const statusFromLocalStorage = localStorage.getItem(`product_${productId}_status`);
        if (bidFromLocalStorage) {
          setStoredBid(parseInt(bidFromLocalStorage)); // Parse bid value from local storage
          setYourBidValue(parseInt(bidFromLocalStorage)); // Set your bid value from local storage
          setYourBidStatus(statusFromLocalStorage); // Set your bid status from local storage
        }
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [productId]);

  useEffect(() => {
    const socket = socketIOClient('http://localhost:9001');

    socket.on('countdownUpdate', (timer) => {
      setCountdown(timer); // Update the countdown timer when received from the server
    });

    socket.on('bidUpdate', ({ productId: updatedProductId, bid: updatedBid }) => {
      // Check if the bid update is for the current product being viewed
      if (updatedProductId === productId) {
        setStoredBid(updatedBid); // Update the storedBid state with the new bid value
        if (yourBidValue !== '' && parseInt(yourBidValue) > updatedBid) {
          setYourBidStatus('Winning Deal'); // If your bid is higher than the updated bid, set bid status to winning
        } else {
          setYourBidStatus('Losing Deal'); // If your bid is lower than or equal to the updated bid, set bid status to losing
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [productId, yourBidValue]);

  useEffect(() => {
    if (yourBidStatus) {
      localStorage.setItem(`product_${productId}_status`, yourBidStatus);
    }
  }, [yourBidStatus, productId]);

  const handleBidSubmit = () => {
    const bid = parseInt(currentBid);

    // Check if bid is less than or equal to the start price
    if (bid <= product.start_price || isNaN(bid)) {
      alert('Please enter a valid bid greater than the start price.');
      return;
    }

    // Check if bid is equal to the start price
    if (bid === product.start_price) {
      alert('Please enter a bid greater than the start price.');
      return;
    }

    axios.post(`http://localhost:9001/bid`, { productId, bid })
      .then(response => {
        console.log('Bid submitted:', response.data);
        setCurrentBid(''); // Reset currentBid
        if (bid > storedBid) {
          // Update stored bid value in local storage if the new bid is greater
          setStoredBid(bid);
          localStorage.setItem(`product_${productId}_bid`, bid);
        }
        setYourBidValue(bid); // Set your bid value
        
        // Set your bid status as winning if your bid is greater than or equal to the start price
        setYourBidStatus(bid >= product.start_price ? 'Winning Deal' : 'Losing Deal');
      })
      .catch(error => console.error('Error submitting bid:', error));
  };

  const handleBidChange = (e) => {
    setCurrentBid(e.target.value);
  };

  return (
    <>
      <section className='pdetail py-5'>
        <div className='container'>
          <div className='row d-flex justify-content-between'>
            <div className='col-lg-6'>
              <img src={product.image_url} width={500} height={400} alt='' />
            </div>
            <div className='col-lg-6'>
              <h2>Product Name: {product.title}</h2>
              <p>Product Start Price: {product.start_price}<span>$</span></p>
              <label className='bidValue' htmlFor='bidValue'>
                Your Bid Value
              </label>
              <input
                type='number'
                inputMode='numeric'
                className='form-control w-25'
                name=''
                id='bidValue'
                value={currentBid}
                onChange={handleBidChange}
              />
              <button className='btn btn-primary mt-2' onClick={handleBidSubmit}>
                Bid
              </button>
              {yourBidValue !== '' && (
                <p style={{ color: yourBidStatus === 'Winning Deal' ? 'green' : 'red' }}>Your Bid: {yourBidValue} <span>$</span></p>
              )}
              {yourBidStatus !== '' && (
                <p style={{ color: yourBidStatus === 'Winning Deal' ? 'green' : 'red' }}>Your Bid Status: {yourBidStatus}</p>
              )}
              {storedBid !== '' && (
                <p>Current Bid: {storedBid} <span>$</span></p>
              )}
              <ProductTimer endDate={product.end_date} /> {/* Pass the end date of the product */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}






// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import socketIOClient from 'socket.io-client';
// import ProductTimer from '../ProductTimer/ProductTimer';

// export default function ProductDetail() {
//   const [product, setProduct] = useState({});
//   const [currentBid, setCurrentBid] = useState('');
//   const [storedBid, setStoredBid] = useState('');
//   const [countdown, setCountdown] = useState(300); // Initial countdown time in seconds
//   const [yourBidValue, setYourBidValue] = useState('');
//   const [yourBidStatus, setYourBidStatus] = useState('');
//   const { productId } = useParams();

//   useEffect(() => {
//     // Fetch product details when component mounts
//     axios.get(`http://localhost:9000/products/${productId}`)
//       .then(response => {
//         setProduct(response.data);
//         setStoredBid(response.data.current_bid);
//         const bidFromLocalStorage = localStorage.getItem(`product_${productId}_bid`);
//         if (bidFromLocalStorage) {
//           setStoredBid(parseInt(bidFromLocalStorage)); // Parse bid value from local storage
//         }
//       })
//       .catch(error => console.error('Error fetching product:', error));
//   }, [productId]);

//   useEffect(() => {
//     const socket = socketIOClient('http://localhost:9001');

//     socket.on('countdownUpdate', (timer) => {
//       setCountdown(timer); // Update the countdown timer when received from the server
//     });

//     socket.on('bidUpdate', ({ productId: updatedProductId, bid: updatedBid }) => {
//       // Check if the bid update is for the current product being viewed
//       if (updatedProductId === productId) {
//         setStoredBid(updatedBid); // Update the storedBid state with the new bid value
//         if (yourBidValue !== '' && parseInt(yourBidValue) > updatedBid) {
//           setYourBidStatus('Winning Deal'); // If your bid is higher than the updated bid, set bid status to winning
//         } else {
//           setYourBidStatus('Losing Deal'); // If your bid is lower than or equal to the updated bid, set bid status to losing
//         }
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [productId, yourBidValue]);

//   const handleBidSubmit = () => {
//     const bid = parseInt(currentBid);

//     // Check if bid is less than or equal to the start price
//     if (bid <= product.start_price || isNaN(bid)) {
//       alert('Please enter a valid bid greater than the start price.');
//       return;
//     }

//     // Check if bid is equal to the start price
//     if (bid === product.start_price) {
//       alert('Please enter a bid greater than the start price.');
//       return;
//     }

//     axios.post(`http://localhost:9001/bid`, { productId, bid })
//       .then(response => {
//         console.log('Bid submitted:', response.data);
//         setCurrentBid(''); // Reset currentBid
//         if (bid > storedBid) {
//           // Update stored bid value in local storage if the new bid is greater
//           setStoredBid(bid);
//           localStorage.setItem(`product_${productId}_bid`, bid);
//         }
//         setYourBidValue(bid); // Set your bid value
        
//         // Set your bid status as winning if your bid is greater than or equal to the start price
//         setYourBidStatus(bid >= product.start_price ? 'Winning Deal' : 'Losing Deal');
//       })
//       .catch(error => console.error('Error submitting bid:', error));
//   };

//   const handleBidChange = (e) => {
//     setCurrentBid(e.target.value);
//   };

//   return (
//     <>
//       <section className='pdetail py-5'>
//         <div className='container'>
//           <div className='row d-flex justify-content-between'>
//             <div className='col-lg-6'>
//               <img src={product.image_url} width={500} height={400} alt='' />
//             </div>
//             <div className='col-lg-6'>
//               <h2>Product Name: {product.title}</h2>
//               <p>Product Start Price: {product.start_price}<span>$</span></p>
//               <label className='bidValue' htmlFor='bidValue'>
//                 Your Bid Value
//               </label>
//               <input
//                 type='number'
//                 inputMode='numeric'
//                 className='form-control w-25'
//                 name=''
//                 id='bidValue'
//                 value={currentBid}
//                 onChange={handleBidChange}
//               />
//               <button className='btn btn-primary mt-2' onClick={handleBidSubmit}>
//                 Bid
//               </button>
//               {yourBidValue !== '' && (
//                 <p style={{ color: yourBidStatus === 'Winning Deal' ? 'green' : 'red' }}>Your Bid: {yourBidValue} <span>$</span></p>
//               )}
//               {yourBidStatus !== '' && (
//                 <p style={{ color: yourBidStatus === 'Winning Deal' ? 'green' : 'red' }}>Your Bid Status: {yourBidStatus}</p>
//               )}
//               {storedBid !== '' && (
//                 <p>Current Bid: {storedBid} <span>$</span></p>
//               )}
//               <ProductTimer endDate={product.end_date} /> {/* Pass the end date of the product */}
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
