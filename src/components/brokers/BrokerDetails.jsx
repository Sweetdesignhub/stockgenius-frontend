import { useState } from "react";
import Input from "../common/Input";

const BrokerDetails = ({ credentials, onUpdate, onDelete, onConnect }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nickname: credentials.nickname,
    mobile: credentials.mobile,
    email: credentials.email,
    fyersId: credentials.fyersId,
    appId: credentials.appId,
    secretId: credentials.secretId,
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    resetForm();
  };

  const handleUpdate = () => {
    onUpdate(credentials._id, form);
    setEditing(false);
  };

  const handleConnect = () => {
    onConnect(credentials._id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      nickname: credentials.nickname,
      mobile: credentials.mobile,
      email: credentials.email,
      fyersId: credentials.fyersId,
      appId: credentials.appId,
      secretId: credentials.secretId,
    });
  };

  return (
    <div className="p-4 mb-4 border border-gray-300 rounded-lg">
      <h1 className="font-semibold font-[poppins]">
        Broker: {credentials.broker}
      </h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Nickname"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Enter Nickname"
        />
        <Input
          label="Mobile Number"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Enter Mobile Number"
        />
        <Input
          label="Email Id"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={!editing}
          placeholder="Enter Email"
        />
        {credentials.broker === "Fyers" && (
          <>
            <Input
              label="Fyers ID"
              name="fyersId"
              value={form.fyersId}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter Fyers ID"
            />
            <Input
              label="App ID"
              name="appId"
              value={form.appId}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter App ID"
            />
            <Input
              label="Secret ID"
              name="secretId"
              value={form.secretId}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter Secret ID"
            />
          </>
        )}
      </div>
      <div className="flex justify-end mt-4">
        {!editing && (
          <>
            <button
              type="button"
              onClick={handleEdit}
              className="bg-[#FFFFFF] mr-3 text-[#FF0F0F] px-4 py-1 rounded-lg"
              style={{ boxShadow: "0px 9px 20px 0px #0000001A" }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(credentials._id)}
              className="bg-[#FFFFFF] mr-3 text-[#FF0F0F] px-4 py-1 rounded-lg"
              style={{ boxShadow: "0px 9px 20px 0px #0000001A" }}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleConnect}
              disabled={editing}
              className="bg-[#3A6FF8] text-[#FFFFFF] px-4 py-1 rounded-lg"
            >
              Connect
            </button>
          </>
        )}
        {editing && (
          <>
            <button
              type="button"
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-1 mr-2 rounded-lg"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-1 rounded-lg"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BrokerDetails;
