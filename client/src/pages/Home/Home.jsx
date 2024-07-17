import { useState, useRef, useEffect } from "react";
import "./home.css";
import { toast } from "react-toastify";
import TaskManager from "../../components/TaskManager/TaskManager";
import Project from "../../components/Project/project";
import Collaborater from "../../components/Collaborater/Collaborater";
import Header from "../../components/Header/Header";
import Nav from "../../components/Nav/Nav";
import profile from "../../assets/images/profile.jpg";
import useAuth from "../../services/context/index";

function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [inputValue, setInputValue] = useState(userName);
  const [profilePic, setProfilePic] = useState(profile);
  const { user, setAuth } = useAuth();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setUserName(inputValue);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputBlur();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fileTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

    if (fileTypes.includes(file.type)) {
      document.querySelector(".user-pic").style.backgroundImage =
        `url(${URL.createObjectURL(file)})`;

      const form = new FormData();
      form.append("avatar", file);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/update-profile-pic`, {
          method: "PUT",
          body: form,
        });
        if (response.ok) {
          const data = await response.json();
          setProfilePic(data.avatar);
          setAuth((prevState) => ({ ...prevState, user: data }));
          toast.success("Modification successfully");
        } else {
          toast.warn("Please verify file type");
        }
      } catch (error) {
        toast.error("error");
      }
    } else {
      toast.warn("Plsease verify file type.");
    }
  };

  useEffect(() => {
    const currentFileInputRef = fileInputRef.current;
    currentFileInputRef?.addEventListener("change", handleFileChange);

    return () => {
      if (currentFileInputRef) {
        currentFileInputRef?.removeEventListener("change", handleFileChange);
      }
    };
  });

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/`
        );
        if (!response.ok) {
          throw new Error("failed to fetch user data");
        }
        const data = await response.json();
        setUserName(data.userName);
        setInputValue(data.userName);
        setProfilePic(data.profilePic || profile);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const updateUserName = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/update-name`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ newName: inputValue }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update user name");
        }
        setUserName(inputValue);
        setAuth((prev) => ({ ...prev, userName: inputValue }));
        toast.success("Username updated successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update username");
      }
    };

    if (!isEditing) {
      updateUserName();
    }
  }, [isEditing, inputValue, setAuth, user]);
  return (
    <>
      <Nav />
      <Header />
      <div className="home-page">
        <p>Accueil</p>
        <div className="user-info">
          {isEditing ? (
            <input
              className="edit-input"
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
            />
          ) : (
            <h2>{`Bonjour, ${userName}`}</h2>
          )}
          <div
            className="user-pic"
            role="button"
            onClick={() => fileInputRef.current.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter") fileInputRef.current.click();
            }}
            tabIndex="0"
            style={{ backgroundImage: `url(${profilePic})` }}
            aria-label="Change profile picture"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <button
            type="button"
            className="modify-btn"
            onClick={handleEditClick}
          >
            Modifier
          </button>
        </div>
        <div id="main-content">
          <div className="task-manager-section">
            <TaskManager />
          </div>
          <div id="pro-collab-section">
            <div className="projects-collaborators-section">
              <Project />
              <Collaborater />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
