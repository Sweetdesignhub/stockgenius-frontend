/**
 * File: ZerodhaInput
 * Description: Component to capture user's Zerodha credentials (Zerodha ID, Password, TOTP Key) as input fields.
 * Used in the platform for integrating Zerodha accounts with the system.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Added input fields for Zerodha ID, Password, and TOTP Key to facilitate user authentication.
 */


import React from "react";
import Input from "../common/Input";

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
