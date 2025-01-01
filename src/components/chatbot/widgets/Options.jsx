// import React from "react";

// const Options = ({ actionProvider }) => {
//   const options = [
//     { text: "Relevant News", handler: () => actionProvider.askForTicker("Relevant News") },
//     { text: "Ticker Profile Analysis", handler: () => actionProvider.askForTicker("Profile Analysis") },
//     { text: "Ticker Historical Performance", handler: () => actionProvider.askForTicker("Historical Performance") },
//   ];

//   return (
//     <div className="flex gap-1">
//       {options.map((option, index) => (
//         <button
//           key={index}
//           onClick={option.handler}
//           className="p-2 text-sm border font-semibold border-blue-500 text-black rounded-2xl hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
//         >
//           {option.text}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default Options;

const Options = (props) => {
  return (
    <div className="options">
      <h1 className="options-header">{props.title}</h1>
      <div className="options-container">
        {props.options.map((option) => {
          return (
            <div
              className="option-item"
              onClick={option.handler}
              key={option.id}
            >
              {option.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Options;

