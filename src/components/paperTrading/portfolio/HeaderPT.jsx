import { Link } from "react-router-dom";

function HeaderPT() {

  return (
    <div className="flex justify-between items-center pb-2 border-b">
      <h1 className="font-[poppins] font-semibold">Account Manager</h1>
      <Link to={"/india/paper-trading"}>
      <img src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Ff3ddd6a4e36e44b584511bae99659775" alt="" />
      </Link>
    </div>
  );
}

export default HeaderPT;
