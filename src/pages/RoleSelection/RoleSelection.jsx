import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import styles from "./RoleSelection.module.scss";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem("register_user_type", role);
    setSelectedRole(role);
  };

  const handleCreateAccount = () => {
    if (selectedRole) {
      navigate("/register", {state: {role: selectedRole}});
    }
  };

  return (
    <div className={styles.roleSelectionContainer}>
      <div className={styles.roleSelectionCard}>
        <div className={styles.roleSelectionHeader}>
          <h1>Join Lodify as a Carrier or Brokers</h1>
        </div>

        <div className={styles.roleOptions}>
          <div
            className={`${styles.roleCard} ${
              selectedRole === "broker" ? styles.selected : ""
            }`}
            onClick={() => handleRoleSelect("broker")}>
            <div className={styles.roleIcon}>
              <img src="/img/truck.svg" alt="" />
            </div>
            <div className={styles.roleContent}>
              <p>I'm a broker, looking to move freight</p>
            </div>
            <div className={styles.roleRadio}>
              <input
                type="radio"
                name="role"
                value="broker"
                checked={selectedRole === "broker"}
                onChange={() => handleRoleSelect("broker")}
              />
            </div>
          </div>

          <div
            className={`${styles.roleCard} ${
              selectedRole === "carrier" ? styles.selected : ""
            }`}
            onClick={() => handleRoleSelect("carrier")}>
            <div className={styles.roleIcon}>
              {" "}
              <img src="/img/lifeCycle.svg" alt="" />
            </div>
            <div className={styles.roleContent}>
              <p>I'm a carrier, looking for loads</p>
            </div>
            <div className={styles.roleRadio}>
              <input
                type="radio"
                name="role"
                value="carrier"
                checked={selectedRole === "carrier"}
                onChange={() => handleRoleSelect("carrier")}
              />
            </div>
          </div>
        </div>

        <button
          className={`${styles.createAccountBtn} ${
            selectedRole ? styles.enabled : styles.disabled
          }`}
          onClick={handleCreateAccount}
          disabled={!selectedRole}>
          Create Account
        </button>

        <div className={styles.roleSelectionFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
