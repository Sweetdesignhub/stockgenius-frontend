import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BrokerDetails from "../components/brokers/BrokerDetails";
import { useZerodhaData } from "../contexts/ZerodhaDataContext";
import { useData } from "../contexts/FyersDataContext";
import Loading from "../components/common/Loading";

const Brokerage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { profile: fyersProfile = {} } = useData(); 
  const { profile: zerodhaProfile = {} } = useZerodhaData(); 
  const [brokerDetails, setBrokerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      loadBrokerDetails();
    }
  }, [currentUser, fyersProfile, zerodhaProfile]);

  const loadBrokerDetails = () => {
    setLoading(true);
    setError("");

    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      const zerodhaAccessToken = localStorage.getItem("zerodha_access_token");

      if (fyersAccessToken) {
        setBrokerDetails(fyersProfile); // Use Fyers profile from the context
      } else if (zerodhaAccessToken) {
        setBrokerDetails(zerodhaProfile); // Use Zerodha profile from the context
      } else {
        setError("No broker details found.");
      }
    } catch (err) {
      console.error("Error fetching broker details:", err);
      setError("Failed to load broker details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBrokerDelete = async (id) => {
    console.log("Broker delete initiated:", id);
  };

  const handleBrokerConnect = async () => {
    console.log("Broker connect initiated.");
  };

  return (
    <div className="p-6">
      {loading ? (
        <div className="text-center">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : !brokerDetails ? (
        <div className="text-center">
          <p>No brokers connected. Connect your broker.</p>
        </div>
      ) : (
        <BrokerDetails
          credentials={brokerDetails}
          onDelete={handleBrokerDelete}
          onConnect={handleBrokerConnect}
        />
      )}
    </div>
  );
};

export default Brokerage;
