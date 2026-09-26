import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTicket } from "../services/api";

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    setError("");
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  function validateForm() {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name =
        "Customer name is required.";
    } else if (
      formData.customer_name.trim().length < 2
    ) {
      newErrors.customer_name =
        "Customer name must contain at least 2 characters.";
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email =
        "Customer email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.customer_email
      )
    ) {
      newErrors.customer_email =
        "Enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject =
        "Subject is required.";
    } else if (
      formData.subject.trim().length < 3
    ) {
      newErrors.subject =
        "Subject must contain at least 3 characters.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    } else if (
      formData.description.trim().length < 5
    ) {
      newErrors.description =
        "Description must contain at least 5 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const createdTicket = await createTicket({
        customer_name:
          formData.customer_name.trim(),

        customer_email:
          formData.customer_email.trim(),

        subject:
          formData.subject.trim(),

        description:
          formData.description.trim(),
      });

      setSuccess(
        "Ticket created successfully."
      );

      setTimeout(() => {
        navigate(
          `/tickets/${createdTicket.ticket_id}`
        );
      }, 600);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // RESET FORM
  // =====================================================

  function handleReset() {
    setFormData({
      customer_name: "",
      customer_email: "",
      subject: "",
      description: "",
    });

    setErrors({});
    setError("");
    setSuccess("");
  }

  return (
    <main className="min-h-[calc(100vh-86px)] px-5 py-8 sm:px-7 lg:px-8">
      <div className="mx-auto max-w-[1100px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition hover:text-blue-500"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>

            Back to tickets
          </Link>

          <p className="text-sm font-medium text-blue-500">
            Support workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Create Ticket
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Create a new customer support request.
          </p>
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="crm-card mb-5 flex items-center gap-3 border-green-900/40 bg-green-950/20 px-4 py-3 text-sm text-green-400">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/15">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {success}
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="crm-card mb-5 flex items-start gap-3 border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>

            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className="crm-card overflow-hidden">

            {/* FORM HEADER */}

            <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Ticket Information
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Enter the customer's details and describe
                their issue.
              </p>
            </div>

            {/* FORM BODY */}

            <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">

              {/* =================================================
                  CUSTOMER INFORMATION
              ================================================= */}

              <div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Customer Information
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Information about the customer submitting
                    the request.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="customer_name"
                      className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
                    >
                      Customer Name
                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      id="customer_name"
                      name="customer_name"
                      type="text"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      className={`crm-input h-11 px-3 text-sm ${
                        errors.customer_name
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />

                    {errors.customer_name && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.customer_name}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="customer_email"
                      className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
                    >
                      Customer Email
                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                      className={`crm-input h-11 px-3 text-sm ${
                        errors.customer_email
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />

                    {errors.customer_email && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.customer_email}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* DIVIDER */}

              <div className="border-t border-[var(--border)]" />

              {/* =================================================
                  TICKET INFORMATION
              ================================================= */}

              <div>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Request Details
                  </p>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Describe the issue the customer needs help
                    with.
                  </p>
                </div>

                <div className="space-y-5">

                  {/* SUBJECT */}

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
                    >
                      Subject
                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Briefly describe the issue"
                      className={`crm-input h-11 px-3 text-sm ${
                        errors.subject
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />

                    {errors.subject && (
                      <p className="mt-1.5 text-xs text-red-400">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
                    >
                      Description
                      <span className="ml-1 text-red-400">
                        *
                      </span>
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={7}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide detailed information about the customer's issue..."
                      className={`crm-input resize-y px-3 py-3 text-sm leading-6 ${
                        errors.description
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />

                    <div className="mt-1.5 flex items-center justify-between">
                      {errors.description ? (
                        <p className="text-xs text-red-400">
                          {errors.description}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)]">
                          Include any relevant details that
                          could help resolve the issue.
                        </p>
                      )}

                      <span className="text-xs text-[var(--text-muted)]">
                        {formData.description.length}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* =================================================
                FORM FOOTER
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--surface-soft)] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="crm-button h-11 rounded-lg border border-[var(--border)] px-5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="crm-button flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>

                    Create Ticket
                  </>
                )}
              </button>

            </div>
          </div>
        </form>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="mt-5 flex items-start gap-3 px-1">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v6M12 7h.01" />
          </svg>

          <p className="text-xs leading-5 text-[var(--text-muted)]">
            New tickets are automatically assigned a unique
            ticket ID and start with an Open status.
          </p>
        </div>

      </div>
    </main>
  );
}

export default CreateTicket;