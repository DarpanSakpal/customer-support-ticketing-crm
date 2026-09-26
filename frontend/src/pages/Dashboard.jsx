import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { getTickets } from "../services/api";

function Dashboard() {
  const [tickets, setTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

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
  // RESET PAGE WHEN SEARCH/FILTER CHANGES
  // =====================================================

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  // =====================================================
  // FETCH TICKETS
  // =====================================================

  useEffect(() => {
    async function loadTickets() {
      try {
        setError("");

        if (tickets.length === 0) {
          setLoading(true);
        } else {
          setIsSearching(true);
        }

        const data = await getTickets({
          search: debouncedSearch,
          status,
          page,
          pageSize,
        });

        setTickets(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err);

        setError(
          err.message || "Failed to load tickets."
        );
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    }

    loadTickets();
  }, [debouncedSearch, status, page, pageSize]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    return {
      total: total,

      open: tickets.filter(
        (ticket) => ticket.status === "Open"
      ).length,

      inProgress: tickets.filter(
        (ticket) => ticket.status === "In Progress"
      ).length,

      closed: tickets.filter(
        (ticket) => ticket.status === "Closed"
      ).length,
    };
  }, [tickets, total]);

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  function clearFilters() {
    setSearch("");
    setStatus("");
    setPage(1);
  }

  // =====================================================
  // PAGINATION
  // =====================================================

  function goToPage(newPage) {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);
  }

  function getPageNumbers() {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }

  // =====================================================
  // DISPLAY RANGE
  // =====================================================

  const startItem =
    total === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endItem =
    total === 0
      ? 0
      : Math.min(page * pageSize, total);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-5rem)] px-4 pb-8 pt-12 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">

            <div className="h-8 w-64 rounded-lg bg-[var(--surface-soft)]" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-[var(--surface-soft)]"
                />
              ))}
            </div>

            <div className="h-96 rounded-2xl bg-[var(--surface-soft)]" />

          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 pb-8 pt-12 sm:px-6 sm:pt-14 lg:px-8">

      <div className="mx-auto max-w-7xl space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="animate-slide-up">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Support workspace
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Ticket Dashboard
              </h1>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Manage and track customer support requests.
              </p>

            </div>

            <Link
              to="/create-ticket"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Create Ticket
            </Link>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="crm-card animate-slide-up p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Total Tickets
                </p>

                <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
                  {statistics.total}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">

                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                  />

                  <path d="M8 9h8M8 13h8M8 17h5" />
                </svg>

              </div>

            </div>

          </div>

          {/* OPEN */}

          <div className="crm-card animate-slide-up p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Open
                </p>

                <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
                  {statistics.open}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
              </div>

            </div>

          </div>

          {/* IN PROGRESS */}

          <div className="crm-card animate-slide-up p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  In Progress
                </p>

                <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
                  {statistics.inProgress}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
              </div>

            </div>

          </div>

          {/* CLOSED */}

          <div className="crm-card animate-slide-up p-5">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Closed
                </p>

                <p className="mt-3 text-3xl font-bold text-[var(--text-primary)]">
                  {statistics.closed}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            TICKET SECTION
        ================================================= */}

        <section className="crm-card animate-slide-up overflow-hidden">

          {/* HEADER */}

          <div className="border-b border-[var(--border)] p-5 sm:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  All Tickets
                </h2>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Search and manage customer support tickets.
                </p>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* SEARCH */}

                <div className="relative w-full sm:w-80">

                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search tickets..."
                    className="crm-input py-3 pl-10 pr-10 text-sm"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}

                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">

                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

                    </div>
                  )}

                </div>

                {/* STATUS */}

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="crm-input min-w-40 px-4 py-3 text-sm"
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

            {/* ACTIVE FILTERS */}

            {(search || status) && (

              <div className="mt-4 flex flex-wrap items-center gap-2">

                {search && (
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    Search: {search}
                  </span>
                )}

                {status && (
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                    Status: {status}
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[var(--text-secondary)] hover:text-blue-600"
                >
                  Clear filters
                </button>

              </div>

            )}

          </div>

          {/* ERROR */}

          {error && (

            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>

          )}

          {/* =================================================
              TABLE
          ================================================= */}

          {tickets.length > 0 ? (

            <>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead>

                    <tr className="border-b border-[var(--border)] bg-[var(--surface-soft)]">

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Ticket
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Subject
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-[var(--border)]">

                    {tickets.map((ticket) => (

                      <tr
                        key={ticket.ticket_id}
                        className="transition hover:bg-[var(--surface-soft)]"
                      >

                        <td className="px-6 py-4">

                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {ticket.ticket_id}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <div>

                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              {ticket.customer_name}
                            </p>

                            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                              {ticket.customer_email}
                            </p>

                          </div>

                        </td>

                        <td className="max-w-xs px-6 py-4">

                          <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                            {ticket.subject}
                          </p>

                        </td>

                        <td className="px-6 py-4">

                          <StatusBadge
                            status={ticket.status}
                          />

                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--text-secondary)]">

                          {new Date(
                            ticket.created_at
                          ).toLocaleDateString()}

                        </td>

                        <td className="px-6 py-4 text-right">

                          <Link
                            to={`/tickets/${ticket.ticket_id}`}
                            className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
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

              <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                {/* RANGE */}

                <p className="text-sm text-[var(--text-secondary)]">

                  Showing{" "}

                  <span className="font-semibold text-[var(--text-primary)]">
                    {startItem}
                  </span>{" "}

                  to{" "}

                  <span className="font-semibold text-[var(--text-primary)]">
                    {endItem}
                  </span>{" "}

                  of{" "}

                  <span className="font-semibold text-[var(--text-primary)]">
                    {total}
                  </span>{" "}

                  tickets

                </p>

                {/* BUTTONS */}

                {totalPages > 1 && (

                  <div className="flex items-center gap-1">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {/* PAGE NUMBERS */}

                    <div className="hidden items-center gap-1 sm:flex">

                      {getPageNumbers().map(
                        (pageNumber, index) =>
                          pageNumber === "..." ? (

                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-sm text-[var(--text-muted)]"
                            >
                              ...
                            </span>

                          ) : (

                            <button
                              key={pageNumber}
                              type="button"
                              onClick={() =>
                                goToPage(pageNumber)
                              }
                              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                                pageNumber === page
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
                              }`}
                            >
                              {pageNumber}
                            </button>

                          )
                      )}

                    </div>

                    {/* MOBILE PAGE */}

                    <span className="px-3 text-sm font-medium text-[var(--text-secondary)] sm:hidden">
                      {page} / {totalPages}
                    </span>

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>

                  </div>

                )}

              </div>

            </>

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--text-muted)]">

                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >

                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                  />

                  <path d="M8 9h8M8 13h6" />

                </svg>

              </div>

              <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">
                No tickets found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">

                {search || status
                  ? "Try changing your search or filter."
                  : "Create your first support ticket to get started."}

              </p>

              {(search || status) && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear filters
                </button>

              )}

              {!search && !status && (

                <Link
                  to="/create-ticket"
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Create Ticket
                </Link>

              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default Dashboard;