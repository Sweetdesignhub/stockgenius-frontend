/**
 * File: NotAvailable
 * Description: This component provides a message interface that displays dynamic text and an illustrative image, typically used when a feature or content is unavailable.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React from "react";

const NotAvailable = ({ dynamicText }) => {
  // Process the dynamicText to include inline styles for <strong> elements
  const styledText = dynamicText.replace(
    /<strong>(.*?)<\/strong>/g,
    '<strong class="text-black dark:text-white">$1</strong>'
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4">
      <div className="flex flex-col md:items-start items-center mb-4 md:mb-0">
        <span
          className="text-3xl md:text-6xl text-black dark:text-[#FFFFFF99] mb-2"
          dangerouslySetInnerHTML={{ __html: styledText }}
        />
      </div>
      <div className="flex items-center justify-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F86858af14e164e91a3cc4fdac4da3ed0"
          alt="Person with laptop"
          className="w-32 h-32 md:w-96 md:h-96"
        />
      </div>
    </div>
  );
};

export default NotAvailable;
