import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../config";
import BrokerDetails from "../components/brokers/BrokerDetails";
import { useNavigate } from "react-router-dom";

const Brokerage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [brokerDetails, setBrokerDetails] = useState(null);

  // console.log(brokerDetails);

  useEffect(() => {
    if (currentUser) {
      loadBrokerDetails(currentUser.id);
    }
  }, [currentUser]);

  const loadBrokerDetails = async () => {
    try {
      const fyersAccessToken = localStorage.getItem("fyers_access_token");
      if (currentUser && fyersAccessToken) {
        const headers = { Authorization: `Bearer ${fyersAccessToken}` };
        const response = await api.get(
          `/api/v1/fyers/fetchAllFyersUserDetails/${currentUser.id}`,
          { headers }
        );
        const data = response.data[0];
        setBrokerDetails(data.profile);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleUpdate = async (id, formData) => {
  //   try {
  //     await api.put(`/api/v1/fyers/updateFyersCredentials/${id}`, formData);
  //     loadBrokerDetails(currentUser.id);
  //     window.alert('Successfully updated credentials!');
  //   } catch (error) {
  //     console.error('Error updating broker credentials:', error);
  //   }
  // };

  const handleDelete = async (id) => {
    // console.log("hanlde delete");
  };

  const handleConnect = async () => {
    // console.log("clicked handle click");
  };

  return (
    <div className="p-6">
      {!brokerDetails ? (
        <div className="text-center">
          <p>No brokers connected. Connect your broker.</p>
        </div>
      ) : (
        <BrokerDetails
          credentials={brokerDetails}
          // onUpdate={handleUpdate}
          // onDelete={handleDelete}
          // onConnect={handleConnect}
        />
      )}
    </div>
  );
};

export default Brokerage;
