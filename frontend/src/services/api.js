const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export async function getTickets({
  search = "",
  status = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (status) {
    params.append("status", status);
  }

  params.append("page", page);
  params.append("page_size", pageSize);

  const response = await fetch(
    `${API_BASE_URL}/tickets?${params.toString()}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to fetch tickets"
    );
  }

  return response.json();
}


export async function getTicketStats() {
  const response = await fetch(
    `${API_BASE_URL}/tickets/stats`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to fetch ticket statistics"
    );
  }

  return response.json();
}


export async function createTicket(ticketData) {
  const response = await fetch(
    `${API_BASE_URL}/tickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to create ticket"
    );
  }

  return response.json();
}


export async function getTicket(ticketId) {
  const response = await fetch(
    `${API_BASE_URL}/tickets/${ticketId}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to fetch ticket"
    );
  }

  return response.json();
}


/**
 * Update ticket status and/or add a note.
 *
 * Backend expects:
 * {
 *   "status": "In Progress",
 *   "notes": "Customer has been contacted."
 * }
 */
export async function updateTicket(ticketId, ticketData) {
  const response = await fetch(
    `${API_BASE_URL}/tickets/${ticketId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to update ticket"
    );
  }

  return response.json();
}

export async function sendTicketEmail(ticketId) {
  const response = await fetch(
    `${API_BASE_URL}/tickets/${ticketId}/send-email`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to send ticket email"
    );
  }

  return response.json();
}

