"use client";

import { useState, useEffect } from "react";
import { UserPlus, KeyRound, ShieldAlert, CheckCircle2, AlertCircle, Loader2, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface StaffUser {
  id: string;
  username: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
}

export function StaffManagementCard() {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      if (res.ok && data.staffUser) {
        setStaff(data.staffUser);
        setUsername(data.staffUser.username);
        setEmail(data.staffUser.email);
      }
    } catch (err) {
      console.error("Failed to fetch staff account:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update staff credentials");
      }

      setSuccess(data.message || "Staff credentials saved successfully!");
      setPassword("");
      if (data.user) {
        setStaff(data.user);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-5 w-5 text-sky-400" />
            <span>Data Entry Staff Account</span>
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            Restricted Role
          </Badge>
        </div>
        <CardDescription>
          Create or reset credentials for a Data Entry staff user. This account can post jobs and view listings, but cannot delete jobs, view subscriber lists, or access system settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-500">Loading staff account details...</div>
        ) : staff ? (
          <div className="rounded-lg bg-slate-950/60 p-3.5 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Staff User:</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{staff.username}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Staff Email:</span>
              <span className="text-slate-300 font-mono">{staff.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Staff Login:</span>
              <span className="text-slate-400">
                {staff.lastLoginAt ? formatDate(staff.lastLoginAt) : "Never logged in"}
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-sky-950/20 p-3 border border-sky-500/20 text-xs text-sky-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-sky-400" />
            <span>No Data Entry staff account has been created yet. Fill out the form below to configure one.</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Staff Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. dataentry"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Staff Email
              </label>
              <input
                type="email"
                required
                placeholder="e.g. dataentry@signaljob.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {staff ? "New Password (leave blank to keep current, or enter min 6 chars to reset)" : "Password (min 6 characters)"}
            </label>
            <div className="relative">
              <input
                type="password"
                required={!staff}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={saving || !username || (!staff && !password)}
            className="w-full gap-2 mt-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Credentials...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-3.5 w-3.5" />
                <span>{staff ? "Update / Reset Staff Credentials" : "Create Staff Account"}</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

