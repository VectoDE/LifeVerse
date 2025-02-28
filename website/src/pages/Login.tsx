import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../stores/authSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";

const LOGIN_API_URL = "http://localhost:3001/api/auth/discord";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [storedUser, setStoredUser] = useLocalStorage<{ id: string; username: string; name: string; email: string } | null>("user", null);

    useEffect(() => {
        if (storedUser) {
            dispatch(login(storedUser));
            navigate("/dashboard");
        }
    }, [storedUser, dispatch, navigate]);

    const handleDiscordLogin = () => {
        setIsLoading(true);
        window.location.href = LOGIN_API_URL;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");
        if (user) {
            const userData = JSON.parse(user);
            setStoredUser(userData);
            dispatch(login(userData));
            navigate("/dashboard");
        }
    }, [navigate, dispatch, setStoredUser]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Login with Discord</h1>
            <form
                className="flex flex-col items-center space-y-4"
                onSubmit={(e) => e.preventDefault()}
            >
                <button
                    type="button"
                    onClick={handleDiscordLogin}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-lg"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Login via Discord"}
                </button>
            </form>
        </div>
    );
};

export default Login;
