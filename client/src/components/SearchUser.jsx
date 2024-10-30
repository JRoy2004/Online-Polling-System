import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import axios from "axios";

import UserComponent from "./UserComponent";

const SearchUser = () => {
  const [searchTag, setSearchTag] = useState("");
  const [role, setRole] = useState("");
  const [sortCriterion, setSortCriterion] = useState("NoSort");
  const [page, setPage] = useState(1);
  const [limit] = useState(2); // set a fixed limit or make it dynamic if needed
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users with search, role, sorting, and pagination
  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem("token");
      //console.log(searchTag || undefined, role || undefined, page, limit);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/getAllUsers`, // updated route for admin
        {
          params: {
            username: searchTag || undefined,
            role: role || undefined,
            page,
            limit,
            sortCriterion,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { users: fetchedUsers, totalPages } = response.data;
      //console.log(response.data);
      // Reset users list if new search/filter is applied
      setUsers((prevUsers) => fetchedUsers);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error while fetching users:", error);
    }
  };

  // Handle sorting or filtering changes
  useEffect(() => {
    fetchPolls(); // reset users on filter changes
  }, [searchTag, role, page, sortCriterion]);

  // Fetch next page
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        {/* Search Input */}
        <div className="w-full sm:w-[40%] flex mb-4 sm:mb-0">
          <input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            placeholder="Search by username..."
            className="w-full p-2 border min-w-[80px] border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500 h-10"
          />
          <button
            onClick={() => fetchPolls(true)}
            className="bg-blue-500 min-w-[20px] text-white p-2 rounded-r-lg w-[120px] hover:bg-blue-600 transition duration-200 flex justify-center items-center h-10"
          >
            <FaSearch size={20} />
          </button>
        </div>

        {/* Sort and Filter Dropdowns */}
        <div className="flex flex-col md:flex-row-reverse items-start lg:items-end justify-between ml-0 gap-2 lg:ml-4">
          <div className="flex flex-col sm:flex-row items-center md:justify-center ">
            {/* Sorting Dropdown */}
            <select
              value={sortCriterion}
              onChange={(e) => setSortCriterion(e.target.value)}
              className="mb-2 sm:mb-0 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="NoSort">No Sorting</option>
              <option value="mostPolls">Most Polls</option>
              <option value="mostRemovedPollCount">
                Highest Removed Poll Count
              </option>
            </select>
          </div>

          {/* Role Filter Dropdown */}
          <div className="flex flex-col sm:flex-row items-center md:justify-center ">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mb-2 sm:mb-0 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="normal">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Users */}
      <div className="py-4">
        {users.map((user) => (
          <UserComponent key={user._id} user={user} />
        ))}

        {/* Load More Button for Pagination */}
        <div className="flex gap-2 mt-4">
          {page > 1 && (
            <button
              onClick={goToPreviousPage}
              className=" py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200  px-4 flex items-center justify-center"
            >
              <FaArrowLeft size={18} />
            </button>
          )}
          <div className="flex justify-center items-center text-center font-semibold">
            ... {page} ...
          </div>
          {page < totalPages && (
            <button
              onClick={goToNextPage}
              className=" py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200  px-4 flex items-center justify-center"
            >
              <FaArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
