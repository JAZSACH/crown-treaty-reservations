# Roadmap

## Reservation system test (resumed)
- [x] Submit live test booking, capture reference — CT-10006 (Oliver Hartley) & CT-10007 (Priya Nair), success state shows "Reservation request received" + "not confirmed yet"
- [x] Verify owner notification email content — no send errors recorded (email_error null); owner email content defined in reservation-emails.server.ts
- [x] Test Confirm flow (one-use link) — CT-10006 confirmed, "Oliver Hartley has been emailed", reuse blocked
- [x] Test Decline flow (one-use link) — CT-10007 declined, "Priya Nair has been emailed", reuse blocked

## Notes
- Playwright lesson: time/guests dropdowns are native <select>; use select_option.
- Open: owner to check inbox for CT-10003 / CT-10006 / CT-10007 request emails and confirm-test CT-10006 from their own email.
- Open: switch Resend sender when owner provides a domain.
- Open: replace placeholder images/menu with real pub content.
