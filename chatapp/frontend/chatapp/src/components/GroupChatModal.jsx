import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

export default function GroupChatModal({ isOpen, onClose, onCreateGroup }) {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const searchUsers = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/users?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data || []);
      } else {
        setError("Error searching users");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUsers.length < 2) {
      setError("Please select at least 2 users");
      return;
    }
    onCreateGroup(
      groupName,
      selectedUsers.map((user) => user._id)
    );
    onClose();
  };

  const handleUserSelect = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const removeUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Group Chat</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedUsers.map((user) => (
              <span
                key={user._id}
                className="bg-blue-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {user.username}
                <button
                  type="button"
                  onClick={() => removeUser(user._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search Users"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded-md"
          />
          {searchResults.length > 0 && (
            <div className="max-h-40 overflow-y-auto border rounded-md">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
