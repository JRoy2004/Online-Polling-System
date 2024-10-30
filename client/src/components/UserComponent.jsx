import { useNavigate } from "react-router-dom";

const UserComponent = ({ user }) => {
  const { username, role, pollsCreated, removedPollCount, accessStatus } = user;
  //console.log(user);
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-1 flex-col px-4 pt-2 mb-4 bg-white rounded-lg shadow-md border border-gray-300 hover:shadow-2xl hover:mb-5 cursor-pointer"
      onClick={() => navigate(`/user/${username}`)}
    >
      <h2 className="text-xl font-semibold">{username}</h2>
      <div className="flex flex-col sm:grid grid-cols-2 grid-rows-2 gap-2 text-lg pt-2 border-t">
        <p className="text-gray-500 flex items-center">Role: {role}</p>
        <p className="text-gray-500 flex items-center">
          Polls: {pollsCreated.length}
        </p>
        <p className="text-gray-500 flex items-center">
          Removed Polls: {removedPollCount}
        </p>
        <div className="flex items-center">
          User Status:
          <p
            className={`p-2 rounded ${
              !accessStatus ? "text-red-500" : "text-green-500"
            }`}
          >
            {!accessStatus ? "Restricted" : "active"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
