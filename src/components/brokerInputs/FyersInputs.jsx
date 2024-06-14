import React from "react";
import Input from "../common/Input";

function FyersInputs({ formData, handleInputChange }) {
  return (
    <>
      <Input
        label="Fyers ID"
        name="fyersId"
        value={formData.fyersId}
        onChange={handleInputChange}
        placeholder="Enter Fyers ID"
      />
      <Input
        label="App ID"
        name="appId"
        value={formData.appId}
        onChange={handleInputChange}
        placeholder="Enter App ID"
      />
      <Input
        label="Secret ID"
        name="secretId"
        value={formData.secretId}
        onChange={handleInputChange}
        placeholder="Enter Secret ID"
      />
    </>
  );
}

export default FyersInputs;
