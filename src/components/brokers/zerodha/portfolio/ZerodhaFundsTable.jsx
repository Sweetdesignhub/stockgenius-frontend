import React, { useEffect, useState } from "react";
import Loading from "../../../common/Loading";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { useZerodhaData } from "../../../../contexts/ZerodhaDataContext.jsx";

const ZerodhaFundsTable = ({ selectedColumns, setColumnNames }) => {
    const [error, setError] = useState(null);
    const { funds = { fund_limit: [{}] }, loading } = useZerodhaData();
    const fundsData = funds.fund_limit || [];

    useEffect(() => {
        if (fundsData.length > 0) {
            const excludedColumns = ["id"];
            const allColumnNames = Object.keys(fundsData[0] || {}).filter(
                (columnName) => !excludedColumns.includes(columnName)
            );
            setColumnNames(allColumnNames);
        } else {
            setColumnNames([]);
        }
    }, [fundsData, setColumnNames]);

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

    if (!fundsData || fundsData.length === 0) {
        return (
            <NotAvailable
                dynamicText={"Opportunities are <strong>endless</strong>"}
            />
        );
    }

    return (
        <div className="h-[55vh] overflow-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        {selectedColumns.map((columnName) => (
                            <th
                                key={columnName}
                                className="px-4 capitalize whitespace-nowrap overflow-hidden py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
                            >
                                {columnName.replace(/([A-Z])/g, ' $1').trim()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {fundsData.map((fund, index) => (
                        <tr key={index}>
                            {selectedColumns.map((columnName) => (
                                <td
                                    key={`${columnName}-${index}`}
                                    className={`px-4 whitespace-nowrap overflow-hidden font-semibold py-4 ${columnName === "title" ? "text-[#6FD4FF]" : ""}`}
                                >
                                    {fund[columnName]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ZerodhaFundsTable;