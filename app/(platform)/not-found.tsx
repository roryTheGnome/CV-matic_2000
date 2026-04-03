"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
            <div className="flex flex-col items-center text-center gap-6 p-10 rounded-2xl bg-surface shadow-md max-w-md w-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-active">
                    <AlertCircle className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-text-primary">404</h1>
                    <p className="text-lg font-medium text-text-primary">
                        Page not found
                    </p>
                    <p className="text-sm text-text-secondary">
                        The page you are looking for doesn’t exist or has been moved.
                    </p>
                </div>

                <Link
                    href="/users"
                    className="mt-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
