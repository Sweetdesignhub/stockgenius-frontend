/**
 * File: FyersInput
 * Description: Component to capture user's Fyers credentials (Fyers ID, App ID, Secret ID) as input fields.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 *
 */

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
