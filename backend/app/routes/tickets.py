from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud
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


# =========================================================
# CREATE TICKET
# =========================================================

@router.post(
    "/",
    response_model=TicketCreateResponse,
)
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


# =========================================================
# LIST TICKETS
# =========================================================

@router.get(
    "/",
    response_model=TicketListResponse,
)
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


# =========================================================
# TICKET STATISTICS
# =========================================================

@router.get(
    "/stats",
    response_model=TicketStatsResponse,
)
def get_ticket_stats(
    db: Session = Depends(get_db),
):
    return crud.get_ticket_stats(db)


# =========================================================
# GET SINGLE TICKET
# =========================================================

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


# =========================================================
# UPDATE TICKET
# =========================================================

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
                "Invalid status. Allowed values: "
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