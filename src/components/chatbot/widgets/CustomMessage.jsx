export const CustomMessage = ({ message }) => {
  return (
    <div
      className="chat-message"
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
};
