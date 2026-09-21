import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { addDays, endOfWeek, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { CheckCircle2, Loader2, LogOut, RefreshCw, Search, XCircle, AlertTriangle, Ban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { PUB } from "@/content/pub";
import { adminDecideReservation, getAdminStatus, listReservations } from "@/lib/reservations.functions";
import { formatReservationDate, formatReservationTime } from "@/lib/reservation-format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Reservations dashboard | The Crown & Treaty" }, { name: "robots", content: "noindex" }] }),
  component: AdminDashboard,
});

type Status = "pending" | "confirmed" | "declined" | "cancelled";
type DateFilter = "all" | "today" | "tomorrow" | "week" | "custom";

const TABS: { key: Status; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "declined", label: "Declined" },
  { key: "cancelled", label: "Cancelled" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const statusFn = useServerFn(getAdminStatus);
  const listFn = useServerFn(listReservations);
  const decideFn = useServerFn(adminDecideReservation);

  const [tab, setTab] = useState<Status>("pending");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDate, setCustomDate] = useState("");
  const [guests, setGuests] = useState("any");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => statusFn() });
  const reservations = useQuery({
    queryKey: ["reservations"],
    queryFn: () => listFn(),
    enabled: status.data?.isAdmin === true,
    refetchInterval: 60_000,
  });

  const rows = reservations.data ?? [];
  const counts = useMemo(() => {
    const c: Record<Status, number> = { pending: 0, confirmed: 0, declined: 0, cancelled: 0 };
    rows.forEach((r) => { c[r.status as Status]++; });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const today = new Date();
    return rows.filter((r) => {
      if (r.status !== tab) return false;
      const d = parseISO(r.reservation_date);
      if (dateFilter === "today" && !isSameDay(d, today)) return false;
      if (dateFilter === "tomorrow" && !isSameDay(d, addDays(today, 1))) return false;
      if (dateFilter === "week") {
        const s = startOfWeek(today, { weekStartsOn: 1 });
        const e = endOfWeek(today, { weekStartsOn: 1 });
        if (d < s || d > e) return false;
      }
      if (dateFilter === "custom" && customDate && r.reservation_date !== customDate) return false;
      if (guests !== "any") {
        const n = r.number_of_guests;
        if (guests === "1-2" && n > 2) return false;
        if (guests === "3-4" && (n < 3 || n > 4)) return false;
        if (guests === "5-8" && (n < 5 || n > 8)) return false;
        if (guests === "9+" && n < 9) return false;
      }
      if (search && !r.customer_name.toLowerCase().includes(search.toLowerCase()) && !r.reservation_reference.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [rows, tab, dateFilter, customDate, guests, search]);

  async function act(id: string, action: "confirm" | "decline" | "cancel") {
    setBusyId(id);
    try {
      const res = await decideFn({ data: { id, action } });
      if (!res.updated) {
        toast.warning("This reservation was already updated.");
      } else if (action === "cancel") {
        toast.success("Reservation cancelled.");
      } else {
        const emailSent = "emailSent" in res ? res.emailSent : false;
        toast.success(action === "confirm" ? "Reservation confirmed successfully." : "Reservation declined successfully.", {
          description: emailSent ? "The customer has been emailed." : "Saved, but the customer email could not be sent — please contact them directly.",
        });
      }
      qc.invalidateQueries({ queryKey: ["reservations"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/auth" });
  }

  if (status.isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!status.data?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-lift">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning" />
          <h1 className="mt-4 text-3xl">Access restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as <strong>{status.data?.email}</strong>, but this account isn't an owner account. Sign in with the pub's owner email ({PUB.email}) to manage reservations.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={signOut}><LogOut /> Sign out</Button>
            <Button asChild><Link to="/">Back to site</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-deep/40">
      <header className="surface-dark">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="text-[0.62rem] tracking-[0.4em] uppercase text-brass">Owner dashboard</p>
            <h1 className="font-serif text-2xl tracking-[0.08em] uppercase">{PUB.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-inherit hover:bg-primary-foreground/10 hover:text-inherit" onClick={() => reservations.refetch()}>
              <RefreshCw className={cn(reservations.isFetching && "animate-spin")} /> Refresh
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-inherit hover:bg-primary-foreground/10 hover:text-inherit"><Link to="/">View site</Link></Button>
            <Button variant="outline-light" size="sm" onClick={signOut}><LogOut /> Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        {/* Tabs */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-lg border p-4 text-left shadow-card transition-all",
                tab === t.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50",
              )}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-80">{t.label}</p>
              <p className="mt-1 font-serif text-4xl">{counts[t.key]}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-4 shadow-card md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search customer name or reference…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="h-11 md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="custom">Custom date</SelectItem>
            </SelectContent>
          </Select>
          {dateFilter === "custom" ? (
            <Input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="md:w-44" />
          ) : <div className="hidden md:block" />}
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="h-11 md:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any party size</SelectItem>
              <SelectItem value="1-2">1–2 guests</SelectItem>
              <SelectItem value="3-4">3–4 guests</SelectItem>
              <SelectItem value="5-8">5–8 guests</SelectItem>
              <SelectItem value="9+">9+ guests</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <div className="mt-6 space-y-4">
          {reservations.isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">No {tab} reservations match these filters.</p>
          ) : (
            filtered.map((r) => (
              <article key={r.id} className="grid gap-5 rounded-lg border border-border bg-card p-5 shadow-card lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-2xl">{r.customer_name}</h2>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">#{r.reservation_reference}</span>
                    {r.email_error && (
                      <span title={r.email_error} className="inline-flex items-center gap-1 rounded-full bg-warning/20 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-warning-foreground">
                        <AlertTriangle className="h-3 w-3" /> Email issue
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-serif text-xl text-primary">
                    {formatReservationDate(r.reservation_date)} · {formatReservationTime(r.reservation_time)} · {r.number_of_guests} {r.number_of_guests === 1 ? "guest" : "guests"}
                  </p>
                  <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                    <div><dt className="inline text-muted-foreground">Phone: </dt><dd className="inline"><a href={`tel:${r.customer_phone}`} className="text-primary">{r.customer_phone}</a></dd></div>
                    <div><dt className="inline text-muted-foreground">Email: </dt><dd className="inline break-all"><a href={`mailto:${r.customer_email}`} className="text-primary">{r.customer_email}</a></dd></div>
                    <div className="sm:col-span-2"><dt className="inline text-muted-foreground">Special requests: </dt><dd className="inline">{r.special_requests || "—"}</dd></div>
                    <div className="sm:col-span-2 text-xs text-muted-foreground">
                      Requested {format(new Date(r.created_at), "d MMM yyyy, HH:mm")}
                      {r.confirmed_at && ` · Confirmed ${format(new Date(r.confirmed_at), "d MMM, HH:mm")}`}
                      {r.declined_at && ` · Declined ${format(new Date(r.declined_at), "d MMM, HH:mm")}`}
                      {r.cancelled_at && ` · Cancelled ${format(new Date(r.cancelled_at), "d MMM, HH:mm")}`}
                    </div>
                  </dl>
                </div>
                <div className="flex flex-row gap-2 lg:flex-col lg:justify-center">
                  {r.status === "pending" && (
                    <>
                      <Button onClick={() => act(r.id, "confirm")} disabled={busyId === r.id} className="flex-1 lg:w-44">
                        {busyId === r.id ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Confirm
                      </Button>
                      <Button variant="destructive" onClick={() => act(r.id, "decline")} disabled={busyId === r.id} className="flex-1 lg:w-44">
                        {busyId === r.id ? <Loader2 className="animate-spin" /> : <XCircle />} Decline
                      </Button>
                    </>
                  )}
                  {r.status === "confirmed" && (
                    <Button variant="outline" onClick={() => act(r.id, "cancel")} disabled={busyId === r.id} className="flex-1 lg:w-44">
                      {busyId === r.id ? <Loader2 className="animate-spin" /> : <Ban />} Cancel booking
                    </Button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
