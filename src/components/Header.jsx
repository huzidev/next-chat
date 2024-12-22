import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="dark:bg-zinc-900/50 bg-zinc-100/50 p-4">
      <div className="container mx-auto flex items-center justify-center">
        <Link href="/" className="flex justify-center items-center">
          <Image src="/logo.png" width={60} height={60} alt="logo" />
        </Link>
        <div className="flex-grow" />
        <div className="space-x-4 text-md flex items-center">
          <Link href="/signin" className="hover:underline">
            Signin
          </Link>
          <Link href="/signup" className="hover:underline">
            Signup
          </Link>
          <Link href="/chat/user/1" className="hover:underline">
            Chat
          </Link>
        </div>
      </div>
    </header>
  );
}
