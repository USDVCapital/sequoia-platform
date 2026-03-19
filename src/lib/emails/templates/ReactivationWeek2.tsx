/**
 * ReactivationWeek2.tsx
 * Subject: "The Fastest Path to Your First Commission (No License Required)"
 *
 * Week 2 of the reactivation campaign. Focused entirely on the Wellness
 * Program as the easiest entry point for consultants.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface ReactivationWeek2Props {
  firstName: string;
  wellnessVideoUrl?: string;
  qaUrl?: string;
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
  eyebrow: {
    fontSize: "11px",
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    margin: "0 0 12px 0",
  } as React.CSSProperties,
  headline: {
    fontSize: "28px",
    fontWeight: "800",
    color: colors.greenDark,
    margin: "0 0 16px 0",
    lineHeight: "1.3",
  } as React.CSSProperties,
  bodyText: {
    fontSize: "15px",
    color: colors.text,
    lineHeight: "1.7",
    margin: "0 0 16px 0",
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
    margin: "0 0 16px 0",
  } as React.CSSProperties,
  benefitRow: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    marginBottom: "20px",
    gap: "16px",
  } as React.CSSProperties,
  benefitIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    fontSize: "20px",
    flexShrink: 0,
  } as React.CSSProperties,
  benefitTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 4px 0",
  } as React.CSSProperties,
  benefitDesc: {
    fontSize: "14px",
    color: colors.mutedText,
    lineHeight: "1.6",
    margin: "0",
  } as React.CSSProperties,
  mathBox: {
    backgroundColor: colors.greenDark,
    borderRadius: "10px",
    padding: "28px 32px",
    margin: "28px 0",
    textAlign: "center" as const,
  } as React.CSSProperties,
  mathLabel: {
    fontSize: "12px",
    color: "#A7C4B5",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    margin: "0 0 16px 0",
  } as React.CSSProperties,
  mathEquation: {
    fontSize: "15px",
    color: "#D1E8DB",
    margin: "0 0 8px 0",
    lineHeight: "1.8",
  } as React.CSSProperties,
  mathResult: {
    fontSize: "36px",
    fontWeight: "800",
    color: colors.gold,
    margin: "12px 0 4px 0",
    lineHeight: "1",
  } as React.CSSProperties,
  mathSubtext: {
    fontSize: "13px",
    color: "#A7C4B5",
    margin: "4px 0 0 0",
  } as React.CSSProperties,
  pullQuote: {
    borderLeft: `4px solid ${colors.gold}`,
    paddingLeft: "20px",
    margin: "28px 0",
  } as React.CSSProperties,
  pullQuoteText: {
    fontSize: "17px",
    fontStyle: "italic",
    color: colors.greenDark,
    lineHeight: "1.6",
    margin: "0",
    fontWeight: "600",
  } as React.CSSProperties,
  primaryCta: {
    display: "inline-block",
    backgroundColor: colors.greenMid,
    color: colors.white,
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
    padding: "14px 32px",
    borderRadius: "6px",
    letterSpacing: "0.3px",
  } as React.CSSProperties,
  secondaryCta: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: colors.greenMid,
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    padding: "12px 28px",
    borderRadius: "6px",
    border: `2px solid ${colors.greenMid}`,
    letterSpacing: "0.3px",
  } as React.CSSProperties,
};

export const ReactivationWeek2: React.FC<ReactivationWeek2Props> = ({
  firstName,
  wellnessVideoUrl = "https://portal.sequoiaes.com/training/wellness-overview",
  qaUrl = "https://portal.sequoiaes.com/events/wednesday-qa",
  portalUrl = "https://portal.sequoiaes.com",
}) => {
  return (
    <EmailLayout previewText="No license required. Just one conversation can earn you $3,600/month.">
      {/* Eyebrow + Headline */}
      <p style={styles.eyebrow}>Wellness Program</p>
      <h1 style={styles.headline}>
        {firstName ? `${firstName}, t` : "T"}he fastest path to your
        first commission.
      </h1>
      <p style={styles.bodyText}>
        Of all the products and programs at Sequoia, the Wellness Program is
        the one consultants close first — and the one that creates the most
        reliable recurring income. Here's why:
      </p>

      <hr style={styles.divider} />

      {/* Three-way benefit breakdown */}
      <h2 style={styles.sectionTitle}>Everyone wins. That's why it's easy.</h2>

      {/* Employers */}
      <table role="presentation" style={{ width: "100%", marginBottom: "20px" }}>
        <tbody>
          <tr>
            <td
              style={{
                width: "48px",
                verticalAlign: "top" as const,
                paddingRight: "16px",
              }}
            >
              <div
                style={{
                  ...styles.benefitIcon,
                  backgroundColor: "#ECFDF5",
                }}
              >
                🏢
              </div>
            </td>
            <td style={{ verticalAlign: "top" as const }}>
              <p style={styles.benefitTitle}>Employers save real money</p>
              <p style={styles.benefitDesc}>
                By enrolling employees in the Wellness Program, companies
                legally reduce their FICA tax burden — often thousands of
                dollars per month. You're solving a CFO problem, not selling a
                product.
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Employees */}
      <table role="presentation" style={{ width: "100%", marginBottom: "20px" }}>
        <tbody>
          <tr>
            <td
              style={{
                width: "48px",
                verticalAlign: "top" as const,
                paddingRight: "16px",
              }}
            >
              <div
                style={{
                  ...styles.benefitIcon,
                  backgroundColor: "#FFF7ED",
                }}
              >
                👥
              </div>
            </td>
            <td style={{ verticalAlign: "top" as const }}>
              <p style={styles.benefitTitle}>Employees get better benefits</p>
              <p style={styles.benefitDesc}>
                Workers receive access to wellness benefits at no extra cost to
                them — often including telehealth, dental, and vision
                supplementals. They get more; it costs them nothing.
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Consultants */}
      <table role="presentation" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td
              style={{
                width: "48px",
                verticalAlign: "top" as const,
                paddingRight: "16px",
              }}
            >
              <div
                style={{
                  ...styles.benefitIcon,
                  backgroundColor: "#FFFBEB",
                }}
              >
                💰
              </div>
            </td>
            <td style={{ verticalAlign: "top" as const }}>
              <p style={styles.benefitTitle}>You earn $12–$18 per employee per month</p>
              <p style={styles.benefitDesc}>
                For every employee enrolled in the Wellness Program, you earn a
                monthly recurring commission — for as long as the company stays
                enrolled. This is not a one-time sale. It compounds.
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <hr style={styles.divider} />

      {/* Math example */}
      <div style={styles.mathBox}>
        <p style={styles.mathLabel}>The Math Is Simple</p>
        <p style={styles.mathEquation}>
          1 company &nbsp;×&nbsp; 200 employees &nbsp;×&nbsp; $18/employee
        </p>
        <p style={styles.mathResult}>$3,600 / month</p>
        <p style={styles.mathSubtext}>
          Recurring. Every month. Without re-selling anything.
        </p>
      </div>

      {/* Pull quote */}
      <div style={styles.pullQuote}>
        <p style={styles.pullQuoteText}>
          "This is the easiest conversation you'll ever have with a business
          owner — because you're saving them money before they spend a single
          dollar."
        </p>
      </div>

      <p style={styles.bodyText}>
        You don't need an insurance license to start. You don't need years of
        experience. You need a 5-minute overview and the confidence to have a
        conversation. We'll give you both.
      </p>

      <hr style={styles.divider} />

      {/* Primary CTA */}
      <div style={{ textAlign: "center" as const, margin: "0 0 16px 0" }}>
        <a href={wellnessVideoUrl} style={styles.primaryCta}>
          Watch the 5-Minute Wellness Overview
        </a>
      </div>

      {/* Secondary CTA */}
      <div style={{ textAlign: "center" as const, margin: "0 0 32px 0" }}>
        <a href={qaUrl} style={styles.secondaryCta}>
          Join Wednesday's Live Q&amp;A
        </a>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: colors.mutedText,
          textAlign: "center" as const,
          margin: "0",
        }}
      >
        Next week: The 30-Day Wellness Challenge — with bonus commissions.
      </p>
    </EmailLayout>
  );
};

export default ReactivationWeek2;
