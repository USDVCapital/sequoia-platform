/**
 * ReactivationWeek4.tsx
 * Subject: "Challenge Results Are In — See Who Made the Leaderboard"
 *
 * Week 4 of the reactivation campaign. Celebrates challenge results, highlights
 * top performers, and redirects non-participants toward next steps.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface TopPerformer {
  rank: number;
  name: string;
  location: string;
  enrollments: number;
  badge?: string;
}

interface ReactivationWeek4Props {
  firstName: string;
  totalEnrollments: number;
  topPerformers?: TopPerformer[];
  leaderboardUrl?: string;
  nextDealUrl?: string;
  scheduleCallUrl?: string;
  wednesdayTrainingUrl?: string;
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

const defaultTopPerformers: TopPerformer[] = [
  { rank: 1, name: "M. Carter", location: "Atlanta, GA", enrollments: 28, badge: "🥇" },
  { rank: 2, name: "D. Nguyen", location: "Houston, TX", enrollments: 23, badge: "🥈" },
  { rank: 3, name: "R. Patel", location: "Chicago, IL", enrollments: 21, badge: "🥉" },
  { rank: 4, name: "J. Williams", location: "Miami, FL", enrollments: 17 },
  { rank: 5, name: "A. Thompson", location: "Phoenix, AZ", enrollments: 15 },
];

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
  celebrationBanner: {
    background: `linear-gradient(135deg, ${colors.gold} 0%, #E8B84B 100%)`,
    borderRadius: "10px",
    padding: "28px 32px",
    textAlign: "center" as const,
    margin: "0 0 28px 0",
  } as React.CSSProperties,
  celebrationEmoji: {
    fontSize: "40px",
    margin: "0 0 8px 0",
  } as React.CSSProperties,
  celebrationTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: colors.greenDark,
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  } as React.CSSProperties,
  celebrationStat: {
    fontSize: "15px",
    color: colors.greenDark,
    opacity: 0.75,
    margin: "0",
    fontWeight: "600",
  } as React.CSSProperties,
  podium: {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "flex-end" as const,
    gap: "12px",
    margin: "28px 0",
    padding: "0 16px",
  } as React.CSSProperties,
  podiumItem: {
    flex: "1",
    textAlign: "center" as const,
    maxWidth: "150px",
  } as React.CSSProperties,
  podiumBadge: {
    fontSize: "28px",
    margin: "0 0 6px 0",
    display: "block",
  } as React.CSSProperties,
  podiumName: {
    fontSize: "13px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 2px 0",
  } as React.CSSProperties,
  podiumLocation: {
    fontSize: "11px",
    color: colors.mutedText,
    margin: "0 0 6px 0",
  } as React.CSSProperties,
  podiumBar: {
    borderRadius: "6px 6px 0 0",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    color: colors.white,
    fontWeight: "800",
    fontSize: "14px",
  } as React.CSSProperties,
  leaderboardFull: {
    backgroundColor: colors.greenDark,
    borderRadius: "10px",
    padding: "24px 28px",
    margin: "20px 0",
  } as React.CSSProperties,
  leaderboardTitle: {
    fontSize: "13px",
    color: "#A7C4B5",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    margin: "0 0 16px 0",
    fontWeight: "700",
  } as React.CSSProperties,
  leaderboardRow: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingBottom: "12px",
    marginBottom: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  } as React.CSSProperties,
  leaderboardRank: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.gold,
    width: "28px",
    flexShrink: 0,
  } as React.CSSProperties,
  leaderboardName: {
    fontSize: "14px",
    color: colors.white,
    flex: "1",
    marginLeft: "12px",
  } as React.CSSProperties,
  leaderboardStat: {
    fontSize: "13px",
    color: "#A7C4B5",
    fontWeight: "600",
  } as React.CSSProperties,
  stillTimeBox: {
    backgroundColor: "#ECFDF5",
    border: `1px solid #6EE7B7`,
    borderRadius: "8px",
    padding: "20px 24px",
    margin: "28px 0",
  } as React.CSSProperties,
  stillTimeTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 8px 0",
  } as React.CSSProperties,
  stillTimeText: {
    fontSize: "14px",
    color: colors.text,
    lineHeight: "1.6",
    margin: "0",
  } as React.CSSProperties,
  nextStepsGrid: {
    margin: "20px 0",
  } as React.CSSProperties,
  nextStepCard: {
    backgroundColor: colors.bg,
    border: `1px solid #D1E8DB`,
    borderRadius: "8px",
    padding: "18px 20px",
    marginBottom: "12px",
    display: "flex" as const,
    alignItems: "flex-start" as const,
    gap: "14px",
  } as React.CSSProperties,
  nextStepIcon: {
    fontSize: "22px",
    flexShrink: 0,
  } as React.CSSProperties,
  nextStepTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 4px 0",
  } as React.CSSProperties,
  nextStepDesc: {
    fontSize: "13px",
    color: colors.mutedText,
    lineHeight: "1.5",
    margin: "0",
  } as React.CSSProperties,
  nextStepLink: {
    color: colors.greenMid,
    textDecoration: "none",
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
    marginBottom: "12px",
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

export const ReactivationWeek4: React.FC<ReactivationWeek4Props> = ({
  firstName,
  totalEnrollments,
  topPerformers = defaultTopPerformers,
  leaderboardUrl = "https://portal.sequoiaes.com/leaderboard",
  nextDealUrl = "https://portal.sequoiaes.com/leads",
  scheduleCallUrl = "https://portal.sequoiaes.com/schedule-upline",
  wednesdayTrainingUrl = "https://portal.sequoiaes.com/events/wednesday-training",
}) => {
  const top3 = topPerformers.slice(0, 3);
  const rest = topPerformers.slice(3);

  return (
    <EmailLayout previewText={`The 30-Day Challenge results are in — ${totalEnrollments} total enrollments!`}>
      {/* Eyebrow + Headline */}
      <p style={styles.eyebrow}>Challenge Results</p>
      <h1 style={styles.headline}>
        The results are in{firstName ? `, ${firstName}` : ""}.
        <br />
        The community showed up.
      </h1>

      {/* Celebration banner */}
      <div style={styles.celebrationBanner}>
        <p style={styles.celebrationEmoji}>🎉</p>
        <p style={styles.celebrationTitle}>
          {totalEnrollments.toLocaleString()} Total Enrollments
        </p>
        <p style={styles.celebrationStat}>
          Completed during the 30-Day Wellness Challenge
        </p>
      </div>

      {/* Top 3 podium */}
      <h2 style={styles.sectionTitle}>Top Performers</h2>
      <table
        role="presentation"
        style={{
          width: "100%",
          borderCollapse: "collapse" as const,
          margin: "0 0 8px 0",
        }}
      >
        <tbody>
          <tr>
            {top3.map((p, i) => {
              const heights = ["80px", "100px", "60px"];
              const barColors = [colors.greenLight, colors.greenDark, colors.greenMid];
              const order = [1, 0, 2]; // Silver, Gold, Bronze order for visual podium
              const display = order[i];
              return (
                <td
                  key={p.rank}
                  style={{ verticalAlign: "bottom" as const, textAlign: "center" as const, padding: "0 6px" }}
                >
                  <p style={{ fontSize: "28px", margin: "0 0 4px 0" }}>
                    {p.badge ?? `#${p.rank}`}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: colors.greenDark,
                      margin: "0 0 2px 0",
                    }}
                  >
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: colors.mutedText,
                      margin: "0 0 6px 0",
                    }}
                  >
                    {p.location}
                  </p>
                  <div
                    style={{
                      height: heights[display],
                      backgroundColor: barColors[display],
                      borderRadius: "6px 6px 0 0",
                      display: "flex" as const,
                      alignItems: "center" as const,
                      justifyContent: "center" as const,
                      color: colors.white,
                      fontWeight: "800",
                      fontSize: "15px",
                    }}
                  >
                    {p.enrollments}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* Full leaderboard */}
      <div style={styles.leaderboardFull}>
        <p style={styles.leaderboardTitle}>Full Results</p>
        {topPerformers.map((p, i) => (
          <div
            key={p.rank}
            style={{
              ...styles.leaderboardRow,
              ...(i === topPerformers.length - 1
                ? { borderBottom: "none", paddingBottom: "0", marginBottom: "0" }
                : {}),
            }}
          >
            <span style={styles.leaderboardRank}>
              {p.badge ?? `#${p.rank}`}
            </span>
            <span style={styles.leaderboardName}>
              {p.name} — {p.location}
            </span>
            <span style={styles.leaderboardStat}>
              {p.enrollments} enrolled
            </span>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" as const, margin: "8px 0 28px 0" }}>
        <a
          href={leaderboardUrl}
          style={{ color: colors.greenMid, fontSize: "13px", fontWeight: "600" }}
        >
          View Full Leaderboard &rarr;
        </a>
      </div>

      <hr style={styles.divider} />

      {/* Still time box */}
      <div style={styles.stillTimeBox}>
        <p style={styles.stillTimeTitle}>Didn't participate? There's still time.</p>
        <p style={styles.stillTimeText}>
          The challenge window has closed, but the Wellness Program is open
          year-round — and so is the bonus for your very first enrollment. Every
          day you wait is a day of recurring income you're leaving on the table.
        </p>
      </div>

      <hr style={styles.divider} />

      {/* Next steps */}
      <h2 style={styles.sectionTitle}>Your Next Steps</h2>

      <div style={styles.nextStepsGrid}>
        {/* Next step 1 */}
        <table role="presentation" style={{ width: "100%", marginBottom: "12px" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "40px",
                  verticalAlign: "top" as const,
                  paddingRight: "14px",
                  paddingTop: "2px",
                }}
              >
                <span style={{ fontSize: "22px" }}>📞</span>
              </td>
              <td style={{ verticalAlign: "top" as const }}>
                <p style={styles.nextStepTitle}>Schedule a 1-on-1 with your upline</p>
                <p style={styles.nextStepDesc}>
                  Get personalized coaching on your pipeline and your next
                  move.{" "}
                  <a href={scheduleCallUrl} style={styles.nextStepLink}>
                    Book your slot &rarr;
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Next step 2 */}
        <table role="presentation" style={{ width: "100%", marginBottom: "0" }}>
          <tbody>
            <tr>
              <td
                style={{
                  width: "40px",
                  verticalAlign: "top" as const,
                  paddingRight: "14px",
                  paddingTop: "2px",
                }}
              >
                <span style={{ fontSize: "22px" }}>🎓</span>
              </td>
              <td style={{ verticalAlign: "top" as const }}>
                <p style={styles.nextStepTitle}>Join Wednesday's live training</p>
                <p style={styles.nextStepDesc}>
                  This week's topic is closing Wellness leads. Every Wednesday
                  at 8 PM ET.{" "}
                  <a href={wednesdayTrainingUrl} style={styles.nextStepLink}>
                    Add to calendar &rarr;
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CTAs */}
      <div style={{ textAlign: "center" as const, margin: "32px 0 0 0" }}>
        <div style={{ marginBottom: "12px" }}>
          <a href={leaderboardUrl} style={styles.primaryCta}>
            View Full Leaderboard
          </a>
        </div>
        <div>
          <a href={nextDealUrl} style={styles.secondaryCta}>
            Start Your Next Deal &rarr;
          </a>
        </div>
      </div>
    </EmailLayout>
  );
};

export default ReactivationWeek4;
