import React from 'react';
import { useZerodhaData } from '../../../contexts/ZerodhaDataContext.jsx';
import Cards from '../Cards.jsx';

function ZerodhaAccountInfo() {
    const {
        profile = {},
        holdings = [],
        funds = { fund_limit: [] },
        positions = { net: [], day: [] },
        loading,
    } = useZerodhaData();

    // Calculate total P&L from holdings
    const holdingsTotalPL = holdings.reduce((total, holding) => {
        return total + (holding.pnl || 0);
    }, 0).toFixed(2);

    // Calculate total P&L from net positions
    const positionTotalPL = (
        positions.net.reduce((total, position) => total + (position.pnl || 0), 0)
        //        positions.day.reduce((total, position) => total + (position.pnl || 0), 0)
    ).toFixed(2);

    // Get available funds from equity segment
    const availableFunds = funds.fund_limit
        .find(fund => fund.title === 'Live Balance')?.equityAmount?.toFixed(2) || "0.00";


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
                    <h1 className='font-semibold'>Account: {profile.userId}</h1>
                    <p>{profile.userName}</p>
                    <p>Email: {profile.email}</p>
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

export default ZerodhaAccountInfo;