import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../config';
import BrokerDetails from '../components/brokers/BrokerDetails';
import { useNavigate } from 'react-router-dom';

const Brokerage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [brokerDetails, setBrokerDetails] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  console.log(brokerDetails);
  

  useEffect(() => {
    if (currentUser) {
      loadBrokerDetails(currentUser.id);
    }
  }, [currentUser]);

  const loadBrokerDetails = async (userId) => {
    try {
      const response = await api.get(
        `/api/v1/fyers/fetchAllFyersUserDetails/${userId}`
      );

      if(response.status === 200){
        setBrokerDetails(response.data[0].profile)
      }
      
    } catch (error) {
      console.error('Error fetching broker details:', error);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await api.put(`/api/v1/fyers/updateFyersCredentials/${id}`, formData);
      loadBrokerDetails(currentUser.id);
      window.alert('Successfully updated credentials!');
    } catch (error) {
      console.error('Error updating broker credentials:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/v1/fyers/deleteFyersCredentials/${id}`);
      loadBrokerDetails(currentUser.id);
      window.alert('Successfully deleted credentials!');
    } catch (error) {
      console.error('Error deleting broker credentials:', error);
    }
  };

  const handleConnect = async (id) => {
    try {
      const response = await api.post(
        `/api/v1/fyers/generateAuthCodeUrl/${id}`,
        {
          userId: currentUser.id,
        }
      );
      const { authCodeURL } = response.data;
      window.location.href = `${authCodeURL}&state_id=${id}`;
    } catch (error) {
      console.error('Error generating auth code URL:', error);
    }
  };


  return (
    <div className='p-6'>
      {brokerDetails.length === 0 ? (
        <div className='text-center'>
          <p>No brokers connected. Connect your broker.</p>
        </div>
      ) : (
        brokerDetails.map((credentials) => (
          <BrokerDetails
            key={credentials._id}
            credentials={credentials}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onConnect={handleConnect}
          />
        ))
      )}
    </div>
  );
};

export default Brokerage;
