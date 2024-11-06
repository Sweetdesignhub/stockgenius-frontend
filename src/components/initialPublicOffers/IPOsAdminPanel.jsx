import React, { useState } from "react";
import Input from "../common/Input";

const IPOsAdminPanel = ({
  activeTab,
  formData,
  handleChange,
  handleClear,
  handleNext,
  handleBack,
  handleSubmit,
}) => {
  console.log(formData);
  
  const initialKeyObjective = { title: "", description: "" };
  // console.log(initialKeyObjective);

  const initialAdvantage = { title: "", description: "" };
  const initialDisadvantage = { title: "", description: "" };

  const [keyObjectives, setKeyObjectives] = useState([initialKeyObjective]);
  console.log(keyObjectives);
  
  const [advantages, setAdvantages] = useState([initialAdvantage]);
  const [disadvantages, setDisadvantages] = useState([initialDisadvantage]);

  const handleKeyObjectiveChange = (index, event) => {
    const { name, value } = event.target;
    const newObjectives = [...keyObjectives];
    newObjectives[index] = { ...newObjectives[index], [name]: value };
  
    // Update local state
    setKeyObjectives(newObjectives);
  
    // Update formData to reflect changes in the parent
    handleChange({ target: { name: "keyObjectives", value: newObjectives } });
  };
  
  const handleAdvantageChange = (index, event) => {
    const { name, value } = event.target;
    const newAdvantages = [...advantages];
    newAdvantages[index] = { ...newAdvantages[index], [name]: value };
  
    // Update local state
    setAdvantages(newAdvantages);
  
    // Update formData to reflect changes in the parent
    handleChange({ target: { name: "advantages", value: newAdvantages } });
  };
  
  const handleDisadvantageChange = (index, event) => {
    const { name, value } = event.target;
    const newDisadvantages = [...disadvantages];
    newDisadvantages[index] = { ...newDisadvantages[index], [name]: value };
  
    // Update local state
    setDisadvantages(newDisadvantages);
  
    // Update formData to reflect changes in the parent
    handleChange({ target: { name: "disadvantages", value: newDisadvantages } });
  };
  

  const handleRemoveKeyObjective = (index) => {
    const newObjectives = keyObjectives.filter((_, i) => i !== index);
    setKeyObjectives(newObjectives);
  };

  const handleRemoveAdvantage = (index) => {
    const newAdvantages = advantages.filter((_, i) => i !== index);
    setAdvantages(newAdvantages);
  };

  const handleRemoveDisadvantage = (index) => {
    const newDisadvantages = disadvantages.filter((_, i) => i !== index);
    setDisadvantages(newDisadvantages);
  };

  const handleAddKeyObjective = () => {
    setKeyObjectives([...keyObjectives, { title: "", description: "" }]);
  };

  const handleAddAdvantage = () => {
    setAdvantages([...advantages, { title: "", description: "" }]);
  };

  const handleAddDisadvantage = () => {
    setDisadvantages([...disadvantages, { title: "", description: "" }]);
  };

  const handleClearAll = () => {
    // Reset form data and state variables
    handleClear(); // If this clears the basic formData
    setKeyObjectives([initialKeyObjective]);
    setAdvantages([initialAdvantage]);
    setDisadvantages([initialDisadvantage]);
  };

  const isFirstTabComplete = () => {
    // List of required fields for the first tab
    const requiredFields = [
      "logo",
      "name",
      "category",
      "exchangeType",
      "company",
      "listingDate",
      "ipoStartDate",
      "ipoEndDate",
      "sentimentScore",
      "decisionRate",
      "priceStartRange",
      "priceEndRange",
    ];

    // Check if each required field in formData has a valid, non-empty value
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-y-scroll">
        <div className="news-table w-full p-4 rounded-xl">
          <div className="border-b pb-2 border-[#FFFFFF1A]">
            <h1 className="text-[#FFFFFF] font-[poppins] font-semibold text-lg">
              IPOs Admin Panel
            </h1>
          </div>

          <div className="p-2 max-h-64 overflow-y-scroll">
            {/* First Tab - Initial Fields */}
            {activeTab === "first" && (
              <>
                {/* First Row */}
                <div className="flex space-x-2">
                  <div className="w-1/4">
                    <Input
                      label="Logo"
                      name="logo"
                      placeholder="Upload company logo"
                      value={formData.logo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="IPO Name"
                      name="name"
                      placeholder="Enter IPO name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <label
                      className="block dark:text-white text-black text-xs mb-2"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="shadow appearance-none text-sm border rounded w-full py-1 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="PAST">Past</option>
                    </select>
                  </div>
                  <div className="w-1/4">
                    <label
                      className="block dark:text-white text-black text-xs mb-2"
                     
                    >
                      Exchange Type
                    </label>
                    <select
                      id="exchangeType"
                      name="exchangeType"
                      value={formData.exchangeType}
                      onChange={handleChange}
                      className="shadow text-sm appearance-none border rounded w-full py-1 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select type
                      </option>
                      <option value="SME">SME</option>
                      <option value="DEBT">Debt</option>
                      <option value="EQUITY">Equity</option>
                    </select>
                  </div>
                </div>

                {/* Second Row */}
                <div className="flex space-x-2">
                  <div className="w-1/4">
                    <Input
                      label="Company Name"
                      name="company"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Listing Date"
                      name="listingDate"
                      type="date"
                      value={formData.listingDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="IPO Start Date"
                      name="ipoStartDate"
                      type="date"
                      value={formData.ipoStartDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="IPO End Date"
                      name="ipoEndDate"
                      type="date"
                      value={formData.ipoEndDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Third Row */}
                <div className="flex space-x-2">
                  <div className="w-1/4">
                    <Input
                      label="Sentiment Score"
                      name="sentimentScore"
                      placeholder="Enter sentiment score"
                      value={formData.sentimentScore}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Decision Rate"
                      name="decisionRate"
                      placeholder="Enter decision rate"
                      value={formData.decisionRate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Price Start Range"
                      name="priceStartRange"
                      placeholder="Enter price start range"
                      value={formData.priceStartRange}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Price End Range"
                      name="priceEndRange"
                      placeholder="Enter price end range"
                      value={formData.priceEndRange}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Fourth Row */}
                <div className="flex space-x-2">
                  <div className="w-1/4">
                    <Input
                      label="Basis of Allotment"
                      name="basisOfAllotment"
                      type="date"
                      value={formData.basisOfAllotment}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Initiation of Refunds"
                      name="initiationOfRefunds"
                      type="date"
                      value={formData.initiationOfRefunds}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Credit Shares"
                      name="creditShares"
                      type="date"
                      value={formData.creditShares}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Clear and Next Buttons */}
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleClearAll}
                    className="bg-white text-sm text-[#FF0F0F] py-1 px-3 rounded-lg"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!isFirstTabComplete()}
                    className={`bg-[#3A6FF8] text-sm text-white py-1 px-3 rounded-lg ${
                      !isFirstTabComplete()
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Second Tab - New Fields */}
            {activeTab === "second" && (
              <div className="">
                <div className="flex space-x-2">
                  <div className="w-3/4">
                    <Input
                      label="Company Description"
                      name="companyDescription"
                      placeholder="Enter company description"
                      value={formData.companyDescription}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-1/4">
                    <Input
                      label="Min Quantity"
                      name="minQuantity"
                      placeholder="Enter minimum quantity"
                      value={formData.minQuantity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  {/* Key Objectives Section */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 justify-between">
                      <h3 className="text-xs p-1">Key Objectives</h3>
                      <button
                        type="button"
                        onClick={handleAddKeyObjective}
                        className="bg-blue-500 text-lg font-bold text-white px-2 rounded"
                        aria-label="Add Key Objective"
                      >
                        +
                      </button>
                    </div>
                    {keyObjectives.map((objective, index) => (
                      <div
                        key={index}
                        className="flex space-x-2 items-baseline"
                      >
                        <div className="flex-1">
                          <Input
                            name="title"
                            placeholder="Enter objective title"
                            value={objective.title}
                            onChange={(e) => handleKeyObjectiveChange(index, e)}
                            required
                            aria-label={`Objective Title ${index + 1}`}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            name="description"
                            placeholder="Enter objective description"
                            value={objective.description}
                            onChange={(e) => handleKeyObjectiveChange(index, e)}
                            required
                            aria-label={`Objective Description ${index + 1}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyObjective(index)}
                          className="bg-red-500 text-white px-[10px] font-bold rounded py-[2px]"
                          aria-label="Remove Key Objective"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Advantages Section */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 justify-between">
                      <h3 className="text-xs p-1">Advantages</h3>
                      <button
                        type="button"
                        onClick={handleAddAdvantage}
                        className="bg-blue-500 text-lg font-bold text-white px-2 rounded"
                        aria-label="Add Advantage"
                      >
                        +
                      </button>
                    </div>
                    {advantages.map((advantage, index) => (
                      <div
                        key={index}
                        className="flex space-x-2 items-baseline"
                      >
                        <div className="flex-1">
                          <Input
                            name="title"
                            placeholder="Enter advantage title"
                            value={advantage.title}
                            onChange={(e) => handleAdvantageChange(index, e)}
                            required
                            aria-label={`Advantage Title ${index + 1}`}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            name="description"
                            placeholder="Enter advantage description"
                            value={advantage.description}
                            onChange={(e) => handleAdvantageChange(index, e)}
                            required
                            aria-label={`Advantage Description ${index + 1}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAdvantage(index)}
                          className="bg-red-500 text-white px-[10px] font-bold rounded py-[2px]"
                          aria-label="Remove Advantage"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Disadvantages Section */}
                  <div className="">
                    <div className="flex items-center gap-2 justify-between">
                      <h3 className="text-xs p-1">Disadvantages</h3>
                      <button
                        type="button"
                        onClick={handleAddDisadvantage}
                        className="bg-blue-500 text-lg font-bold text-white px-2 rounded"
                        aria-label="Add Disadvantage"
                      >
                        +
                      </button>
                    </div>
                    {disadvantages.map((disadvantage, index) => (
                      <div
                        key={index}
                        className="flex space-x-2 items-baseline"
                      >
                        <div className="flex-1">
                          <Input
                            name="title"
                            placeholder="Enter disadvantage title"
                            value={disadvantage.title}
                            onChange={(e) => handleDisadvantageChange(index, e)}
                            required
                            aria-label={`Disadvantage Title ${index + 1}`}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            name="description"
                            placeholder="Enter disadvantage description"
                            value={disadvantage.description}
                            onChange={(e) => handleDisadvantageChange(index, e)}
                            required
                            aria-label={`Disadvantage Description ${index + 1}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDisadvantage(index)}
                          className="bg-red-500 text-white px-[10px] font-bold rounded py-[2px]"
                          aria-label="Remove Disadvantage"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear and Back Buttons */}
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleBack}
                    className="bg-[#3A6FF8] text-sm text-white py-1 px-3 rounded-lg"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="bg-white text-sm text-[#FF0F0F] py-1 px-3 rounded-lg"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#3A6FF8] text-sm text-white py-1 px-3 rounded-lg"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPOsAdminPanel;
