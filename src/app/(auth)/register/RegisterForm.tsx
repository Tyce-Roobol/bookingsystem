"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = cred.user;
      const idToken = await cred.user.getIdToken(true);
      console.log("Firebase ID Token (email/password):", idToken.substring(0, 10) + "...");
      console.log("Firebase UID (email/password):", uid);

      const name = email;

      console.log("Sending POST to /api/user-auth with:", { userId: uid, name, isAuthorized: false });
      const res = await fetch("/api/user-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ userId: uid, name, isAuthorized: false }),
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (jsonError) {
          errorData = { error: "Invalid response", details: "Failed to parse JSON" };
        }
        console.error("POST /api/user-auth failed in RegisterForm:", {
          status: res.status,
          error: errorData.error,
          details: errorData.details,
        });
        throw new Error(errorData.details || errorData.error || "Failed to create user in database");
      }

      console.log("POST /api/user-auth succeeded for email/password in RegisterForm");
      router.push("/");
    } catch (err: any) {
      let errorMessage = "Registration failed";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak (minimum 6 characters)";
      } else {
        errorMessage = err.message || "Registration failed";
      }
      console.error("Registration error in RegisterForm:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const { uid, displayName, email } = cred.user;
      const idToken = await cred.user.getIdToken(true);
      console.log("Firebase ID Token (Google):", idToken.substring(0, 10) + "...");
      console.log("Firebase UID (Google):", uid);

      if (!email) throw new Error("Google account has no email");

      const name = displayName || email;

      console.log("Sending GET to /api/user-auth to check authorization");
      const authStatus = await fetch("/api/user-auth", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (!authStatus.ok) {
        let errorData;
        try {
          errorData = await authStatus.json();
        } catch (jsonError) {
          errorData = { error: "Invalid response", details: "Failed to parse JSON" };
        }
        console.error("GET /api/user-auth failed in RegisterForm:", {
          status: authStatus.status,
          error: errorData.error,
          details: errorData.details,
        });
        throw new Error(errorData.details || errorData.error || "Failed to check user authorization");
      }

      const { isAuthorized } = await authStatus.json();
      console.log("GET /api/user-auth response in RegisterForm:", { isAuthorized });

      if (isAuthorized) {
        console.log("User is authorized, redirecting to /homepage");
        router.push("/dashboard");
      } else {
        console.log("Sending POST to /api/user-auth with:", { userId: uid, name, isAuthorized: false });
        const res = await fetch("/api/user-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ userId: uid, name, isAuthorized: false }),
        });

        if (!res.ok) {
          let errorData;
          try {
            errorData = await res.json();
          } catch (jsonError) {
            errorData = { error: "Invalid response", details: "Failed to parse JSON" };
          }
          console.error("POST /api/user-auth failed for Google Sign-In in RegisterForm:", {
            status: res.status,
            error: errorData.error,
            details: errorData.details,
          });
          throw new Error(errorData.details || errorData.error || "Failed to create user in database");
        }

        console.log("POST /api/user-auth succeeded for Google Sign-In in RegisterForm");
        router.push("/");
      }
    } catch (err: any) {
      let errorMessage = "Google Sign-In failed";
      if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in popup closed";
      } else if (err.message === "Google account has no email") {
        errorMessage = "No email associated with Google account";
      } else {
        errorMessage = err.message || "Google Sign-In failed";
      }
      console.error("Google Sign-In error in RegisterForm:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-semibold mb-6">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 border rounded"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded ${loading ? "opacity-50" : "hover:bg-blue-700"}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`w-full mt-4 bg-red-600 text-white py-2 rounded ${loading ? "opacity-50" : "hover:bg-red-700"}`}
      >
        {loading ? "Processing..." : "Sign up with Google"}
      </button>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}