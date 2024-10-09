import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../config";

const ZerodhaDataContext = createContext();

export function ZerodhaDataProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [holdings, setHoldings] = useState([]);
    const [funds, setFunds] = useState({ fund_limit: [] });
    const [positions, setPositions] = useState({
        net: [],
        day: []
    });
    const [trades, setTrades] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const { currentUser } = useSelector((state) => state.user);

    const transformFundsData = (zerodhaFunds) => {
        const fundEntries = [];
        let id = 1;

        // Helper to add entry if the field exists
        const addEntry = (title, equityValue, commodityValue) => {
            if (equityValue !== undefined || commodityValue !== undefined) {
                fundEntries.push({
                    id: id++,
                    title,
                    equityAmount: equityValue || 0,
                    commodityAmount: commodityValue || 0
                });
            }
        };

        const { equity, commodity } = zerodhaFunds;

        // Add net values
        addEntry('Net Value', equity?.net, commodity?.net);

        // Add available funds
        if (equity?.available || commodity?.available) {
            addEntry('Adhoc Margin', equity?.available?.adhoc_margin, commodity?.available?.adhoc_margin);
            addEntry('Cash', equity?.available?.cash, commodity?.available?.cash);
            addEntry('Opening Balance', equity?.available?.opening_balance, commodity?.available?.opening_balance);
            addEntry('Live Balance', equity?.available?.live_balance, commodity?.available?.live_balance);
            addEntry('Collateral', equity?.available?.collateral, commodity?.available?.collateral);
            addEntry('Intraday Payin', equity?.available?.intraday_payin, commodity?.available?.intraday_payin);
        }

        // Add utilized funds
        if (equity?.utilised || commodity?.utilised) {
            addEntry('Debits', equity?.utilised?.debits, commodity?.utilised?.debits);
            addEntry('Exposure', equity?.utilised?.exposure, commodity?.utilised?.exposure);
            addEntry('M2M Realized', equity?.utilised?.m2m_realised, commodity?.utilised?.m2m_realised);
            addEntry('M2M Unrealized', equity?.utilised?.m2m_unrealised, commodity?.utilised?.m2m_unrealised);
            addEntry('Option Premium', equity?.utilised?.option_premium, commodity?.utilised?.option_premium);
            addEntry('Payout', equity?.utilised?.payout, commodity?.utilised?.payout);
            addEntry('SPAN', equity?.utilised?.span, commodity?.utilised?.span);
            addEntry('Holding Sales', equity?.utilised?.holding_sales, commodity?.utilised?.holding_sales);
            addEntry('Turnover', equity?.utilised?.turnover, commodity?.utilised?.turnover);
            addEntry('Liquid Collateral', equity?.utilised?.liquid_collateral, commodity?.utilised?.liquid_collateral);
            addEntry('Stock Collateral', equity?.utilised?.stock_collateral, commodity?.utilised?.stock_collateral);
            addEntry('Delivery', equity?.utilised?.delivery, commodity?.utilised?.delivery);
        }

        return { fund_limit: fundEntries };
    };

    const fetchData = async () => {
        try {

            const zerodhaAccessToken = localStorage.getItem("zerodha_access_token");

            if (currentUser && zerodhaAccessToken) {
                const headers = { Authorization: `Bearer ${zerodhaAccessToken}` };
                const response = await api.get(
                    `/api/v1/zerodha/fetchAllZerodhaUserDetails/${currentUser.id}`,
                    { headers }
                );

                console.log(response.data[0].holdings);
                

                if (response.data && response.data.length > 0) {
                    const data = response.data[0];
                    // console.log(data);
                    

                    setProfile(data.profile || null);
                    // Transform funds data to match Fyers structure
                    setFunds(transformFundsData(data.funds || {}));
                    setHoldings(data.holdings || []);
                    setPositions({
                        net: data.positions?.net || [],
                        day: data.positions?.day || []
                    });
                    setTrades(data.trades || []);
                    setOrders(data.orders || []);
                }
            }
        } catch (error) {
            console.error("Error fetching Zerodha data:", error);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            await fetchData();
            setLoading(false);
        };

        fetchAllData();

        const dataInterval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => {
            clearInterval(dataInterval);
        };
    }, [currentUser]);

    return (
        <ZerodhaDataContext.Provider
            value={{
                profile,
                holdings,
                funds,
                positions,
                trades,
                orders,
                loading
            }}
        >
            {children}
        </ZerodhaDataContext.Provider>
    );
}

export function useZerodhaData() {
    return useContext(ZerodhaDataContext);
}