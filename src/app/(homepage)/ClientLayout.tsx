"use client";
import Link from "next/link"
import { usePathname } from "next/navigation";

const navlinks = [
  {name: "HOME", href: "/"},
  {name: "ABOUT", href: "/about"},
  {name: "MENUS", href: "/menus"},
  {name: "PROFILE", href:"/profile"}
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="mb-4">
        {navlinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (pathname.startsWith(link.href) && link.href !== "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={isActive ? "font-bold mr-4" : "text-blue-500 mr-4"}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <main>{children}</main>
    </div>
  );

}
