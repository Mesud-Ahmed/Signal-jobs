import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 shadow-md">
            <Image
              src="/logo.png"
              alt="Signal Job"
              width={36}
              height={36}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">Signal Job</span>
            <span className="ml-1.5 rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-sky-400">
              ETHIOPIA
            </span>
          </div>
        </Link>


      </div>
    </header>
  );
}
