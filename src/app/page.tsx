import Link from "next/link";
import { Send, Zap, Bell, CheckCircle2, ShieldCheck, Sparkles, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JOB_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-[340px] w-[600px] rounded-full bg-sky-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Telegram-First AI Job Discovery for Ethiopia</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
            Set your preferences once. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400">
              Get notified on Telegram.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto">
            Signal Job continuously curates top verified Ethiopian opportunities — internships, entry-level, NGO, tech, and finance roles — and pings you the moment a direct match is published.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://t.me/signal_job_ai_assitant_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 cursor-pointer"
            >
              <Send className="h-5 w-5" />
              <span>Launch Telegram Bot</span>
            </a>
            <Link href="/admin">
              <Button variant="secondary" size="lg" className="gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-400" />
                <span>Admin Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
