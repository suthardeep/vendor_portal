#+ Onboarding Flow (visual)

When user opens the app (e.g. `http://localhost:5173` or production domain), run the onboarding sequence below.

```mermaid
flowchart TD
  Start([Start]) --> CheckToken{Token in localStorage?}
  CheckToken -- No --> Login[/Redirect to /login\n(STEP-6: mobile verify)-> Registration flow/]
  CheckToken -- Yes --> Validate{Validate token with backend}

  Validate -- "Valid & not expired" --> CheckRegistered{isRegistered?}
  Validate -- "Expired" --> TryRefresh{Send refresh token}

  TryRefresh -- "Refresh success" --> StoreTokens[Store new tokens] --> CheckRegistered
  TryRefresh -- "Refresh missing/expired or 401" --> Login
  TryRefresh -- "Network/server error" --> RetryOrShowError[Show error + retry option]

  CheckRegistered -- No --> CollectProfile[/Redirect to /registration\n(STEP-7: collect name & email)/]
  CheckRegistered -- Yes --> CheckBusiness{isBusinessRegistrationComplete?}

  CheckBusiness -- No --> RedirectBusiness[/Redirect to /business-registration?step=<first-incomplete-step>/]
  CheckBusiness -- Yes --> CheckApproval{isApproved / isVerified?}

  CheckApproval -- Yes --> Dashboard[/Redirect to /dashboard/]
  CheckApproval -- No --> Pending[Show "Approval pending" UI\n(blur/disable dashboard, CTA: check status/contact support)]

  CollectProfile --> VerifyEmail{Email verified?}
  VerifyEmail -- No --> EmailVerification[/Send verification email / wait\n(keep email stored temporarily)/]
  VerifyEmail -- Yes --> SubmitProfile[Send fullname (and email if needed) to backend] --> RedirectBusiness

  RetryOrShowError -- "Retry success" --> TryRefresh
  RetryOrShowError -- "Retry fail" --> Login

  classDef action fill:#f3f4f6,stroke:#111827,stroke-width:1px;
  class Login,CollectProfile,RedirectBusiness,Dashboard action;
```

---

## Flow explanation (step-by-step)

- Start: When app loads, run auth initialization.
- STEP-1: Check for an access token in `localStorage`.
  - No token → redirect to `/login` (STEP-6).
  - Token found → STEP-2.
- STEP-2: Validate token with backend.
  - If token is valid and not expired → STEP-3.
  - If expired → attempt refresh using refresh token.
    - If refresh token missing/expired or backend returns 401 → redirect to `/login`.
    - If refresh succeeds → store new tokens and proceed to STEP-3.
    - If refresh fails due to transient errors → show retry option and keep user on loading/splash; if retry fails, send to `/login`.
- STEP-3: If `isRegistered` is false → redirect to `/registration` (STEP-7). If true → STEP-4.
- STEP-4: If `isBusinessRegistrationComplete` is false → query incomplete steps and redirect to `/business-registration?step=<first-incomplete-step>`. If true → STEP-5.
- STEP-5: If `isApproved` or `isVerified` is false → show an "Approval pending" state (disable or blur dashboard, show CTA). If true → redirect to `/dashboard`.
- STEP-6: Login / mobile verification path. After successful mobile verification redirect user to registration to collect fullname + email.
- STEP-7: Collect missing profile fields (fullname, email), verify email, then redirect to `/business-registration?step=1`.

---

## Edge cases & recommended handling

- Partial token state: access token present but refresh token missing — treat as expired and require login.
- Clock skew: consider treating tokens as expired 30s earlier than the expiry to avoid edge-case failures.
- Concurrent refresh attempts: serialize refresh requests (single refresh in-flight) to avoid race conditions.
- Refresh returned tokens but account flagged inactive/blocked: log out user and show explicit message.
- Network failures on validation/refresh: show a retry UI with exponential backoff; preserve intended navigation.
- Revoked tokens: if backend returns a revoked status, clear tokens, redirect to login and show security message.
- Registration race: make business-registration and profile endpoints idempotent and surface friendly errors.
- Missing or malformed incomplete-steps response: fallback to `?step=1` and log telemetry for investigation.
- 2FA required: if backend requires a second step, route user to 2FA verification before storing tokens.
- Rate limiting: surface `Retry-After` and delay retries accordingly.

---

## Implementation notes (practical tips)

- Centralize auth logic in one module (checkToken, validateToken, refreshToken, getUser) so UI code only consumes stable hooks/APIs.
- Preserve intended redirect (store attempted route while token is refreshed or login happens).
- Use clear user messages: "Refreshing session…", "Session expired — redirecting to login", etc.
- Instrument critical failures in Sentry with context (token timestamps, endpoint, response codes).
- Use short local expirations (clock skew) and request validation from server whenever possible.


----


// this is what i wrote

when user enters url : http://localhost:5173 (later change to domain name)

STEP-1: 
Check if token exists in the localstorage
    NO - redirect to /login -> STEP - 6
    YES - STEP-2 

STEP-2
loading starts -> i send token from localstorage to backend to check the user's auth info -> Token exists means user exists
    isTokenExpired ?
        Yes - Send refresh token to generate new accesstoken
            isRefreshTokenExpired ?
                Yes - return 401 and redirect to /login -> STEP-6
                No - generate access token and send required details
                    - frontend stores tokens
                    - STEP-3
        No - (/get-profile api) -> STEP-3


STEP-3
    isRegistered ?
        NO - redirect to /registration -> STEP-7
        YES - STEP-4

STEP-4 
    isBusinessRegistrationComplete ?
        No - Check incomplete steps and redirect accordingly
        Yes - STEP-5

STEP-5 
    isApproved/isVerified ?
        No - Show approval pending + blur dashboard
        Yes - redirect to /dashboard

STEP-6
    - Verify mobile number -> redirect to register to enter fullname and email
    - STEP-7

STEP-7
    - Enter full name and email
    - Verify email (store email while veryfying only)
    - send fullname (and maybe email) in payload as email is already stored while verifying
    - redirect to /business-registration?step=1 

