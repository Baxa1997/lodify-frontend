import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import styles from "./PhoneVerification.module.scss";

const PhoneVerification = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length === 4) {
      setIsLoading(true);

      // Skip Firebase verification - always accept any 4-digit code or default 1234
      setTimeout(() => {
        setIsLoading(false);
        console.log("Phone verification skipped - proceeding to dashboard");
        navigate("/admin/dashboard");
      }, 500);
    }
  };

  const handleResend = () => {
    // Skip Firebase resend - just show success message
    alert("Verification code resent! (Use any 4-digit code or 1234)");
  };

  return (
    <div className={styles.phoneVerificationContainer}>
      <div className={styles.sidebar}>
        <div className={styles.steps}>
          <div className={`${styles.step} ${styles.completed}`}>
            <div className={styles.stepIndicator}></div>
            <span className={styles.stepTitle}>Your details</span>
          </div>
          <div className={`${styles.step} ${styles.completed}`}>
            <div className={styles.stepIndicator}></div>
            <span className={styles.stepTitle}>Address</span>
          </div>
          <div className={`${styles.step} ${styles.completed}`}>
            <div className={styles.stepIndicator}></div>
            <span className={styles.stepTitle}>Email and Phone number</span>
          </div>
          <div className={`${styles.step} ${styles.active}`}>
            <div className={styles.stepIndicator}></div>
            <span className={styles.stepTitle}>Verification</span>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerLeft}>© Lodify 2025</div>
          <div className={styles.footerRight}>✉️ help@lodify.com</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.verificationContainer}>
          <div className={styles.verificationIcon}>📱</div>
          <h1>Check your phone</h1>
          <p>We sent a verification code to +9989******15</p>

          <div className={styles.verificationCode}>
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.codeInput}
              />
            ))}
          </div>

          <button
            className={styles.verifyBtn}
            onClick={handleVerify}
            disabled={isLoading || verificationCode.join("").length !== 4}>
            {isLoading ? "Verifying..." : "Verify phone number"}
          </button>

          <p className={styles.resendText}>
            Didn't receive the email?{" "}
            <span className={styles.resendLink} onClick={handleResend}>
              Click to resend
            </span>
          </p>

          <div className={styles.stepDots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={`${styles.dot} ${styles.active}`}></div>
          </div>

          <div className={styles.backLink}>
            <Link to="/register">← Back to address</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
