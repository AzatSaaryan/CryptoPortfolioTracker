import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { fetchUserSuccess } from "../redux/userSlice";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    walletAddress: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        walletAddress: user.walletAddress || "",
      });
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put("/users/profile", formData);
      dispatch(fetchUserSuccess(res.data));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Profile Settings{" "}
        <span className="text-blue-500 font-mono truncate max-w-xs inline-block align-bottom">
          {formData.walletAddress}
        </span>
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
