// import React, { useEffect, useState } from "react";
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

//   console.log("Received props:", {
//     apiKey,
//     symbol,
//     product,
//     quantity,
//     price,
//     orderType,
//     transactionType,
//   });

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
//           fyers.link("#buy-button");
//         });
//       } else {
//         console.error("Fyers library not loaded.");
//       }
//     }
//   }, [apiKey, symbol, product, quantity, price, orderType, transactionType, loading]);

//   return (
//     <>
//       {loading ? (
//         <AiOutlineLoading className="animate-spin" />
//       ) : (
//         <button id="buy-button">Buy</button>
//       )}
//     </>
//   );
// };

// export default FyersBuyButton;



// import React, { useEffect, useState } from "react";
// import { AiOutlineLoading } from "react-icons/ai";
// import "../lib/fyers.js";

// const FyersBuyButton = ({
//   apiKey,
//   symbol,
//   product,
//   quantity,
//   price,
//   orderType,
//   transactionType,
//   ticker, 
// }) => {
//   const [loading, setLoading] = useState(true);


//   const handleBuy = () => {
//     console.log("Buy button clicked for row:", ticker);
//     console.log(quantity);
//   };


//   useEffect(() => {
//     // Simulating loading state
//     setTimeout(() => {
//       console.log("FyersBuyButton component mounted");
//       setLoading(false);
//     }, 2000);

//     if (!loading) {
//       const fyers = new Fyers(apiKey);
//       fyers.add({
            
//         "symbol": "NSE:RELIANCE-EQ",
//         "quantity": 4,
//         "order_type": "LIMIT",
//         "transaction_type": "BUY",
//         "product":"INTRADAY",
//         "disclosed_quantity":0,
//         "price":200
        
//     });
//       fyers.link("#buy-button");
//     }
//   }, [apiKey, symbol, product, quantity, price, orderType, transactionType, loading]);

//   return (
//     <>
//       {loading ? (
//         <AiOutlineLoading className="animate-spin" />
//       ) : (
//         <button onClick={handleBuy} className="bg-[#14AE5C1A] text-xs px-2 py-1 rounded-xl text-center border border-[#14AE5C]" id="buy-button">Buy</button>
//       )}
//     </>
//   );
// };

// export default FyersBuyButton;

import React, { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import "../../../lib/fyers.js";
import Loading from "../../common/Loading.jsx";

const FyersButton = ({
  apiKey,
  symbol,
  product,
  quantity,
  price,
  orderType,
  transactionType,
}) => {
  const [loading, setLoading] = useState(true);
  const [buttonId] = useState(`custom-button-${symbol.replace(/:/g, '-')}-${transactionType}`);

  useEffect(() => {
    setTimeout(() => {
      console.log("FyersButton component mounted");
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!loading) {
      const script = document.createElement("script");
      script.innerHTML = `
        Fyers.ready(function(){
          var fyers = new Fyers("${apiKey}");
          fyers.add({
            symbol: "${symbol}",
            quantity: ${quantity},
            order_type: "${orderType}",
            transaction_type: "${transactionType}",
            product: "${product}",
            disclosed_quantity: 0,
            price: ${price}
          });
          fyers.link("#${buttonId}");
        });
      `;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [loading, apiKey, symbol, product, quantity, price, orderType, transactionType, buttonId]);

  console.log("Received props:", {
    apiKey,
    symbol,
    product,
    quantity,
    price,
    orderType,
    transactionType,
  });

  const buttonStyle = transactionType === "BUY" ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400";

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* <AiOutlineLoading className="animate-spin text-white text-6xl" /> */}
          <Loading/>
        </div>
      )}
      {!loading && (
        <button
          id={buttonId}
          className={`custom-fyers-button inline-flex py-[9px] justify-center items-center rounded-md border border-transparent ${buttonStyle} px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
        >
          {transactionType === "BUY" ? "Buy" : "Sell"}
        </button>
      )}
    </>
  );
};

export default FyersButton;

