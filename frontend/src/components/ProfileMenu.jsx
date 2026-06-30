import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/ProfileMenu.css";

function ProfileMenu({ username, logout }) {
  const [open, setOpen] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function changeUsername() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://127.0.0.1:8000/change-username",
        {
          new_username: newUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      toast.success(
        "Username updated successfully. Please login again."
      );

      logout();

    } catch (err) {
      console.log(err);
      toast.error("Couldn't update username");
    }
  }

  async function changePassword() {

    if(newPassword!==confirmPassword){

        toast.error("Passwords do not match");

        return;
    }

    try{

        const token=localStorage.getItem("token");

        const res=await axios.put(

            "http://127.0.0.1:8000/change-password",

            {

                current_password:currentPassword,

                new_password:newPassword

            },

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        if(res.data.error){

            toast.error(res.data.error);

            return;

        }

        toast.success("Password updated successfully");

        setChangingPassword(false);

        setCurrentPassword("");

        setNewPassword("");

        setConfirmPassword("");

    }

    catch(err){

        console.log(err);

        toast.error("Couldn't update password");

    }

}
  return (
    <div className="profile-container">

      <button
        className="profile-button"
        onClick={() => setOpen(!open)}
      >
        👤 Profile
      </button>

      {open && (
        <div className="profile-menu">

          <h4>{username}</h4>

          {!editingUsername ? (
            <button
              onClick={() => setEditingUsername(true)}
            >
              ✏️ Change Username
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) =>
                  setNewUsername(e.target.value)
                }
              />

              <button
                onClick={changeUsername}
              >
                Save Username
              </button>
            </>
          )}

          {!changingPassword ? (

<button
onClick={() => setChangingPassword(true)}
>

🔒 Change Password

</button>

) : (

<>

<input
type="password"
placeholder="Current Password"
value={currentPassword}
onChange={(e)=>setCurrentPassword(e.target.value)}
/>

<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

<button
onClick={changePassword}
>

Save Password

</button>

</>

)}

          <button
            className="logout-profile"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>
      )}

    </div>
  );
}

export default ProfileMenu;