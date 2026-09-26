function Navbar({
  onMenuClick,
  darkMode,
  onToggleDarkMode,
}) {
  return (
    <header className="crm-navbar fixed left-0 right-0 top-0 z-30 h-[86px] lg:left-[276px]">
      <div className="flex h-full items-center justify-between px-5 sm:px-7">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={onMenuClick}
            className="crm-button flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] lg:hidden"
            aria-label="Open menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <p className="text-[15px] font-semibold text-[var(--text-secondary)]">
            Customer Support Workspace
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Theme */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="crm-button flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M21 12.8A8.5 8.5 0 1111.2 3 6.7 6.7 0 0021 12.8z" />
              </svg>
            )}
          </button>

          {/* Avatar */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            DS
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;