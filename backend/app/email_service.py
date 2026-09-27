import smtplib
from email.message import EmailMessage

from app.config import settings


def send_ticket_email(
    recipient_email: str,
    subject: str,
    body: str,
):
    message = EmailMessage()

    message["From"] = settings.smtp_username
    message["To"] = recipient_email
    message["Subject"] = subject

    message.set_content(body)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        server.login(
            settings.smtp_username,
            settings.smtp_password,
        )
        server.send_message(message)