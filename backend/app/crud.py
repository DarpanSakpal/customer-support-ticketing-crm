from datetime import datetime

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app import models
from app.schemas import TicketCreate, TicketUpdate


# =========================================================
# GENERATE TICKET ID
# =========================================================

def generate_ticket_id(db: Session) -> str:
    last_ticket = (
        db.query(models.Ticket)
        .order_by(models.Ticket.id.desc())
        .first()
    )

    if not last_ticket:
        next_number = 1
    else:
        next_number = last_ticket.id + 1

    return f"TKT-{next_number:03d}"


# =========================================================
# CREATE TICKET
# =========================================================

def create_ticket(
    db: Session,
    ticket_data: TicketCreate,
):
    ticket_id = generate_ticket_id(db)

    new_ticket = models.Ticket(
        ticket_id=ticket_id,
        customer_name=ticket_data.customer_name,
        customer_email=ticket_data.customer_email,
        subject=ticket_data.subject,
        description=ticket_data.description,
        status="Open",
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


# =========================================================
# GET TICKETS
# Search + Filter + Pagination
# =========================================================

def get_tickets(
    db: Session,
    status_filter: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 10,
):
    query = db.query(models.Ticket)

    # -----------------------------------------------------
    # Status Filter
    # -----------------------------------------------------

    if status_filter:
        query = query.filter(
            models.Ticket.status == status_filter
        )

    # -----------------------------------------------------
    # Search
    # -----------------------------------------------------

    if search:
        search_term = f"%{search}%"

        query = query.filter(
            or_(
                models.Ticket.customer_name.ilike(search_term),
                models.Ticket.ticket_id.ilike(search_term),
                models.Ticket.customer_email.ilike(search_term),
                models.Ticket.subject.ilike(search_term),
                models.Ticket.description.ilike(search_term),
            )
        )

    # -----------------------------------------------------
    # Total Matching Records
    # -----------------------------------------------------

    total = query.count()

    # -----------------------------------------------------
    # Pagination
    # -----------------------------------------------------

    offset = (page - 1) * page_size

    tickets = (
        query
        .order_by(models.Ticket.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # -----------------------------------------------------
    # Total Pages
    # -----------------------------------------------------

    total_pages = (
        (total + page_size - 1) // page_size
        if total > 0
        else 0
    )

    return tickets, total, total_pages


# =========================================================
# GET SINGLE TICKET
# =========================================================

def get_ticket_by_id(
    db: Session,
    ticket_id: str,
):
    return (
        db.query(models.Ticket)
        .filter(
            models.Ticket.ticket_id == ticket_id
        )
        .first()
    )


# =========================================================
# UPDATE TICKET
# Status + Notes
# =========================================================

def update_ticket(
    db: Session,
    ticket: models.Ticket,
    update_data: TicketUpdate,
):
    # -----------------------------------------------------
    # Update Status
    # -----------------------------------------------------

    if update_data.status is not None:
        ticket.status = update_data.status

    # -----------------------------------------------------
    # Add Note
    # -----------------------------------------------------

    if update_data.notes:
        new_note = models.Note(
            ticket_id=ticket.id,
            note_text=update_data.notes,
        )

        db.add(new_note)

    # -----------------------------------------------------
    # Update Timestamp
    # -----------------------------------------------------

    ticket.updated_at = datetime.utcnow()

    # -----------------------------------------------------
    # Save Changes
    # -----------------------------------------------------

    db.commit()
    db.refresh(ticket)

    return ticket


# =========================================================
# TICKET STATISTICS
# =========================================================

def get_ticket_stats(db: Session):
    """
    Get ticket statistics across the entire database.

    Statistics are calculated separately from the
    paginated ticket list so dashboard numbers remain
    accurate.
    """

    # Total tickets
    total = (
        db.query(models.Ticket)
        .count()
    )

    # Open tickets
    open_count = (
        db.query(models.Ticket)
        .filter(
            models.Ticket.status == "Open"
        )
        .count()
    )

    # In Progress tickets
    in_progress_count = (
        db.query(models.Ticket)
        .filter(
            models.Ticket.status == "In Progress"
        )
        .count()
    )

    # Closed tickets
    closed_count = (
        db.query(models.Ticket)
        .filter(
            models.Ticket.status == "Closed"
        )
        .count()
    )

    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress_count,
        "closed": closed_count,
    }