/**
 * WelcomeEmail.tsx
 * Subject: "Welcome to Sequoia Enterprise Solutions — Let's Get You Started"
 *
 * Sent to new consultants upon account creation.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface WelcomeEmailProps {
  firstName: string;
  consultantId: string;
  portalUrl?: string;
}

const colors = {
  greenDark: "#1B4332",
  greenMid: "#2D6A4F",
  greenLight: "#40916C",
  gold: "#D4A843",
  bg: "#F8FAF9",
  text: "#1A1A2E",
  mutedText: "#6B7280",
  white: "#ffffff",
};

const styles = {
  greeting: {
    fontSize: "28px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 8px 0",
    lineHeight: "1.3",
  } as React.CSSProperties,
  subGreeting: {
    fontSize: "16px",
    color: colors.mutedText,
    margin: "0 0 32px 0",
    lineHeight: "1.6",
  } as React.CSSProperties,
  divider: {
    height: "1px",
    backgroundColor: "#E5E7EB",
    margin: "28px 0",
    border: "none",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 20px 0",
  } as React.CSSProperties,
  checklistItem: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    marginBottom: "16px",
  } as React.CSSProperties,
  checklistNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: colors.greenLight,
    color: colors.white,
    fontSize: "13px",
    fontWeight: "700",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexShrink: 0,
    marginRight: "14px",
    marginTop: "1px",
    lineHeight: "1",
  } as React.CSSProperties,
  checklistText: {
    fontSize: "15px",
    color: colors.text,
    lineHeight: "1.6",
  } as React.CSSProperties,
  checklistSubText: {
    fontSize: "13px",
    color: colors.mutedText,
    marginTop: "2px",
  } as React.CSSProperties,
  ctaButton: {
    display: "inline-block",
    backgroundColor: colors.greenMid,
    color: colors.white,
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
    padding: "14px 32px",
    borderRadius: "6px",
    margin: "24px 0",
    letterSpacing: "0.3px",
  } as React.CSSProperties,
  infoBox: {
    backgroundColor: colors.bg,
    border: `1px solid #D1E8DB`,
    borderRadius: "8px",
    padding: "20px 24px",
    margin: "24px 0",
  } as React.CSSProperties,
  infoBoxLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: colors.greenLight,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    margin: "0 0 6px 0",
  } as React.CSSProperties,
  infoBoxValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0",
    letterSpacing: "1px",
  } as React.CSSProperties,
  quoteBox: {
    borderLeft: `4px solid ${colors.gold}`,
    paddingLeft: "20px",
    margin: "28px 0",
  } as React.CSSProperties,
  quoteText: {
    fontSize: "16px",
    color: colors.text,
    fontStyle: "italic",
    lineHeight: "1.7",
    margin: "0 0 10px 0",
  } as React.CSSProperties,
  quoteAttrib: {
    fontSize: "13px",
    fontWeight: "700",
    color: colors.greenMid,
    margin: "0",
  } as React.CSSProperties,
  bodyText: {
    fontSize: "15px",
    color: colors.text,
    lineHeight: "1.7",
    margin: "0 0 16px 0",
  } as React.CSSProperties,
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  firstName,
  consultantId,
  portalUrl = "https://portal.sequoiaes.com",
}) => {
  return (
    <EmailLayout previewText={`Welcome to Sequoia, ${firstName}! Here's how to get started.`}>
      {/* Greeting */}
      <h1 style={styles.greeting}>Welcome to Sequoia, {firstName}!</h1>
      <p style={styles.subGreeting}>
        You've made a great decision. Thousands of consultants across the
        country are building real, recurring income with Sequoia — and you're
        about to join them.
      </p>

      {/* Consultant ID */}
      <div style={styles.infoBox}>
        <p style={styles.infoBoxLabel}>Your Consultant ID</p>
        <p style={styles.infoBoxValue}>{consultantId}</p>
        <p
          style={{
            fontSize: "12px",
            color: colors.mutedText,
            margin: "6px 0 0 0",
          }}
        >
          Keep this handy — you'll need it to log in and submit leads.
        </p>
      </div>

      <hr style={styles.divider} />

      {/* Quick Start Checklist */}
      <h2 style={styles.sectionTitle}>Your Quick-Start Checklist</h2>
      <p style={{ ...styles.bodyText, marginBottom: "24px" }}>
        Most successful consultants complete these four steps within their first
        48 hours. Here's exactly what to do:
      </p>

      {/* Step 1 */}
      <div style={styles.checklistItem}>
        <div style={styles.checklistNumber}>1</div>
        <div>
          <div style={styles.checklistText}>
            <strong>Log in to your consultant portal</strong>
          </div>
          <div style={styles.checklistSubText}>
            Your dashboard, leads, commissions, and tools — all in one place.
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div style={styles.checklistItem}>
        <div style={styles.checklistNumber}>2</div>
        <div>
          <div style={styles.checklistText}>
            <strong>Watch the Wellness Program overview (5 minutes)</strong>
          </div>
          <div style={styles.checklistSubText}>
            This is the fastest path to your first commission — no license
            required.
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div style={styles.checklistItem}>
        <div style={styles.checklistNumber}>3</div>
        <div>
          <div style={styles.checklistText}>
            <strong>Complete your profile</strong>
          </div>
          <div style={styles.checklistSubText}>
            Add your photo, bio, and contact info so clients can find and trust
            you.
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div style={styles.checklistItem}>
        <div style={styles.checklistNumber}>4</div>
        <div>
          <div style={styles.checklistText}>
            <strong>Submit your first lead</strong>
          </div>
          <div style={styles.checklistSubText}>
            Even one conversation with a business owner can turn into
            $2,000+/month recurring.
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: "center" as const, margin: "32px 0" }}>
        <a href={portalUrl} style={styles.ctaButton}>
          Log In to Your Portal &rarr;
        </a>
      </div>

      <hr style={styles.divider} />

      {/* Allen Wu welcome quote */}
      <div style={styles.quoteBox}>
        <p style={styles.quoteText}>
          "I built Sequoia because I believe every motivated person deserves a
          real path to financial freedom — not a lottery ticket, not a get-rich
          scheme. Our consultants earn because they provide genuine value to
          businesses and families. Welcome to the team. I'm excited to see what
          you build."
        </p>
        <p style={styles.quoteAttrib}>— Allen Wu, Founder &amp; CEO, Sequoia Enterprise Solutions</p>
      </div>

      <hr style={styles.divider} />

      <p style={styles.bodyText}>
        Questions? Reply to this email or reach us anytime at{" "}
        <a
          href="mailto:support@sequoiaes.com"
          style={{ color: colors.greenMid }}
        >
          support@sequoiaes.com
        </a>
        . We're here to help you succeed.
      </p>

      <p style={{ ...styles.bodyText, marginBottom: "0" }}>
        Welcome aboard,
        <br />
        <strong>The Sequoia Team</strong>
      </p>
    </EmailLayout>
  );
};

export default WelcomeEmail;
