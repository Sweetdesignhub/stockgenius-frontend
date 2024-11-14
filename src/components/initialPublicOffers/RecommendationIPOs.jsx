import React, { useState } from "react";
import Input from "../common/Input";
import { useSelector } from "react-redux";
import api from "../../config";

function RecommendationIPOs() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    userId:currentUser.id,
    logo: "",
    title: "",
    category: "",
    subCategory: "",
    change: "",
  });
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClear = () => {
    setFormData({
      logo: "",
      title: "",
      category: "",
      subCategory: "",
      change: "",
    });
    setError(null); // Reset error
    setSuccess(null); // Reset success
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await api.post(
        `/api/v1/IPOs/create-suggestion-card/${currentUser.id}`,
        formData
      );

      if (response.status === 200) {
        setSuccess("IPO suggestion card created successfully!");
        setFormData({
          logo: "",
          title: "",
          category: "",
          subCategory: "",
          change: "",
        });
      }
    } catch (error) {
      setError("Failed to submit IPO suggestion. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="news-table rounded-xl p-4 ">
      <div className="border-b pb-2 border-[#FFFFFF1A]">
        <h1 className="text-[#FFFFFF] font-[poppins] font-semibold text-lg">
          Recommendation IPOs
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-2 max-h-64 overflow-y-scroll">
        <div className="flex space-x-4  ">
          <div className="w-1/2">
            <Input
              label="Logo"
              name="logo"
              placeholder="Upload logo"
              value={formData.logo}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="w-1/2">
            <Input
              label="IPO Name"
              name="title"
              placeholder="Enter name"
              value={formData.title}
              onChange={handleChange}
              required={true}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <Input
              label="Category"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              required={true}
            />
          </div>
          <div className="w-1/2">
            <Input
              label="Sub Category"
              name="subCategory"
              placeholder="Enter subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              required={true}
            />
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <Input
              label="Percentage"
              name="change"
              placeholder="Enter change"
              value={formData.change}
              onChange={handleChange}
              required={true}
            />
          </div>
        </div>

        {/* Buttons Section */}
        <div className=" flex justify-center space-x-4 mt-4">
          <button
            type="button"
            onClick={handleClear}
            className="bg-white text-sm text-[#FF0F0F] py-1 px-3 rounded-lg dark:border-0 border"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading} // Disable the submit button while loading
            className="bg-[#3A6FF8] text-sm text-white py-1 px-3 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Display success or error messages */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {success && <div className="text-green-500 text-center mt-4">{success}</div>}
    </div>
  );
}

export default RecommendationIPOs;
