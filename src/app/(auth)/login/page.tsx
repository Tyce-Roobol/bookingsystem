import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "login"
}

export default function Login() {
    return(
        <>
            <LoginForm />
        </>
    )
}