import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useZerodhaData } from "../../../../contexts/ZerodhaDataContext.jsx";

const ZerodhaTradesTable = ({ selectedColumns, setColumnNames }) => {
    const [error, setError] = useState(null);
    const { trades = [], loading } = useZerodhaData();
    const tradesData = trades || [];

    useEffect(() => {
        if (tradesData.length > 0) {
            const excludedColumns = ["message", "user_id"];
            const allColumnNames = Object.keys(tradesData[0] || {}).filter(
                (columnName) => !excludedColumns.includes(columnName)
            );
            setColumnNames(allColumnNames);
        } else {
            setColumnNames([]);
        }
    }, [tradesData, setColumnNames]);

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center p-4">
                <Loading />
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    if (!tradesData || tradesData.length === 0) {
        return (
            <NotAvailable
                dynamicText={"The <strong>best</strong> time to start is now!"}
            />
        );
    }

    const renderCellContent = (value) => {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value != null ? value.toString() : '';
    };

    return (
        <div className="h-[55vh] overflow-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        {selectedColumns.map((columnName) => (
                            <th
                                key={columnName}
                                className="px-4 whitespace-nowrap capitalize py-3 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
                            >
                                {columnName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tradesData.map((trade, index) => (
                        <tr key={index} className="text-center">
                            {selectedColumns.map((columnName) => (
                                <td
                                    key={`${columnName}-${index}`}
                                    className="px-4 whitespace-nowrap text-left font-semibold py-4"
                                >
                                    {renderCellContent(trade[columnName])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ZerodhaTradesTable;