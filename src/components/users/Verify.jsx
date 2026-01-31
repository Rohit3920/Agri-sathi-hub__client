import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Verify() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying email...");
    const [registrationAttempted, setRegistrationAttempted] = useState(false);

    useEffect(() => {
        const finalizeRegistration = async () => {
            // Check if registration has already been attempted in this session
            if (registrationAttempted) return;
            setRegistrationAttempted(true);

            // Supabase automatically reads the token from the URL and sets the session.
            const { data: { session } } = await supabase.auth.getSession();

            // 3. Confirm email manually using email (This check handles the verification success)
            if (session && session.user.email_confirmed_at) {
                setStatus("Email verified successfully! Saving your user details...");

                // Get the custom user metadata stored during signup
                const userMetadata = session.user.user_metadata;

                // 4. Email verify successfully then store user credential
                const dataToSend = {
                    ...userMetadata,
                    email: session.user.email,
                    // Pass the Supabase User ID for linking your custom database entry
                    supabaseUserId: session.user.id,
                };

                try {
                    // Send the COMPLETE user data to your custom MERN backend /api/auth/register
                    const response = await api.post("/api/auth/register", dataToSend);
                    console.log("MERN Backend Response:", response.data);

                    setStatus("Registration complete! Redirecting to dashboard...");
                    toast.success("Account verified and created successfully 🎉");

                    // Redirect to a protected page (e.g., /dashboard)
                    setTimeout(() => navigate("/dashboard"), 3000);

                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Error saving user data to backend. Please contact support.";
                    setStatus(`Registration Error: ${errorMessage}`);
                    toast.error(`Registration failed: ${errorMessage}`);

                    // Sign out the user if custom backend save failed to maintain data integrity
                    await supabase.auth.signOut();
                    setTimeout(() => navigate("/signup"), 5000);
                }
            } else {
                setStatus("Verification failed or link expired. Redirecting to login...");
                toast.error("Verification failed or link expired.");
                setTimeout(() => navigate("/login"), 3000);
            }
        };

        finalizeRegistration();
    }, [navigate, registrationAttempted]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h2 className="text-xl font-medium">{status}</h2>
        </div>
    );
}

export default Verify;