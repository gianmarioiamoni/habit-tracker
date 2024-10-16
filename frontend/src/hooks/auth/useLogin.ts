import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import validator from "validator";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";


export function useLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const { login: loginContext, user } = useAuth();

    const { showError, showSuccess } = useToast();

    // Show validation errors if any
    useEffect(() => {
        if (Object.keys(validationErrors).length > 0) {
            validationErrors.email && showError(validationErrors.email);
            validationErrors.password && showError(validationErrors.password);
        }
    }, [validationErrors, showError]);

    // Show login error and success message
    useEffect(() => {
        if (loginError) {
            showError("Invalid email or password.")

        }
    }, [loginError, showError]);

    useEffect(() => {
        if (isSuccess) {
            showSuccess(
                `Welcome back to Habit Tracker` + (user?.name ? `, ${user?.name}!` : "!")
            );
        }
    }, [isSuccess, showSuccess, user?.name]);

    // Mutation to send login request
    const mutation = useMutation(
        async () => {
            const response = await loginContext({ email, password });
            return response;
        },
        {
            onSuccess: (data) => {
                navigate("/dashboard");
                setLoginError(null);
                setIsSuccess(true);
            },
            onError: (error: any) => {
                console.error(error);
                setLoginError("Invalid email or password");
                setIsSuccess(false);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setValidationErrors({});

        // VALIDATION
        const newErrors: { email?: string; password?: string } = {};

        if (!validator.isEmail(email)) {
            newErrors.email = "Invalid email format";
        }

        if (validator.isEmpty(password)) {
            newErrors.password = "Password is required";
        }

        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }

        mutation.mutate();
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        validationErrors,
        handleSubmit,
        loginError,
        isSuccess,
    }
}
