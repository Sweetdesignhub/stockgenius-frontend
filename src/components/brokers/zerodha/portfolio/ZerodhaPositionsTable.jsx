import React, { useEffect, useState, useMemo } from "react";
import Loading from "../../../common/Loading.jsx";
import NotAvailable from "../../../common/NotAvailable.jsx";
import { X } from "lucide-react";
import YesNoConfirmationModal from "../../../common/YesNoConfirmationModal.jsx";
import { useZerodhaData } from "../../../../contexts/ZerodhaDataContext.jsx";
import api from "../../../../config.js";

const ZerodhaPositionsTable = ({ selectedColumns, setColumnNames }) => {
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [positionToExit, setPositionToExit] = useState(null);
    const { positions = { net: [] }, loading } = useZerodhaData();

    // Use useMemo to prevent unnecessary recalculations
    const allPositions = useMemo(() => {
        return [...(positions.net || [])];
    }, [positions.net]);

    // Update column names only when allPositions changes
    useEffect(() => {
        const updateColumnNames = () => {
            if (allPositions.length > 0) {
                const excludedColumns = ["user_id"];
                const allColumnNames = Object.keys(allPositions[0] || {}).filter(
                    (columnName) => !excludedColumns.includes(columnName)
                );
                setColumnNames(allColumnNames);
            } else {
                setColumnNames([]);
            }
        };

        updateColumnNames();
    }, [allPositions, setColumnNames]);

    const handleExitPosition = (event, position) => {
        event.stopPropagation();
        setPositionToExit(position);
        setIsModalOpen(true);
    };

    const confirmExitPosition = async () => {
        if (!positionToExit) return;

        try {
            const zerodhaAccessToken = localStorage.getItem("zerodha_access_token");
            if (!zerodhaAccessToken) {
                throw new Error("No authorization token found. Please authenticate and try again.");
            }

            const response = await api.post("/api/v1/zerodha/exit-position", {
                tradingsymbol: positionToExit.tradingsymbol,
                exchange: positionToExit.exchange,
                quantity: Math.abs(positionToExit.quantity)
            }, {
                headers: { Authorization: `Bearer ${zerodhaAccessToken}` }
            });

            if (response.status === 200) {
                alert("Position exited successfully");
            } else {
                throw new Error("Failed to exit position");
            }
        } catch (error) {
            console.error("Error exiting position:", error);
            alert(`Failed to exit position: ${error.message}`);
        } finally {
            setIsModalOpen(false);
            setPositionToExit(null);
        }
    };

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

    if (!allPositions.length) {
        return (
            <NotAvailable dynamicText={"Start by taking your <strong>first position!</strong>"} />
        );
    }

    return (
        <>
            <div className="h-[55vh] overflow-auto relative">
                <div className="flex">
                    <div className="flex-grow overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-transparent sticky top-0 z-10">
                                <tr>
                                    {selectedColumns.map((columnName) => (
                                        <th
                                            key={columnName}
                                            className="px-4 py-3 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left whitespace-nowrap"
                                        >
                                            {columnName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allPositions.map((position, index) => (
                                    <tr key={`${position.tradingsymbol}-${index}`}>
                                        {selectedColumns.map((columnName) => (
                                            <td
                                                key={`${columnName}-${index}`}
                                                className={`px-4 py-4 whitespace-nowrap text-left font-semibold ${columnName === "tradingsymbol" ? "text-[#6FD4FF]" : ""
                                                    }`}
                                            >
                                                {position[columnName] ?? ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-16 flex-shrink-0 sticky right-0 bg-transparent">
                        <table className="w-full h-full border-collapse">
                            <thead className="bg-transparent sticky top-0 z-10">
                                <tr>
                                    <th className="py-5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPositions.map((position, index) => (
                                    <tr key={`action-${position.tradingsymbol}-${index}`} className="h-1">
                                        <td className="px-4 py-4">
                                            <div className="flex justify-center py-0">
                                                <button
                                                    onClick={(e) => handleExitPosition(e, position)}
                                                    className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                                                >
                                                    <X className="w-4 h-4 text-red-600 dark:text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <YesNoConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Exit Position"
                message={`Are you sure you want to exit the position: <strong>${positionToExit?.tradingsymbol}?</strong>`}
                onConfirm={confirmExitPosition}
            />
        </>
    );
};

export default ZerodhaPositionsTable;