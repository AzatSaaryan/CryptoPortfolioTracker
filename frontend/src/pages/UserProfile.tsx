import axios from "../services/api";

export default function UserProfile() {
  const handeleGetUser = async () => {
    try {
      const response = await axios.get("/users/profile");
      if (response.status === 200) {
        const user = response.data.user;
        console.log("User profile:", user);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div>
        <h1>User Profile</h1>
        <button onClick={handeleGetUser}>Get User Profile</button>
        {/* Add more user profile details here */}
    </div>
  )
}
