import React from "react";
import Input from "../dashboard/Input";

function ZerodhaInputs({ formData, handleInputChange }) {
  return (
    <>
      <Input
        label="Zerodha ID"
        name="zerodhaId"
        value={formData.zerodhaId}
        onChange={handleInputChange}
        placeholder="Enter Zerodha ID"
      />
      <Input
        label="Zerodha Password"
        name="zerodhaPassword"
        value={formData.zerodhaPassword}
        onChange={handleInputChange}
        placeholder="Enter Zerodha Password"
      />
      <Input
        label="TOTP Key"
        name="totpKey"
        value={formData.totpKey}
        onChange={handleInputChange}
        placeholder="Enter TOTP Key"
      />
    </>
  );
}

export default ZerodhaInputs;
