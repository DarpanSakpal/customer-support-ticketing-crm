from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud
from app.email_service import send_ticket_email

from app.schemas import (
    TicketCreate,
    TicketCreateResponse,
    TicketDetailResponse,
    TicketListResponse,
    TicketStatsResponse,
    TicketUpdate,
    TicketUpdateResponse,
)


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


# ============================================================
# CREATE TICKET
# ============================================================

@router.post("/", response_model=TicketCreateResponse)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
):
    new_ticket = crud.create_ticket(
        db=db,
        ticket_data=ticket_data,
    )

    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at,
    }


# ============================================================
# LIST / SEARCH / FILTER / PAGINATION
# ============================================================

@router.get("/", response_model=TicketListResponse)
def get_tickets(
    status: str | None = Query(
        default=None,
        description="Filter tickets by status",
    ),
    search: str | None = Query(
        default=None,
        description=(
            "Search by customer name, ticket ID, "
            "email, subject, or description"
        ),
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Page number",
    ),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Number of tickets per page",
    ),
    db: Session = Depends(get_db),
):
    tickets, total, total_pages = crud.get_tickets(
        db=db,
        status_filter=status,
        search=search,
        page=page,
        page_size=page_size,
    )

    return {
        "items": tickets,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


# ============================================================
# TICKET STATISTICS
# ============================================================

@router.get(
    "/stats",
    response_model=TicketStatsResponse,
)
def get_ticket_stats(
    db: Session = Depends(get_db),
):
    return crud.get_ticket_stats(db)


# ============================================================
# GET TICKET DETAILS
# ============================================================

@router.get(
    "/{ticket_id}",
    response_model=TicketDetailResponse,
)
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    ticket = crud.get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    return ticket


# ============================================================
# UPDATE TICKET
# ============================================================

@router.put(
    "/{ticket_id}",
    response_model=TicketUpdateResponse,
)
def update_ticket(
    ticket_id: str,
    update_data: TicketUpdate,
    db: Session = Depends(get_db),
):
    ticket = crud.get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    allowed_statuses = {
        "Open",
        "In Progress",
        "Closed",
    }

    if (
        update_data.status is not None
        and update_data.status not in allowed_statuses
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. "
                "Allowed values: "
                "Open, In Progress, Closed"
            ),
        )

    updated_ticket = crud.update_ticket(
        db=db,
        ticket=ticket,
        update_data=update_data,
    )

    return {
        "success": True,
        "updated_at": updated_ticket.updated_at,
    }


# ============================================================
# SEND TICKET DETAILS BY EMAIL
# ============================================================

@router.post("/{ticket_id}/send-email")
def send_ticket_details_email(
    ticket_id: str,
    db: Session = Depends(get_db),
):
    ticket = crud.get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found",
        )

    email_subject = (
        f"Support Ticket {ticket.ticket_id} - "
        f"{ticket.subject}"
    )

    email_body = f"""
Hello {ticket.customer_name},

Here are the details of your support ticket.

----------------------------------------
CUSTOMER SUPPORT TICKET
----------------------------------------

Ticket ID:
{ticket.ticket_id}

Customer:
{ticket.customer_name}

Email:
{ticket.customer_email}

Status:
{ticket.status}

Subject:
{ticket.subject}

Description:
{ticket.description}

Created At:
{ticket.created_at}

Updated At:
{ticket.updated_at}

----------------------------------------

Thank you,
Customer Support Team
"""

    try:
        send_ticket_email(
            recipient_email=ticket.customer_email,
            subject=email_subject,
            body=email_body,
        )

        return {
            "success": True,
            "message": "Ticket details sent successfully",
            "recipient": ticket.customer_email,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(error)}",
        )