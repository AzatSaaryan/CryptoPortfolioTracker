import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
} from "../redux/userSlice";

export default function GetCurrentUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    dispatch(fetchUserStart());
    try {
      const response = await axios.get("/users/profile");
      dispatch(fetchUserSuccess(response.data.user));
      navigate("/profile");
    } catch (error) {
      if (error instanceof Error) dispatch(fetchUserFailure(error.message));
      console.error("Error while fetching user data:", error);
    }
  };

  return (
    <div>
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <button onClick={fetchUserData}>Profile Settings</button>
      </div>
    </div>
  );
}
