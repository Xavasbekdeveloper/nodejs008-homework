import React from "react";
import { Link } from "react-router-dom";
import { useGetProfileQuery } from "../../context/api/userApi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { data } = useGetProfileQuery();

  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg">
      <div className="container flex justify-between items-center p-4">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight hover:text-gray-200 transition duration-300"
        >
          Logo
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            to="/login"
            className="px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Register
          </Link>

          <div className="flex flex-1 items-center rounded-lg">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 pl-4 pr-4 py-2 x bg-white text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="bg-blue-600 text-white p-2 hover:bg-blue-700 transition duration-300">
              search
            </button>
          </div>

          {data && (
            <div className="flex items-center space-x-3">
              <div
                onClick={handleProfile}
                className="cursor-pointer w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white"
              >
                {data.payload.fname.charAt(0)}
              </div>
              <span
                onClick={handleProfile}
                className=" cursor-pointer text-lg font-semibold"
              >
                {data.payload.fname}
              </span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
