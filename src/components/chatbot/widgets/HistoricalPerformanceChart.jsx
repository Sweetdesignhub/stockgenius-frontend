import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Register the necessary components including the Filler plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin
);

const HistoricalPerformanceChart = ({ performanceData }) => {
  if (!performanceData || performanceData.length === 0) {
    return <p className="text-gray-600">No historical data available.</p>;
  }

  // Format dates for better display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Prepare data for the chart
  const chartData = {
    labels: performanceData.map(item => formatDate(item.Date)), // Formatted Dates
    datasets: [
      {
        label: 'Close Price ()',
        data: performanceData.map(item => item.Close), // Close price as y-axis
        fill: true,
        borderColor: '#4db8ff', // Soft blue line color
        backgroundColor: 'rgba(77, 184, 255, 0.2)', // Light blue fill for the line
        pointBackgroundColor: '#4db8ff', // Light blue for points
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 5,
        hoverBackgroundColor: '#fff', // White hover effect for points
        hoverBorderColor: '#4db8ff',
      },
    ],
  };

  // Chart options with responsive handling
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Historical Performance`,
        font: { size: 20, weight: 'bold' },
        color: '#333', // Dark text for title
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#333',
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
      legend: {
        position: 'top',
        labels: {
          color: '#333', // Dark legend text
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333', // Dark color for x-axis labels
          maxRotation: 45,
          minRotation: 30,
        },
        title: {
          display: true,
          text: 'Date',
          color: '#333',
        },
      },
      y: {
        ticks: {
          color: '#333', // Dark color for y-axis labels
          callback: function(value) {
            return `${value.toFixed(2)}`;
          },
        },
        title: {
          display: true,
          text: 'Close Price',
          color: '#333',
        },
      },
    },
  };

  return (
    <div className="chart-container bg-[#f8f9fa] p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* <h3 className="text-gray-800 mb-6 text-center">Historical Performance of {performanceData[0]?.Ticker}</h3> */}
      <div className="chart-wrapper relative h-96">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HistoricalPerformanceChart;
