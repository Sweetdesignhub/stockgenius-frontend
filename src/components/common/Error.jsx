/**
 * File: Error
 * Description: This component is typically used for handling and displaying errors within the application.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */



const ErrorComponent = ({ error }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-500">Error: {error}</p>
  </div>
);

export default ErrorComponent;
