import React from "react";
import { IoMdArrowDropright } from "react-icons/io";

const SuggestionCard = ({
  logo,
  category,
  subCategory,
  change,
  title,
  image,
}) => {
  return (
    <div className="news-table flex rounded-xl p-[6px]">
      <div className="flex-1">
        {" "}
     
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <div className="flex flex-col ml-2">
            <h2 className="text-[7px] whitespace-nowrap overflow-hidden text-ellipsis">
              {category}
            </h2>
            <p className="text-[9px] text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
              {subCategory}
            </p>
          </div>
        </div>
        <div className="text-[10px] font-bold text-[#1ECB4F] whitespace-nowrap overflow-hidden text-ellipsis">
          {change}
        </div>
        <div className="text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </div>{" "}
       
      </div>

      <div className="flex flex-col justify-between ml-1">
        <div className="text-end ml-auto">
          <IoMdArrowDropright color="#1ECB4F" size={25} />
        </div>
        <div>
          <img src={image} alt={title} className="" />
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
