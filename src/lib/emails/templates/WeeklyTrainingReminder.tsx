/**
 * WeeklyTrainingReminder.tsx
 * Subject: "Tonight: Live Training at 8 PM ET — {topicTitle}"
 *
 * Sent each Wednesday before the live weekly training session.
 * Short, punchy, and action-oriented.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface WeeklyTrainingReminderProps {
  topicTitle: string;
  hostName: string;
  hostTitle?: string;
  zoomUrl?: string;
  replayNote?: boolean;
  trainingLibraryUrl?: string;
  calendarDate?: string; // e.g. "Wednesday, March 19, 2026"
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
  liveChip: {
    display: "inline-block",
    backgroundColor: "#DC2626",
    color: colors.white,
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    padding: "4px 10px",
    borderRadius: "4px",
    textTransform: "uppercase" as const,
    margin: "0 0 16px 0",
  } as React.CSSProperties,
  headline: {
    fontSize: "28px",
    fontWeight: "800",
    color: colors.greenDark,
    margin: "0 0 8px 0",
    lineHeight: "1.3",
  } as React.CSSProperties,
  topicTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: colors.greenMid,
    margin: "0 0 24px 0",
    lineHeight: "1.4",
    fontStyle: "italic",
  } as React.CSSProperties,
  divider: {
    height: "1px",
    backgroundColor: "#E5E7EB",
    margin: "24px 0",
    border: "none",
  } as React.CSSProperties,
  detailsBox: {
    backgroundColor: colors.bg,
    border: `1px solid #D1E8DB`,
    borderRadius: "8px",
    padding: "24px 28px",
    margin: "0 0 24px 0",
  } as React.CSSProperties,
  detailRow: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    marginBottom: "14px",
    gap: "14px",
  } as React.CSSProperties,
  detailIcon: {
    fontSize: "20px",
    flexShrink: 0,
    width: "28px",
    textAlign: "center" as const,
    marginTop: "1px",
  } as React.CSSProperties,
  detailLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: colors.greenLight,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    margin: "0 0 3px 0",
  } as React.CSSProperties,
  detailValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: colors.text,
    margin: "0",
    lineHeight: "1.4",
  } as React.CSSProperties,
  detailSubValue: {
    fontSize: "13px",
    color: colors.mutedText,
    margin: "2px 0 0 0",
  } as React.CSSProperties,
  ctaButton: {
    display: "inline-block",
    backgroundColor: colors.greenMid,
    color: colors.white,
    fontSize: "18px",
    fontWeight: "800",
    textDecoration: "none",
    padding: "16px 40px",
    borderRadius: "6px",
    letterSpacing: "0.3px",
    width: "100%",
    boxSizing: "border-box" as const,
    textAlign: "center" as const,
  } as React.CSSProperties,
  replayNote: {
    backgroundColor: "#FFFBEB",
    border: `1px solid ${colors.gold}`,
    borderRadius: "8px",
    padding: "14px 18px",
    margin: "20px 0 0 0",
    display: "flex" as const,
    alignItems: "flex-start" as const,
    gap: "10px",
  } as React.CSSProperties,
  replayNoteText: {
    fontSize: "13px",
    color: "#92400E",
    lineHeight: "1.6",
    margin: "0",
  } as React.CSSProperties,
  hostBox: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "14px",
    margin: "0 0 24px 0",
  } as React.CSSProperties,
  hostAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: colors.greenLight,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: colors.white,
    fontSize: "20px",
    fontWeight: "700",
    flexShrink: 0,
  } as React.CSSProperties,
  hostName: {
    fontSize: "15px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 2px 0",
  } as React.CSSProperties,
  hostTitle: {
    fontSize: "13px",
    color: colors.mutedText,
    margin: "0",
  } as React.CSSProperties,
};

export const WeeklyTrainingReminder: React.FC<WeeklyTrainingReminderProps> = ({
  topicTitle,
  hostName,
  hostTitle = "Senior Trainer, Sequoia Enterprise Solutions",
  zoomUrl = "https://zoom.us/j/sequoia-training",
  replayNote = true,
  trainingLibraryUrl = "https://portal.sequoiaes.com/training",
  calendarDate = "Wednesday, 8:00 PM ET",
}) => {
  const hostInitial = hostName.charAt(0).toUpperCase();

  return (
    <EmailLayout previewText={`Tonight at 8 PM ET: ${topicTitle} — hosted by ${hostName}`}>
      {/* Live badge */}
      <span style={styles.liveChip}>● Live Tonight</span>

      {/* Headline + Topic */}
      <h1 style={styles.headline}>Wednesday Night Training</h1>
      <p style={styles.topicTitle}>"{topicTitle}"</p>

      {/* Host */}
      <table role="presentation" style={{ width: "100%", marginBottom: "24px" }}>
        <tbody>
          <tr>
            <td style={{ width: "62px", verticalAlign: "middle" as const }}>
              <div style={styles.hostAvatar}>{hostInitial}</div>
            </td>
            <td style={{ verticalAlign: "middle" as const }}>
              <p style={styles.hostName}>{hostName}</p>
              <p style={styles.hostTitle}>{hostTitle}</p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Event details */}
      <div style={styles.detailsBox}>
        {/* Time */}
        <table role="presentation" style={{ width: "100%", marginBottom: "14px" }}>
          <tbody>
            <tr>
              <td style={{ width: "36px", verticalAlign: "top" as const }}>
                <span style={styles.detailIcon}>🕗</span>
              </td>
              <td style={{ verticalAlign: "top" as const }}>
                <p style={styles.detailLabel}>When</p>
                <p style={styles.detailValue}>{calendarDate}</p>
                <p style={styles.detailSubValue}>Every Wednesday — join from anywhere</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Topic */}
        <table role="presentation" style={{ width: "100%", marginBottom: "14px" }}>
          <tbody>
            <tr>
              <td style={{ width: "36px", verticalAlign: "top" as const }}>
                <span style={styles.detailIcon}>📋</span>
              </td>
              <td style={{ verticalAlign: "top" as const }}>
                <p style={styles.detailLabel}>Topic</p>
                <p style={styles.detailValue}>{topicTitle}</p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Zoom */}
        <table role="presentation" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ width: "36px", verticalAlign: "top" as const }}>
                <span style={styles.detailIcon}>💻</span>
              </td>
              <td style={{ verticalAlign: "top" as const }}>
                <p style={styles.detailLabel}>Platform</p>
                <p style={styles.detailValue}>
                  <a
                    href={zoomUrl}
                    style={{ color: colors.greenMid, textDecoration: "none", fontWeight: "700" }}
                  >
                    Join via Zoom &rarr;
                  </a>
                </p>
                <p style={styles.detailSubValue}>
                  Link is active 15 minutes before the session
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Primary CTA */}
      <a href={zoomUrl} style={styles.ctaButton}>
        I'll Be There — Join Training
      </a>

      {/* Replay note */}
      {replayNote && (
        <div style={styles.replayNote}>
          <span style={{ fontSize: "16px", flexShrink: 0 }}>📼</span>
          <p style={styles.replayNoteText}>
            <strong>Can't make it live?</strong> The replay will be available in
            your{" "}
            <a
              href={trainingLibraryUrl}
              style={{ color: "#92400E", fontWeight: "700" }}
            >
              Training Library
            </a>{" "}
            within 24 hours. Over 190 past sessions are already waiting for you.
          </p>
        </div>
      )}
    </EmailLayout>
  );
};

export default WeeklyTrainingReminder;
