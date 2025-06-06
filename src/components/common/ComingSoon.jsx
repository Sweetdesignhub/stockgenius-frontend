/**
 * File: ComingSoon
 * Description: This component is used to display a "Coming Soon" message with a countdown timer. It is typically used for pages or features that are not yet available but are planned for future release. The component accepts a description prop that allows customization of the message displayed alongside the countdown timer. The countdown timer is a separate component that keeps track of time until the feature or page is available.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 * Updated by: [Your Name]
 * Updated on: 2025-05-26
 * - Update description: Modified height to fit within parent container using h-full instead of min-h-screen to prevent overflow and UI disruption.
 */

import React from "react";
import PropTypes from "prop-types";
import CountdownTimer from "./CountdownTimer";

function ComingSoon({ description }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="p-10 rounded-lg shadow-lg text-center table-main">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          Coming Soon
        </h1>
        <p className="text-lg text-gray-600 dark:text-white">{description}</p>
        <CountdownTimer />
      </div>
    </div>
  );
}

ComingSoon.propTypes = {
  description: PropTypes.string.isRequired,
};

export default ComingSoon;