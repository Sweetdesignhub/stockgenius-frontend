import { useEffect, useState } from "react";
import Loading from "../../common/Loading";

const MotilalOswalButton = ({
  apiKey,
  symbol,
  product,
  quantity,
  price,
  orderType,
  transactionType,
}) => {
  const [loading, setLoading] = useState(true);
  const [buttonId] = useState(
    `motilal-button-${symbol.replace(/:/g, "-")}-${transactionType}`
  );

  useEffect(() => {
    setTimeout(() => {
      // console.log("MotilalOswalButton component mounted");
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!loading) {
      const script = document.createElement("script");
      script.innerHTML = `
        MotilalOswal.ready(function(){
          var motilal = new MotilalOswal("${apiKey}");
          motilal.add({
            symbol: "${symbol}",
            quantity: ${quantity},
            order_type: "${orderType}",
            transaction_type: "${transactionType}",
            product: "${product}",
            disclosed_quantity: 0,
            price: ${price}
          });
          motilal.link("#${buttonId}");
        });
      `;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [
    loading,
    apiKey,
    symbol,
    product,
    quantity,
    price,
    orderType,
    transactionType,
    buttonId,
  ]);

  // console.log("Received props:", {
  //   apiKey,
  //   symbol,
  //   product,
  //   quantity,
  //   price,
  //   orderType,
  //   transactionType,
  // });

  const buttonStyle =
    transactionType === "BUY"
      ? "bg-green-500 hover:bg-green-400"
      : "bg-red-500 hover:bg-red-400";

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loading />
        </div>
      )}
      {!loading && (
        <button
          id={buttonId}
          className={`motilal-button inline-flex py-[9px] justify-center items-center rounded-md border border-transparent ${buttonStyle} px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
        >
          {transactionType === "BUY" ? "Buy" : "Sell"}
        </button>
      )}
    </>
  );
};

export default MotilalOswalButton;
