import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { sanitizeEmail } from "../../utils/normalize";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export function useSignup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { signup: signupContext, authenticateWithGoogle } = useAuth();
    const { showSuccess, showError } = useToast();

    const { mutate, isLoading, error } = useMutation(signupContext, {
        onSuccess: (data) => {
            showSuccess("User signed up successfully!");
            navigate('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
            showError("An error occurred during signup");
        }
    });

    if (error instanceof Error) {
        showError("An error occurred during signup");
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validator.isEmail(email)) {
            showError("Invalid email format");
            return;
        }

        if (!validator.isLength(password, { min: 6 })) {
            showError("Password must be at least 6 characters");
            return;
        }

        const sanitizedEmail = sanitizeEmail(email);
        const sanitizedName = validator.escape(name);

        mutate({ name: sanitizedName, email: sanitizedEmail, password });
    };

    const onGoogleSignupSuccess = async (tokenResponse: any) => {
        try {
            await authenticateWithGoogle(tokenResponse);
            showSuccess("Signup with Google was successful!");
            navigate('/dashboard');
        } catch (error) {
            showError("An error occurred during Google signup");
        }
    };

    return {
        name, setName,
        email, setEmail,
        password, setPassword,
        handleSubmit,
        onGoogleSignupSuccess,
        isLoading, error
    }

    
}

