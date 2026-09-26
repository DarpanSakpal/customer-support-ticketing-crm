import { NavLink, Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`
          crm-sidebar fixed inset-y-0 left-0 z-50
          flex w-[276px] flex-col
          transition-transform duration-200
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-[86px] shrink-0 items-center border-b border-[var(--border)] px-6">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              C
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-bold text-[var(--text-primary)]">
                Support CRM
              </h1>

              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                Customer Support
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Workspace
          </p>

          <nav className="space-y-1">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `crm-nav-item flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium ${
                  isActive
                    ? "active"
                    : "text-[var(--text-secondary)]"
                }`
              }
            >
              <svg
                className="h-[18px] w-[18px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="4"
                  y="4"
                  width="6"
                  height="6"
                  rx="1"
                />
                <rect
                  x="14"
                  y="4"
                  width="6"
                  height="6"
                  rx="1"
                />
                <rect
                  x="4"
                  y="14"
                  width="6"
                  height="6"
                  rx="1"
                />
                <rect
                  x="14"
                  y="14"
                  width="6"
                  height="6"
                  rx="1"
                />
              </svg>

              Dashboard
            </NavLink>

            <NavLink
              to="/"
              onClick={onClose}
              className="crm-nav-item flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[var(--text-secondary)]"
            >
              <svg
                className="h-[18px] w-[18px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="4"
                  y="3"
                  width="16"
                  height="18"
                  rx="2"
                />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>

              Tickets
            </NavLink>
          </nav>

          <div className="my-6 border-t border-[var(--border)]" />

          <Link
            to="/create-ticket"
            onClick={onClose}
            className="crm-button flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <span className="text-base leading-none">
              +
            </span>

            Create Ticket
          </Link>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--border)] p-4">
          <div className="px-2 py-2">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              Support CRM
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[var(--text-muted)]">
              Customer support management.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;