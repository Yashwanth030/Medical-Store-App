import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      <h3>Medical Store</h3>
      {isAuth ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}

      {isAuth && (
        <Link to="/chatbot">
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#007bff",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            <BsChatDots />
          </div>
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
