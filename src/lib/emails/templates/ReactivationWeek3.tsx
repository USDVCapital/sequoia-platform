/**
 * ReactivationWeek3.tsx
 * Subject: "The 30-Day Wellness Challenge Starts Now — Bonus Commission Inside"
 *
 * Week 3 of the reactivation campaign. Announces the 30-Day Wellness
 * Challenge with urgency, a success story, and a leaderboard preview.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface ReactivationWeek3Props {
  firstName: string;
  challengeEndDate: string; // e.g. "April 18, 2026"
  leaderboardUrl?: string;
  challengeAcceptUrl?: string;
  totalConsultants?: number;
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
  challengeBanner: {
    background: `linear-gradient(135deg, ${colors.greenDark} 0%, ${colors.greenMid} 100%)`,
    borderRadius: "10px",
    padding: "32px",
    textAlign: "center" as const,
    margin: "20px 0 28px 0",
    position: "relative" as const,
  } as React.CSSProperties,
  challengeTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: "2.5px",
    textTransform: "uppercase" as const,
    margin: "0 0 10px 0",
  } as React.CSSProperties,
  challengeName: {
    fontSize: "28px",
    fontWeight: "800",
    color: colors.white,
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  } as React.CSSProperties,
  challengeSubtitle: {
    fontSize: "14px",
    color: "#A7C4B5",
    margin: "0",
  } as React.CSSProperties,
  rulesBox: {
    backgroundColor: colors.bg,
    border: `1px solid #D1E8DB`,
    borderRadius: "8px",
    padding: "24px 28px",
    margin: "20px 0",
  } as React.CSSProperties,
  ruleItem: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    marginBottom: "14px",
    gap: "12px",
  } as React.CSSProperties,
  ruleCheck: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: colors.greenLight,
    color: colors.white,
    fontSize: "11px",
    fontWeight: "700",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexShrink: 0,
    marginTop: "2px",
  } as React.CSSProperties,
  ruleText: {
    fontSize: "14px",
    color: colors.text,
    lineHeight: "1.6",
    margin: "0",
  } as React.CSSProperties,
  bonusBadge: {
    display: "inline-block",
    backgroundColor: colors.gold,
    color: colors.greenDark,
    fontSize: "12px",
    fontWeight: "800",
    padding: "4px 10px",
    borderRadius: "4px",
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    marginLeft: "8px",
  } as React.CSSProperties,
  leaderboardPreview: {
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
  successStory: {
    borderLeft: `4px solid ${colors.gold}`,
    paddingLeft: "20px",
    margin: "28px 0",
  } as React.CSSProperties,
  successQuote: {
    fontSize: "16px",
    fontStyle: "italic",
    color: colors.greenDark,
    lineHeight: "1.7",
    margin: "0 0 10px 0",
  } as React.CSSProperties,
  successAttrib: {
    fontSize: "13px",
    color: colors.mutedText,
    fontWeight: "600",
    margin: "0",
  } as React.CSSProperties,
  countdownBox: {
    backgroundColor: "#FFF7ED",
    border: `2px solid ${colors.gold}`,
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "28px 0",
    textAlign: "center" as const,
  } as React.CSSProperties,
  countdownText: {
    fontSize: "14px",
    color: "#92400E",
    fontWeight: "700",
    margin: "0",
  } as React.CSSProperties,
  ctaButton: {
    display: "inline-block",
    backgroundColor: colors.gold,
    color: colors.greenDark,
    fontSize: "16px",
    fontWeight: "800",
    textDecoration: "none",
    padding: "14px 36px",
    borderRadius: "6px",
    letterSpacing: "0.5px",
  } as React.CSSProperties,
};

export const ReactivationWeek3: React.FC<ReactivationWeek3Props> = ({
  firstName,
  challengeEndDate,
  leaderboardUrl = "https://portal.sequoiaes.com/leaderboard",
  challengeAcceptUrl = "https://portal.sequoiaes.com/challenge/wellness-30-day",
  totalConsultants = 2500,
}) => {
  return (
    <EmailLayout previewText={`The 30-Day Wellness Challenge is live — bonus commission on your first enrollment.`}>
      {/* Eyebrow + Headline */}
      <p style={styles.eyebrow}>Official Announcement</p>
      <h1 style={styles.headline}>
        The 30-Day Wellness Challenge{firstName ? `, ${firstName}` : ""}
        <br />— Starts Right Now.
      </h1>

      {/* Challenge banner */}
      <div style={styles.challengeBanner}>
        <p style={styles.challengeTitle}>30-Day Challenge</p>
        <p style={styles.challengeName}>Wellness Sprint</p>
        <p style={styles.challengeSubtitle}>
          Submit your first Wellness enrollment this month.
          <br />
          Earn bonus commission. Claim your spot on the leaderboard.
        </p>
      </div>

      {/* Rules */}
      <h2 style={styles.sectionTitle}>How It Works</h2>
      <div style={styles.rulesBox}>
        <div style={styles.ruleItem}>
          <div style={styles.ruleCheck}>1</div>
          <p style={styles.ruleText}>
            Submit your first Wellness Program lead within the challenge window.
          </p>
        </div>
        <div style={styles.ruleItem}>
          <div style={styles.ruleCheck}>2</div>
          <p style={styles.ruleText}>
            Your lead enrolls — you immediately earn your standard commission,
            <strong>
              {" "}
              plus a one-time bonus on that first enrollment.
              <span style={styles.bonusBadge}>Bonus</span>
            </strong>
          </p>
        </div>
        <div style={{ ...styles.ruleItem, marginBottom: "0" }}>
          <div style={styles.ruleCheck}>3</div>
          <p style={styles.ruleText}>
            Your enrollment count posts to the live leaderboard in real time.
            Top performers will be featured in next week's results email and
            company-wide community post.
          </p>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Leaderboard preview */}
      <h2 style={styles.sectionTitle}>
        Where You Rank Among {totalConsultants.toLocaleString()}+ Consultants
      </h2>
      <div style={styles.leaderboardPreview}>
        <p style={styles.leaderboardTitle}>Current Top Performers</p>
        {[
          { rank: "🥇", name: "M. Carter — Atlanta, GA", stat: "12 enrolled" },
          { rank: "🥈", name: "D. Nguyen — Houston, TX", stat: "9 enrolled" },
          { rank: "🥉", name: "R. Patel — Chicago, IL", stat: "7 enrolled" },
          { rank: "4", name: "J. Williams — Miami, FL", stat: "6 enrolled" },
          { rank: "5", name: "A. Thompson — Phoenix, AZ", stat: "5 enrolled" },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              ...styles.leaderboardRow,
              ...(i === 4 ? { borderBottom: "none", paddingBottom: "0", marginBottom: "0" } : {}),
            }}
          >
            <span style={styles.leaderboardRank}>{row.rank}</span>
            <span style={styles.leaderboardName}>{row.name}</span>
            <span style={styles.leaderboardStat}>{row.stat}</span>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: "13px",
          color: colors.mutedText,
          textAlign: "center" as const,
          margin: "-8px 0 24px 0",
        }}
      >
        <a href={leaderboardUrl} style={{ color: colors.greenMid }}>
          View the full live leaderboard &rarr;
        </a>
      </p>

      <hr style={styles.divider} />

      {/* Success story */}
      <h2 style={styles.sectionTitle}>It Can Happen Fast</h2>
      <div style={styles.successStory}>
        <p style={styles.successQuote}>
          "I made a list of 10 business owners I already knew. Called five of
          them on a Tuesday, set three appointments, and had 15 employees
          enrolled by Friday. The Wellness Program practically sells itself
          — you just have to start the conversation."
        </p>
        <p style={styles.successAttrib}>
          — Sequoia Consultant, Southeast Region (15 enrollments in one week)
        </p>
      </div>

      {/* Countdown urgency */}
      <div style={styles.countdownBox}>
        <p style={styles.countdownText}>
          ⏰ Challenge ends {challengeEndDate}. Don't miss the bonus.
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" as const, margin: "32px 0" }}>
        <a href={challengeAcceptUrl} style={styles.ctaButton}>
          Accept the Challenge &rarr;
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
        Next week: We'll reveal the results and celebrate the top performers.
      </p>
    </EmailLayout>
  );
};

export default ReactivationWeek3;
