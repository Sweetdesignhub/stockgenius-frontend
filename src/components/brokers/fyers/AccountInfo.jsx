import React from 'react';
import AccountInfoCard from './AccountInfoCard.jsx';
import { useData } from '../../../contexts/FyersDataContext.jsx';

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
    <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between py-3 lg:py-4 space-y-6 lg:space-y-0 w-full max-w-full overflow-x-hidden page-scrollbar'>
      <div className='w-full lg:w-1/3 shrink-0'>
        <div className='flex flex-col'>
          <h1 className='font-semibold text-base sm:text-lg whitespace-nowrap overflow-hidden text-ellipsis'>Account: {profile.fy_id}</h1>
          <p className='text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis'>{profile.name}</p>
          <p className='text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis'>Email: {profile.email_id}</p>
        </div>
      </div>          <div className='w-full lg:w-2/3 flex justify-center sm:justify-end shrink-0'>
        <div className='w-[90%] sm:w-[95%] lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-[10px] place-items-center sm:place-items-end px-4 sm:px-3 lg:px-0 lg:pr-6'>
          <AccountInfoCard
            title='Funds Available'
            value={availableFunds}
            valueColor='text-green-500'
          />
          <AccountInfoCard
            title='Holdings P&L'
            value={holdingsTotalPL}
            valueColor='text-orange-500'
          />
          <AccountInfoCard
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