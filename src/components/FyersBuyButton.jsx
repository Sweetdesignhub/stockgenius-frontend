// import React, { useEffect, useState } from "react";
// import "../lib/fyers.js";
// import { AiOutlineLoading } from "react-icons/ai";

// const FyersBuyButton = ({
//   apiKey,
//   symbol,
//   product,
//   quantity,
//   price,
//   orderType,
//   transactionType,
// }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       console.log("FyersBuyButton component mounted");
//       setLoading(false);
//     }, 2000);
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <AiOutlineLoading className="animate-spin" />
//       ) : (
//         <fyers-button
//           data-fyers={apiKey}
//           data-symbol={symbol}
//           data-product={product}
//           data-quantity={quantity}
//           data-price={price}
//           data-order_type={orderType}
//           data-transaction_type={transactionType}
//         ></fyers-button>
//       )}
//     </>
//   );
// };

// export default FyersBuyButton;

// import React, { useEffect, useState } from "react";

// const FyersBuyButton = ({
//   apiKey,
//   symbol,
//   product,
//   quantity,
//   price,
//   orderType,
//   transactionType,
// }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate loading state
//     setTimeout(() => {
//       console.log("FyersBuyButton component mounted");
//       setLoading(false);
//     }, 2000);
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       if (window.Fyers) {
//         window.Fyers.ready(() => {
//           const fyers = new window.Fyers(apiKey);
//           fyers.add({
//             symbol,
//             quantity,
//             order_type: orderType,
//             transaction_type: transactionType,
//             product,
//             price,
//             disclosed_quantity: 0,
//           });
//           fyers.link("#custom-button");
//         });
//       } else {
//         console.error("Fyers library not loaded.");
//       }
//     }
//   }, [apiKey, symbol, product, quantity, price, orderType, transactionType, loading]);

//   return (
//     <>
//       {loading ? (
//         <span>Loading...</span>
//       ) : (
//         <button id="custom-button">Buy {quantity} stock(s)</button>
//       )}
//     </>
//   );
// };

// export default FyersBuyButton;



import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import "../lib/fyers.js";

const FyersBuyButton = ({
  apiKey,
  symbol,
  product,
  quantity,
  price,
  orderType,
  transactionType,
  ticker, 
}) => {
  const [loading, setLoading] = useState(true);


  const handleBuy = () => {
    console.log("Buy button clicked for row:", ticker);
    console.log(quantity);
  };


  useEffect(() => {
    // Simulating loading state
    setTimeout(() => {
      console.log("FyersBuyButton component mounted");
      setLoading(false);
    }, 2000);

    if (!loading) {
      const fyers = new Fyers(apiKey);
      fyers.add({
            
        "symbol": "NSE:RELIANCE-EQ",
        "quantity": 4,
        "order_type": "LIMIT",
        "transaction_type": "BUY",
        "product":"INTRADAY",
        "disclosed_quantity":0,
        "price":200
        
    });
      fyers.link("#buy-button");
    }
  }, [apiKey, symbol, product, quantity, price, orderType, transactionType, loading]);

  return (
    <>
      {loading ? (
        <AiOutlineLoading className="animate-spin" />
      ) : (
        <button onClick={handleBuy} className="bg-[#14AE5C1A] text-xs px-2 py-1 rounded-xl text-center border border-[#14AE5C]" id="buy-button">Buy</button>
      )}
    </>
  );
};

export default FyersBuyButton;
