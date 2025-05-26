import React, { useEffect, useState } from "react";
import RecommendationIPOs from "../../components/initialPublicOffers/RecommendationIPOs";
import IPOsAdminPanel from "../../components/initialPublicOffers/IPOsAdminPanel";
import IPOUpdatedList from "../../components/initialPublicOffers/IPOUpdatedList";
import { useTheme } from "../../contexts/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../config";

function CreateIpos() {
  const { currentUser } = useSelector((state) => state.user);
  const [ipoData, setIpoData] = useState([]);
  const [ipoRecommendedData, setIpoRecommendedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({
    userId: currentUser?.id,
    logo: "",
    name: "",
    category: "",
    exchangeType: "",
    company: "",
    listingDate: "",
    ipoStartDate: "",
    ipoEndDate: "",
    sentimentScore: "",
    decisionRate: "",
    priceStartRange: "",
    priceEndRange: "",
    basisOfAllotment: "",
    initiationOfRefunds: "",
    creditShares: "",
    minQuantity: "",
    companyDescription: "",
    keyObjectives: [{ title: "", description: "" }],
    advantages: [{ title: "", description: "" }],
    disadvantages: [{ title: "", description: "" }],
  });

  const [activeTab, setActiveTab] = useState("first");
  const { theme } = useTheme();

  // console.log(currentUser);

  const darkThemeStyle = {
    boxShadow:
      "0px 9.67px 29.02px 0px #497BFFB2 inset, 0px 9.67px 38.7px 0px #3F4AAF80",
    borderImageSource:
      "linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), " +
      "linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), " +
      "linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)",
    background:
      "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)",
  };

  const containerStyle =
    theme === "dark" ? darkThemeStyle : { backgroundColor: "#FFFFFF" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Clear fields in the active tab
  const handleClear = () => {
    setFormData((prevData) => ({
      ...prevData,
      ...(activeTab === "first"
        ? {
            logo: "",
            name: "",
            category: "",
            exchangeType: "",
            company: "",
            listingDate: "",
            ipoStartDate: "",
            ipoEndDate: "",
            sentimentScore: "",
            decisionRate: "",
            priceStartRange: "",
            priceEndRange: "",
            basisOfAllotment: "",
            initiationOfRefunds: "",
            creditShares: "",
          }
        : {
            minQuantity: "",
            companyDescription: "",
            keyObjectives: [{ title: "", description: "" }],
            advantages: [{ title: "", description: "" }],
            disadvantages: [{ title: "", description: "" }],
          }),
    }));
  };

  // Check if all fields in the first tab are filled
  const isFirstTabComplete = () => {
    const requiredFields = [
      "logo",
      "name",
      "category",
      "exchangeType",
      "company",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  const excludedColumns = [
    "_id",
    "userId",
    "createdAt",
    "updatedAt",
    "__v",
    "companyDescription",
    "keyObjectives",
    "advantages",
    "disadvantages",
  ];

  const filterColumns = (data) => {
    if (data.length > 0) {
      const allColumns = Object.keys(data[0]);
      return allColumns.filter((column) => !excludedColumns.includes(column));
    }
    return [];
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/v1/IPOs/get-all-ipos`);
      const data = response.data.data || [];
      setIpoData(data);
      setColumns(filterColumns(data));
    } catch (error) {
      console.error("Error fetching IPO data:", error);
      setError("Failed to fetch IPO data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedData = async () => {
    try {
      const response = await api.get(`/api/v1/IPOs/get-all-suggestion-cards`);
      // console.log(response);

      const data = response.data.data || [];
      setIpoRecommendedData(data);
    } catch (error) {
      console.error("Error fetching IPO data:", error);
      setError("Failed to fetch IPO data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRecommendedData();
  }, []);

  // Navigate between tabs
  const handleNext = () => {
    if (isFirstTabComplete()) setActiveTab("second");
  };
  const handleBack = () => setActiveTab("first");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Check if userId is set in formData
    if (!formData.userId) {
      setFormData((prevData) => ({ ...prevData, userId: currentUser?.id }));
    }
    try {
      const response = await api.post(
        `/api/v1/IPOs/create-ipo/${currentUser.id}`,
        formData
      );

      // console.log("Form submitted successfully:", response.data);
      setStatusMessage({ type: "success", text: "IPO created successfully!" });
      // Optionally reset formData after successful submission
      setFormData({
        userId: currentUser?.id,
        logo: "",
        name: "",
        category: "",
        exchangeType: "",
        company: "",
        listingDate: "",
        ipoStartDate: "",
        ipoEndDate: "",
        sentimentScore: "",
        decisionRate: "",
        priceStartRange: "",
        priceEndRange: "",
        basisOfAllotment: "",
        initiationOfRefunds: "",
        creditShares: "",
        minQuantity: "",
        companyDescription: "",
        keyObjectives: [{ title: "", description: "" }],
        advantages: [{ title: "", description: "" }],
        disadvantages: [{ title: "", description: "" }],
      });
      setActiveTab("first");
      fetchData();
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: "Error submitting form. Please refresh and try again.",
      });
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen px-2 sm:px-4 lg:px-32 py-2 sm:py-4 lg:py-6 relative">
      {/* Background images with responsive positioning */}
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 left-0 w-1/4 md:w-auto hidden md:block"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F6e45c8cb7d324c3fba73ef975dbfec87"
        alt="bull"
      />
      <img
        loading="lazy"
        className="absolute -z-10 top-1/2 transform -translate-y-1/2 right-0 w-1/4 md:w-auto hidden md:block"
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F4fb1f7b4c9434cd8ab2b4f76469e60ab"
        alt="bear"
      />

      {/* Main content container */}
      <div
        className={`${
          theme === "dark" ? "news-table" : "bg-[#F2F5FF]"
        } min-h-[calc(100vh-2rem)] p-2 sm:p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col`}
      >
        {/* Responsive layout for admin panel and recommendations */}
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 mb-2 sm:mb-4 lg:mb-6">
          <div className="w-full lg:w-3/4">
            <IPOsAdminPanel
              statusMessage={statusMessage}
              formData={formData}
              activeTab={activeTab}
              handleChange={handleChange}
              handleClear={handleClear}
              handleNext={handleNext}
              handleBack={handleBack}
              handleSubmit={handleSubmit}
              isNextDisabled={!isFirstTabComplete()}
            />
          </div>
          <div className="w-full lg:w-1/4 mt-2 lg:mt-0">
            <RecommendationIPOs />
          </div>
        </div>

        {/* IPO Updated List Table */}
        <div
          style={containerStyle}
          className="flex-1 rounded-lg p-1 sm:p-2 lg:p-4 overflow-hidden"
        >
          <IPOUpdatedList
            setIpoRecommendedData={setIpoRecommendedData}
            fetchRecommendedData={fetchRecommendedData}
            ipoRecommendedData={ipoRecommendedData}
            setIpoData={setIpoData}
            fetchData={fetchData}
            ipoData={ipoData}
            loading={loading}
            error={error}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateIpos;
