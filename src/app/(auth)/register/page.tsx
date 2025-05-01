import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
    title: "Register"
}

export default function Register() {
    return(
        <>
            <RegisterForm />
        </>
    )
}