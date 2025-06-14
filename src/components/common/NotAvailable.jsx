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
import currencyBg from "../../assets/currency.png";

const NotAvailable = ({ dynamicText }) => {
  // Process the dynamicText to include inline styles for <strong> elements        
  const styledText = dynamicText.replace(
    /<strong>(.*?)<\/strong>/g,
    '<span class="text-black dark:text-[rgba(255,255,255,0.9)] font-bold">$1</span>'
  );

  return (  <div 
      className="min-h-[44vh] 320:min-h-[50vh] flex flex-col glow md:flex-row items-start justify-start p-8 rounded-xl border relative overflow-hidden"
    >{/* Background Image */}
      <img 
        src={currencyBg}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.2,
          mixBlendMode: 'lighten',
          zIndex: 0,
        }}
        alt=""
      />
      <div className="relative md:absolute left-8 320:left-0 320:px-4 md:top-1/2 md:-translate-y-1/2 z-20 w-full md:w-[60%] lg:w-[50%] 320:mb-4 md:mb-0">
        <span
          className="text-lg 320:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-black dark:text-[rgba(255,255,255,0.6)] font-semibold break-words block text-center md:text-left"
          dangerouslySetInnerHTML={{ __html: styledText }}
        />
      </div>
      <div className="relative md:absolute right-8 320:right-0 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center w-full md:w-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F86858af14e164e91a3cc4fdac4da3ed0"
          alt="Person with laptop"
          className="w-28 h-28 320:w-32 320:h-32 sm:w-40 sm:h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default NotAvailable;
