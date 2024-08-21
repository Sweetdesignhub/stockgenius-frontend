import { useEffect, useState } from "react";
import Loading from "../../common/Loading";

const ZerodhaButton = ({
  apiKey,
  exchange,
  tradingSymbol,
  transactionType,
  quantity,
  price,
  orderType,
}) => {
  const [loading, setLoading] = useState(true);
  const [buttonId] = useState(
    `custom-button-${tradingSymbol.replace(/:/g, "-")}-${transactionType}`
  );

  useEffect(() => {
    setTimeout(() => {
      console.log("ZerodhaButton component mounted");
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!loading) {
      const script = document.createElement("script");
      script.src = "https://kite.trade/integrations/js/v1/kite.js";
      script.async = true;
      script.onload = () => {
        console.log("Zerodha script loaded");

        window.KiteConnect.ready(() => {
          console.log("KiteConnect ready");
          window.KiteConnect.init();
        });
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [loading]);

  console.log("Received props:", {
    apiKey,
    exchange,
    tradingSymbol,
    transactionType,
    quantity,
    price,
    orderType,
  });

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
          className={`kite-button inline-flex py-[9px] justify-center items-center rounded-md border border-transparent ${buttonStyle} px-4 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2`}
          data-kite={apiKey}
          data-exchange={exchange}
          data-tradingsymbol={tradingSymbol}
          data-transaction_type={transactionType}
          data-quantity={quantity}
          data-order_type={orderType}
          data-price={price}
        >
          {transactionType === "BUY" ? `Buy` : `Sell`}
        </button>
      )}
    </>
  );
};

export default ZerodhaButton;
