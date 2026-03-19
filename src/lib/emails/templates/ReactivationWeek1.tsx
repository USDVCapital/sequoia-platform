/**
 * ReactivationWeek1.tsx
 * Subject: "A New Era at Sequoia Enterprise Solutions — See What's Changed"
 *
 * Week 1 of the reactivation campaign. Reintroduces the platform to dormant
 * consultants and highlights everything that has been rebuilt.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface ReactivationWeek1Props {
  firstName: string;
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
    fontSize: "30px",
    fontWeight: "800",
    color: colors.greenDark,
    margin: "0 0 16px 0",
    lineHeight: "1.25",
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
    margin: "0 0 20px 0",
  } as React.CSSProperties,
  featureGrid: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    margin: "24px 0",
  } as React.CSSProperties,
  featureCard: {
    backgroundColor: colors.bg,
    border: `1px solid #D1E8DB`,
    borderRadius: "8px",
    padding: "20px",
  } as React.CSSProperties,
  featureIcon: {
    fontSize: "24px",
    margin: "0 0 10px 0",
  } as React.CSSProperties,
  featureTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 6px 0",
  } as React.CSSProperties,
  featureDesc: {
    fontSize: "13px",
    color: colors.mutedText,
    lineHeight: "1.5",
    margin: "0",
  } as React.CSSProperties,
  statRow: {
    display: "flex" as const,
    justifyContent: "space-around" as const,
    textAlign: "center" as const,
    backgroundColor: colors.greenDark,
    borderRadius: "8px",
    padding: "28px 20px",
    margin: "24px 0",
  } as React.CSSProperties,
  statItem: {
    flex: "1",
  } as React.CSSProperties,
  statNumber: {
    fontSize: "32px",
    fontWeight: "800",
    color: colors.gold,
    margin: "0 0 4px 0",
    lineHeight: "1",
  } as React.CSSProperties,
  statLabel: {
    fontSize: "12px",
    color: "#A7C4B5",
    letterSpacing: "0.5px",
    margin: "0",
  } as React.CSSProperties,
  statDivider: {
    width: "1px",
    backgroundColor: "rgba(255,255,255,0.15)",
    margin: "0 8px",
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
    letterSpacing: "0.3px",
  } as React.CSSProperties,
  activeNotice: {
    backgroundColor: "#ECFDF5",
    border: `1px solid #6EE7B7`,
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "28px 0",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "12px",
  } as React.CSSProperties,
  activeNoticeText: {
    fontSize: "14px",
    color: colors.greenDark,
    fontWeight: "600",
    margin: "0",
  } as React.CSSProperties,
};

export const ReactivationWeek1: React.FC<ReactivationWeek1Props> = ({
  firstName,
  portalUrl = "https://portal.sequoiaes.com",
}) => {
  return (
    <EmailLayout previewText="The platform, the portal, the tools — everything has been rebuilt for you.">
      {/* Eyebrow + Headline */}
      <p style={styles.eyebrow}>The New Sequoia</p>
      <h1 style={styles.headline}>
        {firstName ? `${firstName}, w` : "W"}e've rebuilt
        <br />
        everything for you.
      </h1>
      <p style={styles.bodyText}>
        A lot has changed at Sequoia. We listened to consultants, invested
        heavily in our technology, and came back with a platform that gives you
        every advantage. This isn't an update — it's a new era.
      </p>
      <p style={styles.bodyText}>
        Here's what's waiting for you when you log in today:
      </p>

      <hr style={styles.divider} />

      {/* Feature Highlights */}
      <h2 style={styles.sectionTitle}>What's New on the Platform</h2>

      {/* Feature cards - using table for email client compatibility */}
      <table
        role="presentation"
        style={{ width: "100%", borderCollapse: "collapse" as const }}
      >
        <tbody>
          <tr>
            <td style={{ width: "50%", paddingRight: "8px", verticalAlign: "top" as const }}>
              <div style={styles.featureCard}>
                <p style={styles.featureIcon}>🤖</p>
                <p style={styles.featureTitle}>CEA AI Assistant</p>
                <p style={styles.featureDesc}>
                  Your personal AI built for insurance and financial services.
                  Get instant answers, proposal drafts, and objection handling
                  — 24/7.
                </p>
              </div>
            </td>
            <td style={{ width: "50%", paddingLeft: "8px", verticalAlign: "top" as const }}>
              <div style={styles.featureCard}>
                <p style={styles.featureIcon}>🎬</p>
                <p style={styles.featureTitle}>Training Library</p>
                <p style={styles.featureDesc}>
                  190+ on-demand training videos. Sales skills, product deep
                  dives, leadership development — all searchable and
                  categorized.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: "50%",
                paddingRight: "8px",
                paddingTop: "16px",
                verticalAlign: "top" as const,
              }}
            >
              <div style={styles.featureCard}>
                <p style={styles.featureIcon}>💬</p>
                <p style={styles.featureTitle}>Community Feed</p>
                <p style={styles.featureDesc}>
                  Connect with 2,500+ consultants. Share wins, ask questions,
                  and stay motivated with the most active field community in the
                  company.
                </p>
              </div>
            </td>
            <td
              style={{
                width: "50%",
                paddingLeft: "8px",
                paddingTop: "16px",
                verticalAlign: "top" as const,
              }}
            >
              <div style={styles.featureCard}>
                <p style={styles.featureIcon}>🏆</p>
                <p style={styles.featureTitle}>Leaderboard</p>
                <p style={styles.featureDesc}>
                  Real-time rankings by deals funded, wellness enrollments, and
                  team growth. Compete, celebrate, and climb.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <hr style={styles.divider} />

      {/* Stats */}
      <h2 style={styles.sectionTitle}>The Numbers Don't Lie</h2>
      <div style={styles.statRow}>
        <div style={styles.statItem}>
          <p style={styles.statNumber}>$70M</p>
          <p style={styles.statLabel}>Funded in 2025</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <p style={styles.statNumber}>$100M</p>
          <p style={styles.statLabel}>Target for 2026</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <p style={styles.statNumber}>2,500+</p>
          <p style={styles.statLabel}>Active Consultants</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <p style={styles.statNumber}>190+</p>
          <p style={styles.statLabel}>Training Videos</p>
        </div>
      </div>

      {/* Active account notice */}
      <div style={styles.activeNotice}>
        <span style={{ fontSize: "20px" }}>✅</span>
        <p style={styles.activeNoticeText}>
          Your account is still active — log in now and pick up right where
          you left off.
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" as const, margin: "32px 0" }}>
        <a href={portalUrl} style={styles.ctaButton}>
          Explore Your New Portal &rarr;
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
        Next week: The fastest path to your first commission — no license
        required.
      </p>
    </EmailLayout>
  );
};

export default ReactivationWeek1;
