import React, { useEffect, useState, useCallback } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import api from "../../config";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import Loading from "../common/Loading";
import SuggestionCard from "./SuggestionCard";

function IPOUpdatedList({
  ipoData,
  setIpoData,
  ipoRecommendedData,
  setIpoRecommendedData,
  loading,
  error,
  columns,
  fetchData,
  fetchRecommendedData,
}) {
  const [editableIpo, setEditableIpo] = useState(null);
  const [editableIpoId, setEditableIpoId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableValues, setEditableValues] = useState({});
  const [isRecommendedView, setIsRecommendedView] = useState(false);

  useEffect(() => {
    fetchData();
    fetchRecommendedData();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderCell = useCallback(
    (columnName, ipo, isEditing) => {
      const value = isEditing ? editableValues[columnName] : ipo[columnName];

      if (columnName === "logo") {
        return <img src={value} alt="Company Logo" className="w-12 h-10" />;
      } else if (
        columnName === "sentimentScore" &&
        typeof value === "object" &&
        value !== null
      ) {
        return value.$numberDecimal || "";
      } else if (typeof value === "object") {
        return <div>{JSON.stringify(value)}</div>;
      } else if (isEditing) {
        // Handle date input
        const dateColumns = [
          "ipoStartDate",
          "ipoEndDate",
          "listingDate",
          "basisOfAllotment",
          "initiationOfRefunds",
          "creditShares",
        ];

        if (dateColumns.includes(columnName)) {
          return (
            <input
              type="date"
              value={value ? value.split("T")[0] : ""} // Format to YYYY-MM-DD for date input
              onChange={(e) =>
                setEditableValues((prev) => ({
                  ...prev,
                  [columnName]: e.target.value,
                }))
              } // Update state on change
              className="border border-gray-300 text-black rounded-md px-2 py-1"
            />
          );
        }

        // Handle dropdowns
        if (columnName === "category") {
          return (
            <select
              value={value}
              onChange={(e) =>
                setEditableValues((prev) => ({
                  ...prev,
                  [columnName]: e.target.value,
                }))
              }
              className="border border-gray-300 text-black rounded-md px-2 py-1"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="PAST">Past</option>
            </select>
          );
        }

        if (columnName === "exchangeType") {
          return (
            <select
              value={value}
              onChange={(e) =>
                setEditableValues((prev) => ({
                  ...prev,
                  [columnName]: e.target.value,
                }))
              }
              className="border border-gray-300 text-black rounded-md px-2 py-1"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="SME">SME</option>
              <option value="DEBT">Debt</option>
              <option value="EQUITY">Equity</option>
            </select>
          );
        }

        // Other fields
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setEditableValues((prev) => ({
                ...prev,
                [columnName]: e.target.value,
              }))
            }
            className="border border-gray-300 text-black rounded-md px-2 py-1"
          />
        );
      }

      // Format the date for display in non-editing mode
      const dateColumns = [
        "ipoStartDate",
        "ipoEndDate",
        "listingDate",
        "basisOfAllotment",
        "initiationOfRefunds",
        "creditShares",
      ];

      if (dateColumns.includes(columnName)) {
        return formatDate(value);
      }

      return value || "";
    },
    [editableValues]
  );

  const handleEditClick = (ipo) => {
    setEditableIpo({ ...ipo });
  };

  const handleEditClickTable = (ipo) => {
    if (editableIpoId === ipo._id) {
      setEditableIpoId(null);
      setIsEditing(false);
    } else {
      setEditableIpoId(ipo._id);
      setIsEditing(true);
      setEditableValues(ipo);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Split the name string to determine nested property paths
    const keys = name.split(/[\[\]\.]+/).filter((key) => key);
    const newEditableIpo = { ...editableIpo };

    // Use a reference to traverse and set value at the correct path
    let ref = newEditableIpo;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
      ref = ref[key];
    }

    // Ensure the last key points to the correct value
    ref[keys[keys.length - 1]] = value;

    setEditableIpo(newEditableIpo);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/v1/IPOs/update-ipo/${editableIpo._id}`, editableIpo);
      setIpoData((prev) =>
        prev.map((ipo) => (ipo._id === editableIpo._id ? editableIpo : ipo))
      );
      setEditableIpo(null);
      setEditableIpoId(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating IPO data:", error);
      setError("Failed to update IPO data. Please try again later.");
    }
  };

  const handleUpdateTable = async () => {
    // console.log("Updated values:", editableValues);
    try {
      await api.put(
        `/api/v1/IPOs/update-ipo/${editableValues._id}`,
        editableValues
      );
      setIpoData((prev) =>
        prev.map((ipo) =>
          ipo._id === editableValues._id ? editableValues : ipo
        )
      );
      setEditableIpo(null);
      setEditableIpoId(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating IPO data:", error);
      setError("Failed to update IPO data. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this IPO?"
    );
    if (confirmDelete) {
      try {
        await api.delete(`/api/v1/IPOs/delete-ipo/${id}`);
        setIpoData((prev) => prev.filter((ipo) => ipo._id !== id));
      } catch (error) {
        console.error("Error deleting IPO:", error);
        setError("Failed to delete IPO. Please try again later.");
      }
    }
  };

  const handleDeleteSuggestion = async (cardId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this suggestion?");
    if (!confirmDelete) return; // Exit function if the user cancels
  
    try {
      await api.delete(`/api/v1/IPOs/delete-suggestion-card/${cardId}`);
      setIpoRecommendedData((prev) => prev.filter((ipo) => ipo._id !== cardId));
    } catch (error) {
      console.error("Error deleting IPO:", error);
      alert("Failed to delete IPO. Please try again later.");
    }
  };
  
  
  

  if (loading) {
    return (
      <div className="text-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[#FFFFFF]">
        NO Ipos to display, please add IPO
      </div>
    );
  }

  return (
    <div>
      <div className="pb-3 px-6 border-collapse border-b border-[#FFFFFF1A] flex justify-between">
        <h1 className="text-[#FFFFFF] font-[poppins] font-semibold text-lg">
          IPOs Updated List
        </h1>
        <button
          onClick={() => setIsRecommendedView(!isRecommendedView)}
          className="text-[#FFFFFF]  text-lg bg-[#3A6FF8] px-5 rounded-lg cursor-pointer"
        >
          {isRecommendedView ? "IPO Data" : "Recommended IPOs"}
        </button>
      </div>

      {isRecommendedView ? (
        <div className="overflow-scroll max-h-64 py-1">
          {ipoRecommendedData.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {ipoRecommendedData.map((card, index) => (
                <div className="flex-shrink-0 w-[calc(20%-8px)]" key={index}>
                  <SuggestionCard
                    cardId={card._id}
                    logo={card.logo}
                    category={card.category}
                    subCategory={card.subCategory}
                    change={card.change}
                    title={card.title}
                    image={card.graph}
                    onDelete={handleDeleteSuggestion}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center w-96 p-4 text-gray-500">
              No suggestion available.
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-scroll max-h-64 py-1">
          {editableIpo ? (
            <div className="py-2 px-6 rounded-lg">
              <form className="overflow-scroll max-h-56 w-full">
                {/* Company Name */}
                <div className="mb-4">
                  <h1 className="text-xl font-semibold uppercase">
                    {editableIpo.company || ""}
                  </h1>
                </div>
                {/* Company Description as Textarea */}
                <div className="mt-4 mb-4">
                  <textarea
                    name="companyDescription"
                    value={editableIpo.companyDescription || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded  bg-transparent text-[#B7E5FF] placeholder-[#B7E5FF]"
                    placeholder="Enter Company Description"
                    rows={4} // Adjust row count as needed
                  />
                </div>

                {/* Three-column layout for editable key objectives, advantages, and disadvantages */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  {/* Editable Key Objectives */}
                  <div className="sm:w-1/3 w-full table-main rounded-lg p-3">
                    <h1 className="text-sm uppercase mb-3 font-semibold">
                      KEY OBJECTIVES
                    </h1>
                    <ol className="list-decimal pl-4">
                      {editableIpo.keyObjectives.map((objective, index) => (
                        <li
                          key={index}
                          className="text-[9px] text-[#6FD4FF] mb-1"
                        >
                          <input
                            type="text"
                            name={`keyObjectives[${index}].title`}
                            value={objective.title}
                            onChange={handleChange}
                            className="w-full border p-1 rounded bg-transparent text-[#6FD4FF] text-sm font-semibold"
                            placeholder="Objective Title"
                          />
                          <textarea
                            name={`keyObjectives[${index}].description`}
                            value={objective.description}
                            onChange={handleChange}
                            className="w-full border p-1 rounded bg-transparent dark:text-[#FFFFFFCC] text-black mt-1 text-xs"
                            placeholder="Objective Description"
                          />
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Editable Advantages */}
                  <div className="sm:w-1/3 w-full table-main rounded-lg p-3">
                    <h1 className="text-sm uppercase mb-3 font-semibold">
                      ADVANTAGES
                    </h1>
                    <ol className="list-decimal pl-4">
                      {editableIpo.advantages.map((advantage, index) => (
                        <li
                          key={index}
                          className="text-[9px] text-[#6FD4FF] mb-1"
                        >
                          <input
                            type="text"
                            name={`advantages[${index}].title`}
                            value={advantage.title}
                            onChange={handleChange}
                            className="w-full border p-1 rounded bg-transparent text-[#6FD4FF] text-sm font-semibold"
                            placeholder="Advantage Title"
                          />
                          <textarea
                            name={`advantages[${index}].description`}
                            value={advantage.description}
                            onChange={handleChange}
                            className="w-full border p-1 rounded bg-transparent dark:text-[#FFFFFFCC] text-black mt-1 text-xs"
                            placeholder="Advantage Description"
                          />
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Editable Disadvantages */}
                  <div className="sm:w-1/3 w-full table-main rounded-lg p-3">
                    <h1 className="text-sm uppercase mb-3 font-semibold">
                      DISADVANTAGES
                    </h1>
                    <ol className="list-decimal pl-4">
                      {editableIpo.disadvantages.map((disadvantage, index) => (
                        <li
                          key={index}
                          className="text-[9px] text-[#DC3C3C] mb-1"
                        >
                          <input
                            type="text"
                            name={`disadvantages[${index}].title`}
                            value={disadvantage.title}
                            onChange={handleChange}
                            className="w-full border rounded p-1 bg-transparent text-[#DC3C3C] text-sm font-semibold"
                            placeholder="Disadvantage Title"
                          />
                          <textarea
                            name={`disadvantages[${index}].description`}
                            value={disadvantage.description}
                            onChange={handleChange}
                            className="w-full border rounded p-1 bg-transparent dark:text-[#FFFFFFCC] text-black mt-1 text-xs"
                            placeholder="Disadvantage Description"
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Update Button */}
                <div className="flex gap-5 items-center justify-center mt-4">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className=" p-2 bg-blue-600 text-white rounded "
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditableIpo(null);
                    }}
                    className=" bg-red-500 text-white  p-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Close Button */}
              <button
                onClick={() => {
                  setEditableIpo(null);
                }}
                className="p-2 w-[5%] bg-transparent flex justify-center items-center"
              >
                <MdKeyboardArrowRight size={25} className="rotate-180" />
              </button>
            </div>
          ) : (
            <div className="flex">
              {/* Main Table for Data */}
              <div className="w-[88%] overflow-scroll">
                <table className="w-full ">
                  <thead>
                    <tr>
                      {columns.map((columnName) => (
                        <th
                          key={columnName}
                          className="px-4 capitalize whitespace-nowrap py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left"
                        >
                          {columnName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ipoData.length > 0 ? (
                      ipoData.map((ipo, index) => (
                        <tr key={index}>
                          {columns.map((columnName) => (
                            <td
                              key={`${columnName}-${index}`}
                              className={`px-4 h-12 whitespace-nowrap font-semibold py-1 ${
                                columnName === "name" ? "text-[#6FD4FF]" : ""
                              }`}
                            >
                              {renderCell(
                                columnName,
                                ipo,
                                editableIpoId === ipo._id
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-4 text-[#FFFFFF99]"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Actions Column */}
              <div className="w-[12%] sticky right-0">
                <table className="w-full border-collapse border-t pb-3 border-[#FFFFFF1A]">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 font-[poppins] text-sm font-normal dark:text-[#FFFFFF99] text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipoData.length > 0 ? (
                      ipoData.map((ipo, index) => (
                        <tr key={index}>
                          <td className="px-4 h-12 py-1 text-sm font-semibold flex justify-between items-center gap-3">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleEditClickTable(ipo)}
                                className="text-[#FFA629] mr-4"
                              >
                                {editableIpoId === ipo._id && isEditing ? (
                                  <p className="text-lg  text-red-500">x</p> // Show cancel icon when editing
                                ) : (
                                  <FaPencil /> // Show pencil icon when not editing
                                )}
                              </button>

                              <button className=" text-red-500 mr-2">
                                {editableIpoId === ipo._id && isEditing ? (
                                  <FaCheck
                                    onClick={handleUpdateTable}
                                    color="#3A6FF8"
                                    size={16}
                                  />
                                ) : (
                                  <FaRegTrashAlt
                                    onClick={() =>
                                      handleDelete(ipoData[index]._id)
                                    }
                                  />
                                )}
                              </button>
                            </div>
                            <MdKeyboardArrowRight
                              size={20}
                              onClick={() => handleEditClick(ipoData[index])}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="text-center py-4 text-[#FFFFFF99]">
                          No actions available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IPOUpdatedList;
