import Image from "next/image";
import Link from "next/link";

export default function Header() {
  function logout() {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }
  }

  return (
    <header className="dark:bg-zinc-900/50 bg-zinc-100/50 p-4">
      <div className="container mx-auto flex items-center justify-center">
        <Link href="/" className="flex justify-center items-center">
          <Image src="/logo.png" width={60} height={60} alt="logo" />
        </Link>
        <div className="flex-grow" />
        <div className="space-x-4 text-md flex items-center">
          <Link href="/signin" className="hover:underline">
            SignIn
          </Link>
          <Link href="/signup" className="hover:underline">
            SignUp
          </Link>
          <Link href="/users" className="hover:underline">
            Users
          </Link>
          <Link href="/logout" className="hover:underline">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
}
