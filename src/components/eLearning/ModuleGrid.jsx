import React from "react";
import ModulesCard from "./ModulesCard";

function ModuleGrid({ modules }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 p-4 sm:p-5 lg:p-6 md:pr-2">
      {modules.map((module) => (
        <ModulesCard
          key={module.id}
          moduleTitle={module.title}
          moduleDescription={module.description}
          bgImage={module.bgImage}
          link={`/e-learning/learning/${module.id}`}
          descColor={module.descColor}
        />
      ))}
    </div>
  );
}

export default ModuleGrid;