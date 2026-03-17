import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify & Reset
    const [data, setData] = useState({
        email: "",
        otp: "",
        password: "",
        confirmPassword: ""
    });
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleRequestOTP = async (e) => {
        if (e) e.preventDefault();
        setMsg("");
        setError("");
        setIsLoading(true);

        try {
            console.log("Requesting OTP for:", data.email);
            // Simulate network delay for better UX demo
            // await new Promise(r => setTimeout(r, 1000)); 

            await axios.post("/api/forgotpassword", { email: data.email });
            setMsg("OTP sent to your email. Please check your inbox (and console for demo).");
            setStep(2);
            setTimer(30); // Start 30s timer
        } catch (err) {
            console.error("OTP Request Error:", err);
            setError(err.response?.data?.msg || "Failed to send OTP. Check if email exists.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMsg("");
        setError("");

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Resetting password with OTP:", data.otp);
            let res = await axios.put("/api/resetpassword", {
                email: data.email,
                otp: data.otp,
                password: data.password
            });
            console.log("Reset response:", res.data);
            setMsg("Password updated successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("Reset Password Error:", err);
            setError(err.response?.data?.msg || "Invalid OTP or something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-box">
                <div className="icon-header">
                    {step === 1 ? "🔒" : "🛡️"}
                </div>
                <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
                <p className="subtitle">
                    {step === 1
                        ? "Enter your email address and we'll send you an OTP to reset your password."
                        : "Enter the OTP sent to your email and your new password."}
                </p>

                {msg && <div className="alert success">{msg}</div>}
                {error && <div className="alert error">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your registered email"
                                value={data.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send OTP"}
                        </button>
                        <div className="form-footer">
                            <Link to="/login" className="back-link">
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label>Enter OTP</label>
                            <div className="otp-input-container">
                                <input
                                    type="text"
                                    name="otp"
                                    className="form-input otp-field"
                                    placeholder="• • • • • •"
                                    maxLength="6"
                                    value={data.otp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter new password"
                                value={data.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Confirm new password"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                        <div className="form-footer">
                            <p className="resend-text">
                                Didn't receive code?{" "}
                                <button
                                    type="button"
                                    className="resend-btn"
                                    onClick={(e) => handleRequestOTP(null)}
                                    disabled={timer > 0 || isLoading}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                                </button>
                            </p>
                            <Link to="/login" className="back-link">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
