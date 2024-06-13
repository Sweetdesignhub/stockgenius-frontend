const ErrorComponent = ({ error }) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-500">Error: {error}</p>
  </div>
);

export default ErrorComponent;
