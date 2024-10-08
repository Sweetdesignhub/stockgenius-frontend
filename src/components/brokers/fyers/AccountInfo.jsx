import React from 'react';
import { useData } from '../../../contexts/FyersDataContext.jsx';
import Cards from '../Cards.jsx';

function AccountInfo() {
  const {
    profile = {},
    holdings = {},
    funds = { fund_limit: [{}] },
    positions = { overall: {} },
    loading,
  } = useData();

  const holdingsTotalPL = holdings?.overall?.total_pl?.toFixed(2) || "0.00";
  const positionTotalPL = positions?.overall?.pl_total?.toFixed(2) || "0.00";
  const availableFunds =
    funds?.fund_limit?.[9]?.equityAmount?.toFixed(2) || "0.00";

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return (
      <p className='text-center p-3'>
        No profile data available. You need to select your broker...
      </p>
    );
  }

  return (
    <div className='flex items-center justify-between py-5'>
      <div className='flex-1'>
        <div className='flex flex-col'>
          <h1 className='font-semibold'>Account: {profile.fy_id}</h1>
          <p>{profile.name}</p>
          <p>Email: {profile.email_id}</p>
          {/* Add more profile data as needed */}
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex justify-around'>
          <Cards
            title='Funds Available'
            value={availableFunds}
            valueColor='text-green-500'
          />
          <Cards
            title='Holdings P&L'
            value={holdingsTotalPL}
            valueColor='text-orange-500'
          />
          <Cards
            title='Positions P&L'
            value={positionTotalPL}
            valueColor='text-red-500'
          />
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;