import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatusBadge from "../components/StatusBadge";
import { getTicketStats, getTickets } from "../services/api";

function Dashboard() {
  const [tickets, setTickets] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    closed: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [error, setError] = useState("");
  const [statsError, setStatsError] = useState("");

  // =====================================================
  // DEBOUNCE SEARCH
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // =====================================================
  // LOAD TICKETS
  // =====================================================

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoading(true);
        setError("");

        const data = await getTickets({
          search: debouncedSearch,
          status,
          page,
          pageSize,
        });

        setTickets(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 0);
      } catch (err) {
        setError(err.message || "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, [debouncedSearch, status, page]);

  // =====================================================
  // LOAD STATISTICS
  // =====================================================

  useEffect(() => {
    async function loadStats() {
      try {
        setStatsLoading(true);
        setStatsError("");

        const data = await getTicketStats();

        setStats({
          total: data.total || 0,
          open: data.open || 0,
          in_progress: data.in_progress || 0,
          closed: data.closed || 0,
        });
      } catch (err) {
        setStatsError(
          err.message || "Failed to load statistics."
        );
      } finally {
        setStatsLoading(false);
      }
    }

    loadStats();
  }, []);

  // =====================================================
  // HANDLERS
  // =====================================================

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleStatusChange(event) {
    setStatus(event.target.value);
    setPage(1);
  }

  function handleClearFilters() {
    setSearch("");
    setStatus("");
    setPage(1);
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "-";
    }

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const hasFilters =
    search.trim() !== "" || status !== "";

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage customer support tickets and requests.
          </p>
        </div>

        <Link
          to="/create-ticket"
          className="crm-button w-full rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] sm:w-auto"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Create Ticket
        </Link>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      {statsError && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {statsError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <div className="crm-card p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Total Tickets
              </p>

              <p className="crm-stat-value mt-2 text-3xl font-bold text-[var(--text-primary)]">
                {statsLoading ? "—" : stats.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="5"
                  y="4"
                  width="14"
                  height="16"
                  rx="2"
                />
                <path d="M9 8h6M9 12h6M9 16h4" />
              </svg>
            </div>

          </div>
        </div>


        {/* Open */}

        <div className="crm-card p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Open
              </p>

              <p className="crm-stat-value mt-2 text-3xl font-bold text-[var(--text-primary)]">
                {statsLoading ? "—" : stats.open}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
            </div>

          </div>
        </div>


        {/* In Progress */}

        <div className="crm-card p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                In Progress
              </p>

              <p className="crm-stat-value mt-2 text-3xl font-bold text-[var(--text-primary)]">
                {statsLoading ? "—" : stats.in_progress}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                <path d="m5.6 5.6 2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
              </svg>
            </div>

          </div>
        </div>


        {/* Closed */}

        <div className="crm-card p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Closed
              </p>

              <p className="crm-stat-value mt-2 text-3xl font-bold text-[var(--text-primary)]">
                {statsLoading ? "—" : stats.closed}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

          </div>
        </div>

      </div>


      {/* =================================================
          ALL TICKETS
      ================================================= */}

      <section className="crm-card overflow-hidden">

        {/* HEADER */}

        <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                All Tickets
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {total}{" "}
                {total === 1 ? "ticket" : "tickets"} in your workspace
              </p>
            </div>


            {/* =================================================
                SEARCH + STATUS FILTER
            ================================================= */}

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

              {/* SEARCH */}

              <div className="relative w-full sm:w-[300px]">

                <svg
                  className="pointer-events-none absolute left-4 top-1/2 z-20 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path d="m20 20-4-4" />
                </svg>


                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search tickets..."
                  aria-label="Search tickets"

                  /*
                   * IMPORTANT:
                   * Inline padding prevents the existing
                   * .crm-input CSS from overriding the
                   * search icon spacing.
                   */
                  style={{
                    paddingLeft: "44px",
                    paddingRight: "16px",
                  }}

                  className="crm-input h-11 w-full rounded-lg text-sm"
                />

              </div>


              {/* STATUS FILTER */}

              <div className="w-full sm:w-[210px]">

                <select
                  value={status}
                  onChange={handleStatusChange}
                  aria-label="Filter tickets by status"
                  className="crm-select h-11 w-full rounded-lg text-sm"
                >
                  <option value="">
                    All Statuses
                  </option>

                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>

              </div>

            </div>

          </div>


          {/* ACTIVE FILTERS */}

          {hasFilters && (
            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">

              <p className="text-xs text-[var(--text-secondary)]">

                {search && (
                  <>
                    Search:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      "{search}"
                    </span>
                  </>
                )}

                {search && status && " • "}

                {status && (
                  <>
                    Status:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {status}
                    </span>
                  </>
                )}

              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Clear filters
              </button>

            </div>
          )}

        </div>


        {/* ERROR */}

        {error && (
          <div className="m-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading ? (

          <div className="flex min-h-[280px] items-center justify-center">
            <div className="text-sm text-[var(--text-secondary)]">
              Loading tickets...
            </div>
          </div>

        ) : tickets.length === 0 ? (

          /* EMPTY STATE */

          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-[var(--text-muted)]">

              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="2"
                />

                <path d="M8 9h8M8 13h5" />
              </svg>

            </div>

            <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
              No tickets found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
              Try changing your search or status filter.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Clear filters
              </button>
            )}

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <>
            <div className="crm-table-container">

              <table className="crm-table w-full text-left">

                <thead>
                  <tr className="border-b border-[var(--border)]">

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Ticket
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Subject
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Status
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Created
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Action
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticket_id}
                      className="crm-table-row border-b border-[var(--border-light)] last:border-b-0"
                    >

                      {/* Ticket */}

                      <td className="px-6 py-4">

                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="text-sm font-bold text-[var(--primary)] hover:underline"
                        >
                          {ticket.ticket_id}
                        </Link>

                      </td>


                      {/* Customer */}

                      <td className="max-w-[230px] px-6 py-4">

                        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                          {ticket.customer_name}
                        </p>

                        <p className="crm-break-anywhere mt-1 text-xs text-[var(--text-secondary)]">
                          {ticket.customer_email}
                        </p>

                      </td>


                      {/* Subject */}

                      <td className="max-w-[280px] px-6 py-4">

                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                          {ticket.subject}
                        </p>

                      </td>


                      {/* Status */}

                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>


                      {/* Created */}

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {formatDate(ticket.created_at)}
                      </td>


                      {/* Action */}

                      <td className="px-6 py-4 text-right">

                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
                        >
                          View
                        </Link>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 0 && (
              <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                <p className="text-xs text-[var(--text-secondary)]">
                  Page{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {totalPages}
                  </span>
                </p>


                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((previous) =>
                        Math.max(previous - 1, 1)
                      )
                    }
                    className="crm-button rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40"
                  >
                    Previous
                  </button>


                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() =>
                      setPage((previous) =>
                        Math.min(
                          previous + 1,
                          totalPages
                        )
                      )
                    }
                    className="crm-button rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              </div>
            )}

          </>
        )}

      </section>

    </div>
  );
}

export default Dashboard;