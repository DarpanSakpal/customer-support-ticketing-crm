import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StatusBadge from "../components/StatusBadge";
import { getTicket, updateTicket } from "../services/api";

function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCloseModal, setShowCloseModal] = useState(false);

  // =====================================================
  // LOAD TICKET
  // =====================================================

  useEffect(() => {
    async function loadTicket() {
      try {
        setLoading(true);
        setError("");

        const data = await getTicket(ticketId);

        setTicket(data);
        setStatus(data.status);
      } catch (err) {
        setError(
          err.message || "Failed to load ticket"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [ticketId]);

  // =====================================================
  // SAVE CHANGES
  // =====================================================

  async function handleSave() {
    if (!ticket) {
      return;
    }

    if (!status) {
      setError("Please select a status.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updateData = {
        status,
      };

      if (note.trim()) {
        updateData.notes = note.trim();
      }

      const response = await updateTicket(
        ticketId,
        updateData
      );

      if (response.success) {
        setSuccess("Ticket updated successfully.");
        setNote("");

        const updatedTicket = await getTicket(ticketId);

        setTicket(updatedTicket);
        setStatus(updatedTicket.status);
      }
    } catch (err) {
      setError(
        err.message || "Failed to update ticket"
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // CLOSE TICKET
  // =====================================================

  async function handleCloseTicket() {
    if (!ticket || ticket.status === "Closed") {
      setShowCloseModal(false);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Immediately save Closed status to backend
      const response = await updateTicket(ticketId, {
        status: "Closed",
      });

      if (response.success) {
        // Reload ticket from database
        const updatedTicket = await getTicket(ticketId);

        setTicket(updatedTicket);
        setStatus(updatedTicket.status);

        setSuccess("Ticket closed successfully.");
        setShowCloseModal(false);
      }
    } catch (err) {
      setError(
        err.message || "Failed to close ticket"
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-[var(--text-secondary)]">
          Loading ticket...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !ticket) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="crm-card p-6">

          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Unable to load ticket
          </h2>

          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>

          <Link
            to="/"
            className="crm-button mt-5 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Back to Dashboard
          </Link>

        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            ← Back to Tickets
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">

            <span className="text-sm font-bold text-[var(--primary)]">
              {ticket.ticket_id}
            </span>

            <StatusBadge status={ticket.status} />

          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {ticket.subject}
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Created{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </p>

        </div>

        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={() => setShowCloseModal(true)}
          disabled={
            ticket.status === "Closed" || saving
          }
          className="crm-button w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {ticket.status === "Closed"
            ? "Ticket Closed"
            : "Close Ticket"}
        </button>

      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* =================================================
          CUSTOMER INFORMATION
      ================================================= */}

      <section className="crm-card overflow-hidden">

        <div className="grid grid-cols-1 divide-y divide-[var(--border)] md:grid-cols-3 md:divide-x md:divide-y-0">

          <div className="p-5">

            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Customer
            </p>

            <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
              {ticket.customer_name}
            </p>

          </div>

          <div className="p-5">

            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Email
            </p>

            <p className="crm-break-anywhere mt-2 text-sm text-[var(--text-secondary)]">
              {ticket.customer_email}
            </p>

          </div>

          <div className="p-5">

            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Last Updated
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {new Date(ticket.updated_at).toLocaleString()}
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid gap-5 lg:grid-cols-[1.55fr_0.85fr]">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-5">

          {/* DESCRIPTION */}

          <section className="crm-card overflow-hidden">

            <div className="border-b border-[var(--border)] px-5 py-4">

              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Description
              </h2>

            </div>

            <div className="p-5">

              <p className="crm-break-anywhere whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                {ticket.description}
              </p>

            </div>

          </section>

          {/* ACTIVITY */}

          <section className="crm-card overflow-hidden">

            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">

              <div>

                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  Activity
                </h2>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Internal notes and ticket history
                </p>

              </div>

              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {ticket.notes?.length || 0}{" "}
                {ticket.notes?.length === 1
                  ? "note"
                  : "notes"}
              </span>

            </div>

            <div className="p-5">

              {ticket.notes &&
              ticket.notes.length > 0 ? (

                <div className="space-y-5">

                  {ticket.notes.map((item) => (

                    <div
                      key={item.id}
                      className="relative border-l-2 border-[var(--border)] pl-5"
                    >

                      <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[var(--primary)] ring-4 ring-[var(--surface)]" />

                      <p className="crm-break-anywhere whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
                        {item.note_text}
                      </p>

                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </p>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="rounded-lg border border-dashed border-[var(--border)] px-5 py-10 text-center">

                  <p className="text-sm text-[var(--text-secondary)]">
                    No notes have been added yet.
                  </p>

                </div>

              )}

            </div>

          </section>

        </div>

        {/* =================================================
            RIGHT - UPDATE TICKET
        ================================================= */}

        <section className="crm-card h-fit overflow-hidden">

          <div className="border-b border-[var(--border)] px-5 py-4">

            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Update Ticket
            </h2>

            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Change the status or add an internal note.
            </p>

          </div>

          <div className="space-y-5 p-5">

            {/* STATUS */}

            <div>

              <label
                htmlFor="status"
                className="mb-2 block text-sm font-semibold text-[var(--text-primary)]"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                disabled={saving}
                className="crm-select"
              >

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

            {/* NOTE */}

            <div>

              <label
                htmlFor="note"
                className="mb-2 block text-sm font-semibold text-[var(--text-primary)]"
              >
                Add Note
              </label>

              <textarea
                id="note"
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="Write an internal note..."
                rows={6}
                disabled={saving}
                className="crm-textarea"
              />

              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Notes are stored in the ticket activity timeline.
              </p>

            </div>

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="crm-button w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </section>

      </div>

      {/* =================================================
          CLOSE MODAL
      ================================================= */}

      {showCloseModal && (

        <div className="crm-modal-backdrop">

          <div className="crm-modal p-6">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              !
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              Close Ticket?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              This will change the ticket status to
              Closed. The ticket and its activity will
              remain available.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowCloseModal(false)
                }
                disabled={saving}
                className="crm-button rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCloseTicket}
                disabled={saving}
                className="crm-button rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Closing..."
                  : "Close Ticket"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TicketDetails;