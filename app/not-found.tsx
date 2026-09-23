import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-extrabold text-primary mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-600 mb-6">The page you are looking for does not exist.</p>
      <Link href="/en" className="px-6 py-3 bg-primary text-white rounded-lg font-bold text-xs uppercase">
        Return to Homepage
      </Link>
    </div>
  );
}
