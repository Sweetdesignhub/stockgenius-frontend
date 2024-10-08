import React from "react";

const ZerodhaPortfolio = ({ data, columns }) => {
    if (!data || data.length === 0) {
        return <div className="text-center p-4">No data available</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                className="px-4 py-2 bg-gray-50 border-b text-left"
                            >
                                {column.Header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-gray-50 transition-colors duration-200"
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.accessor}
                                    className="border-b px-4 py-2 text-sm"
                                >
                                    {row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ZerodhaPortfolio;