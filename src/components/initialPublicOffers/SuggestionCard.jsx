import React, { useState } from "react";
import {
  IoMdArrowDropright,
  IoMdCreate,
  IoMdTrash,
  IoMdCheckmark,
  IoMdClose,
} from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import api from "../../config";

const SuggestionCard = ({
  logo,
  category,
  subCategory,
  change,
  title,
  image,
  cardId,
  onDelete,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  // Check if the user is an admin and the URL matches the specified path
  const isEditingAllowed =
    currentUser?.isAdmin &&
    currentUser.role === "admin" &&
    location.pathname === "/india/admin-create-ipos";

  // State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    category,
    subCategory,
    change,
    title,
  });

  // Handle change in input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle save functionality (API call for updating data)
  const handleSave = async () => {
    try {
      const response = await api.put(
        `/api/v1/IPOs/update-suggestion-card/${cardId}`,
        formData
      );
      if (response.status === 200) {
        // console.log("Card updated successfully:", response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating the card:", error);
      alert("Failed to update the card.");
    }
  };

  // Handle cancel functionality (restore original data)
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ category, subCategory, change, title });
  };

  return (
    <div className="news-table flex rounded-xl p-[6px] relative group border-2 dark:border-0">
      <div className="flex-1">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <div className="flex flex-col ml-2">
            <h2 className="text-[7px] whitespace-nowrap overflow-hidden text-ellipsis">
              {isEditing ? (
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-transparent px-1 border border-gray-300 text-[7px] outline-none w-full"
                  style={{ minWidth: "80px" }}
                />
              ) : (
                formData.category
              )}
            </h2>
            <p className="text-[8px] dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
              {isEditing ? (
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="bg-transparent px-1 border border-gray-300 text-[9px] outline-none w-full"
                  style={{ minWidth: "100px" }}
                />
              ) : (
                formData.subCategory
              )}
            </p>
          </div>
        </div>
        <div className="text-[10px] font-bold text-[#1ECB4F] whitespace-nowrap overflow-hidden text-ellipsis">
          {isEditing ? (
            <input
              type="text"
              name="change"
              value={formData.change}
              onChange={handleChange}
              className="bg-transparent px-1 border border-gray-300 text-[10px] outline-none w-full"
              style={{ minWidth: "80px" }}
            />
          ) : (
            formData.change
          )}
        </div>
        <div className="text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-transparent px-1 border border-gray-300 text-[10px] outline-none w-full"
              style={{ minWidth: "120px" }}
            />
          ) : (
            formData.title
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between ml-1">
        <div className="text-end ml-auto">
          <IoMdArrowDropright
            color={isEditing && currentUser?.isAdmin ? "#ccc" : "#1ECB4F"}
            size={25}
            style={{
              pointerEvents:
                isEditing && currentUser?.isAdmin ? "none" : "auto",
            }}
          />
        </div>
        <div>
          <img src={image} alt={title} className="" />
        </div>
      </div>

      {isEditingAllowed && !isEditing && (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100">
          <IoMdCreate
            className="cursor-pointer"
            color="#1ECB4F"
            size={20}
            onClick={() => setIsEditing(true)}
          />
          <IoMdTrash
            className="cursor-pointer"
            color="#F56565"
            size={20}
            onClick={() => onDelete(cardId)}
          />
        </div>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-100">
          <IoMdCheckmark
            className="cursor-pointer"
            color="#4CAF50"
            size={20}
            onClick={handleSave}
          />
          <IoMdClose
            className="cursor-pointer"
            color="#F56565"
            size={20}
            onClick={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;
