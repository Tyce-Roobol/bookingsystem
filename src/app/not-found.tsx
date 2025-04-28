"use client";
import { usePathname } from "next/navigation";

export default function NotFound() {
    const pathName = usePathname();
    return (
        <>
        <h2>Page not found</h2>
        <p>could not find requested resource, {pathName} either does not exist or cannot be loaded at this time.</p>
        </>
    );
}