export const PRIVACY_POLICY = `# Privacy Policy

**Last updated:** November 2026

Welcome to **YobuneArt**. Protecting your personal data is important to us. This Privacy Policy explains what information we collect, how we use it, and what rights you have under the General Data Protection Regulation (GDPR).

---

## 1. Data Controller

**YobuneArt**
Contact Email: [yobuneart@gmail.com](mailto:yobuneart@gmail.com)

---

## 2. Data We Collect & Why

### A. Account & Authentication Data
When you register or sign in on our website, we process the following data to provide and manage your user account (Art. 6(1)(b) GDPR):
- **Email & Password Registration:** Your email address, encrypted password (managed via Supabase Auth), and chosen username.
- **Google Sign-In (OAuth):** If you sign in with Google, we receive your verified email address and public profile name from Google to create and authenticate your account.

### B. Commission & Order History
When you request or purchase a digital art commission (Art. 6(1)(b) & Art. 6(1)(c) GDPR):
- We process your order details, commission references, and billing information to fulfill your commission and comply with statutory tax and accounting obligations.

### C. Security & Rate Limiting
To protect our authentication endpoints against brute-force attacks and abuse (Art. 6(1)(f) GDPR — legitimate interest):
- Your **IP address** is temporarily stored in server memory for up to **15 minutes** when making authentication requests and is automatically cleared afterward.

---

## 3. Cookies & Local Preferences

We only use **strictly necessary** and **functional preference** cookies. We do **not** use any tracking, analytics, or advertising cookies.

- **Authentication (\`sb-*-auth-token\`):** Stores your login session so you stay signed in across pages (expires after 24 hours).
- **Color Mode (\`blaenk-color-mode\`):** Remembers your preferred theme (light, dark, or system).
- **Cursor Preference (\`blaenk-fancy-cursor\`):** Remembers whether the custom cursor is enabled or disabled.
- **Tour Guide Dialog (\`blaenk-dialog-active\`):** Remembers whether you have dismissed the interactive tour guide on the home page.

---

## 4. Account Deletion & Data Retention

You can permanently delete your account at any time in your [Profile Settings](/profile#delete-account):
- Deleting your account immediately removes your login credentials and profile from our active system.
- If you have completed commercial orders/commissions, statutory invoice and accounting records are retained in anonymized/archived form only for the period required by tax law (e.g., 6–10 years) and are deleted afterward.

---

## 5. Your Rights Under GDPR

You have the right to:
1. **Access** the personal data we hold about you (Art. 15 GDPR).
2. **Rectify** inaccurate data, such as updating your username or email in your profile (Art. 16 GDPR).
3. **Erase** your personal data ("Right to be forgotten", Art. 17 GDPR).
4. **Restrict** or **object** to processing (Art. 18 & 21 GDPR).
5. **Data portability** (Art. 20 GDPR).

To exercise any of these rights or if you have questions about your data, please contact us at [yobuneart@gmail.com](mailto:yobuneart@gmail.com).
`
