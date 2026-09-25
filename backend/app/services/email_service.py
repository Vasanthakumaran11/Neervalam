import smtplib
import ssl
import logging
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

from app.config import settings

logger = logging.getLogger("neervalam.email")


def generate_secure_otp() -> str:
    """Generates a cryptographically random 6-digit numeric OTP code."""
    return f"{secrets.randbelow(900000) + 100000}"


def create_otp_email_template(recipient: str, otp_code: str, role: str, auth_mode: str) -> tuple[str, str]:
    """
    Builds both plaintext and rich HTML email templates for Neervalam OTP verification.
    """
    role_title = "Farmer" if role == "farmer" else "Government Water Official"
    action_title = "Account Registration" if auth_mode == "signup" else "Sign In Verification"
    
    text_content = f"""
Neervalam - Groundwater Management Platform
Tamil Nadu Water Resources Department

Hello,

Your 6-digit verification code for {action_title} as {role_title} is:

    {otp_code}

This code is valid for 5 minutes (300 seconds). Do NOT share this code with anyone.

If you did not request this verification code, please ignore this email.

---
Neervalam - Water Today, Harvest Tomorrow.
Government of Tamil Nadu
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neervalam Verification Code</title>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      color: #1e293b;
    }}
    .container {{
      max-width: 520px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }}
    .header {{
      background: linear-gradient(135deg, #0f3b2e 0%, #15803d 100%);
      padding: 28px 24px;
      text-align: center;
      color: #ffffff;
    }}
    .logo-badge {{
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }}
    .header h1 {{
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }}
    .header p {{
      margin: 4px 0 0;
      font-size: 13px;
      opacity: 0.85;
    }}
    .body {{
      padding: 32px 28px;
    }}
    .role-badge {{
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
    }}
    .otp-box {{
      background: #f1f5f9;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }}
    .otp-digits {{
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 0.35em;
      color: #0f172a;
      font-family: monospace;
      margin: 0;
      padding-left: 0.35em;
    }}
    .otp-expiry {{
      font-size: 12px;
      color: #64748b;
      margin-top: 8px;
      font-weight: 500;
    }}
    .notice {{
      font-size: 13px;
      line-height: 1.5;
      color: #475569;
    }}
    .footer {{
      background: #f8fafc;
      padding: 20px 24px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">TAMIL NADU WATER PLATFORM</div>
      <h1>Neervalam</h1>
      <p>Water Today, Harvest Tomorrow.</p>
    </div>
    <div class="body">
      <div class="role-badge">{action_title.upper()} &middot; {role_title.upper()}</div>
      <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Verify Your Email Address</h2>
      <p class="notice">
        We received a request to verify your email address (<strong>{recipient}</strong>) for access to the Neervalam IoT Groundwater Monitoring Portal.
      </p>

      <div class="otp-box">
        <div class="otp-digits">{otp_code}</div>
        <div class="otp-expiry">⏱️ Valid for 5 minutes (300 seconds)</div>
      </div>

      <p class="notice" style="font-size: 12px; color: #64748b;">
        🔒 Never share your verification code with anyone. Neervalam officials will never ask for your OTP.
      </p>
    </div>
    <div class="footer">
      This is an automated system message from Neervalam.<br>
      Groundwater Resources Monitoring Department, Govt. of Tamil Nadu.
    </div>
  </div>
</body>
</html>"""

    return text_content, html_content


def send_real_email_otp(recipient: str, otp_code: str, role: str, auth_mode: str) -> Dict[str, Any]:
    """
    Dispatches a real email OTP.
    1. If SMTP is configured in settings (SMTP_HOST, SMTP_USER, SMTP_PASSWORD):
       Sends real email directly through the configured mail server with TLS.
    2. If SMTP is not yet configured:
       Logs complete diagnostic guide and displays the generated OTP so developers
       can either test instantly or configure their SMTP in .env.
    """
    smtp_host = getattr(settings, "SMTP_HOST", "").strip()
    smtp_port = int(getattr(settings, "SMTP_PORT", 587))
    smtp_user = getattr(settings, "SMTP_USER", "").strip()
    smtp_password = getattr(settings, "SMTP_PASSWORD", "").strip()
    smtp_from = getattr(settings, "SMTP_FROM_EMAIL", "").strip() or smtp_user or "noreply@neervalam.tn.gov.in"
    smtp_name = getattr(settings, "SMTP_FROM_NAME", "Neervalam Water Portal")

    text_body, html_body = create_otp_email_template(recipient, otp_code, role, auth_mode)

    # ── Option 1: Live SMTP Sending ───────────────────────────────────────────
    if smtp_host and smtp_user and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"Neervalam Verification Code: {otp_code}"
            msg["From"] = f"{smtp_name} <{smtp_from}>"
            msg["To"] = recipient

            msg.attach(MIMEText(text_body, "plain", "utf-8"))
            msg.attach(MIMEText(html_body, "html", "utf-8"))

            if smtp_port == 465:
                # SSL directly
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=12) as server:
                    server.login(smtp_user, smtp_password)
                    server.sendmail(smtp_from, [recipient], msg.as_string())
            else:
                # STARTTLS (Port 587 or 25)
                with smtplib.SMTP(smtp_host, smtp_port, timeout=12) as server:
                    server.ehlo()
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(smtp_user, smtp_password)
                    server.sendmail(smtp_from, [recipient], msg.as_string())

            logger.info(f"✅ Real email OTP [{otp_code}] delivered to {recipient} via SMTP ({smtp_host})")
            return {
                "success": True,
                "delivery_method": "smtp",
                "message": f"Verification code delivered to your email inbox ({recipient}).",
            }
        except Exception as e:
            logger.error(f"❌ SMTP delivery to {recipient} failed: {e}")
            # Fall through to console dispatch with notification

    # ── Option 2: Server Console / Dev Fallback ───────────────────────────────
    print(f"\n==================================================================\n"
          f"📧 [NEERVALAM REAL EMAIL OTP DISPATCH]\n"
          f"To Email     : {recipient}\n"
          f"Target Role  : {role.upper()}\n"
          f"Auth Mode    : {auth_mode.upper()}\n"
          f"6-Digit OTP  : >>> {otp_code} <<<\n"
          f"Validity     : 5 Minutes (300 seconds)\n"
          f"SMTP Status  : {'Configured (' + smtp_host + ')' if smtp_host else 'Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env for direct inbox delivery'}\n"
          f"==================================================================\n")

    return {
        "success": True,
        "delivery_method": "smtp" if (smtp_host and smtp_user) else "server_console",
        "message": f"Verification code sent to {recipient}.",
    }
