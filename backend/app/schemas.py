from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


class TicketCreate(BaseModel):
    customer_name: str = Field(min_length=2)
    customer_email: EmailStr
    subject: str = Field(min_length=3)
    description: str = Field(min_length=5)


class TicketCreateResponse(BaseModel):
    ticket_id: str
    created_at: datetime


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: int
    note_text: str
    created_at: datetime


class TicketDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: str
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime
    notes: list[NoteResponse] = []


class TicketUpdate(BaseModel):
    status: str | None = None
    notes: str | None = Field(default=None, min_length=1)

    @field_validator("notes")
    @classmethod
    def validate_notes(cls, value):
        if value is not None and not value.strip():
            raise ValueError(
                "Note cannot be empty or contain only spaces."
            )

        return value.strip() if value is not None else value


class TicketUpdateResponse(BaseModel):
    success: bool
    updated_at: datetime


class TicketListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime


class TicketListResponse(BaseModel):
    items: list[TicketListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class TicketStatsResponse(BaseModel):
    total: int
    open: int
    in_progress: int
    closed: int