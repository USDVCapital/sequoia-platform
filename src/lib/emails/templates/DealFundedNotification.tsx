/**
 * DealFundedNotification.tsx
 * Subject: "Your Deal Has Been Funded! 🎉"
 *
 * Transactional notification sent when a consultant's deal is funded.
 * Celebrates the win, shows deal details, and encourages next steps.
 */

import React from "react";
import { EmailLayout } from "../shared/EmailLayout";

interface PipelineLead {
  clientName: string;
  dealType: string;
  estimatedValue: string;
}

interface DealFundedNotificationProps {
  consultantFirstName: string;
  clientName: string;
  dealType: string;
  fundedAmount: string; // e.g. "$125,000"
  commissionEarned: string; // e.g. "$3,750"
  fundedDate?: string; // e.g. "March 19, 2026"
  portalUrl?: string;
  communityUrl?: string;
  pipelineLeads?: PipelineLead[];
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

const defaultLeads: PipelineLead[] = [
  { clientName: "Brightfield Manufacturing", dealType: "Wellness Program", estimatedValue: "$2,400/mo" },
  { clientName: "Summit Staffing Group", dealType: "Group Health", estimatedValue: "$8,500" },
  { clientName: "Coastal Dental Partners", dealType: "Wellness Program", estimatedValue: "$1,800/mo" },
];

const styles = {
  celebrationHeader: {
    textAlign: "center" as const,
    padding: "8px 0 24px 0",
  } as React.CSSProperties,
  confettiEmoji: {
    fontSize: "48px",
    display: "block",
    margin: "0 auto 12px auto",
    lineHeight: "1",
  } as React.CSSProperties,
  headline: {
    fontSize: "30px",
    fontWeight: "800",
    color: colors.greenDark,
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  } as React.CSSProperties,
  subHeadline: {
    fontSize: "16px",
    color: colors.mutedText,
    margin: "0",
    lineHeight: "1.5",
  } as React.CSSProperties,
  divider: {
    height: "1px",
    backgroundColor: "#E5E7EB",
    margin: "28px 0",
    border: "none",
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.mutedText,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    margin: "0 0 16px 0",
  } as React.CSSProperties,
  dealCard: {
    backgroundColor: colors.greenDark,
    borderRadius: "12px",
    padding: "28px 32px",
    margin: "0 0 28px 0",
  } as React.CSSProperties,
  dealGrid: {
    width: "100%",
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,
  dealCellLabel: {
    fontSize: "11px",
    color: "#A7C4B5",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    fontWeight: "700",
    paddingBottom: "4px",
    display: "block",
  } as React.CSSProperties,
  dealCellValue: {
    fontSize: "17px",
    color: colors.white,
    fontWeight: "700",
    display: "block",
  } as React.CSSProperties,
  commissionCallout: {
    textAlign: "center" as const,
    borderTop: "1px solid rgba(255,255,255,0.15)",
    marginTop: "24px",
    paddingTop: "24px",
  } as React.CSSProperties,
  commissionLabel: {
    fontSize: "12px",
    color: "#A7C4B5",
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    fontWeight: "700",
    margin: "0 0 8px 0",
  } as React.CSSProperties,
  commissionAmount: {
    fontSize: "42px",
    fontWeight: "800",
    color: colors.gold,
    margin: "0",
    lineHeight: "1",
  } as React.CSSProperties,
  commissionSub: {
    fontSize: "13px",
    color: "#A7C4B5",
    margin: "6px 0 0 0",
  } as React.CSSProperties,
  shareBox: {
    backgroundColor: "#F0FDF4",
    border: `1px solid #86EFAC`,
    borderRadius: "8px",
    padding: "20px 24px",
    margin: "0 0 28px 0",
    textAlign: "center" as const,
  } as React.CSSProperties,
  shareText: {
    fontSize: "15px",
    color: colors.greenDark,
    fontWeight: "600",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
  } as React.CSSProperties,
  shareButton: {
    display: "inline-block",
    backgroundColor: colors.greenLight,
    color: colors.white,
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
    padding: "10px 24px",
    borderRadius: "6px",
    letterSpacing: "0.3px",
  } as React.CSSProperties,
  pipelineCard: {
    border: `1px solid #D1E8DB`,
    borderRadius: "8px",
    padding: "16px 18px",
    marginBottom: "10px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  } as React.CSSProperties,
  pipelineClientName: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.greenDark,
    margin: "0 0 3px 0",
  } as React.CSSProperties,
  pipelineDealType: {
    fontSize: "12px",
    color: colors.mutedText,
    margin: "0",
  } as React.CSSProperties,
  pipelineValue: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.greenMid,
    whiteSpace: "nowrap" as const,
    marginLeft: "12px",
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
  bodyText: {
    fontSize: "15px",
    color: colors.text,
    lineHeight: "1.7",
    margin: "0 0 16px 0",
  } as React.CSSProperties,
};

export const DealFundedNotification: React.FC<DealFundedNotificationProps> = ({
  consultantFirstName,
  clientName,
  dealType,
  fundedAmount,
  commissionEarned,
  fundedDate,
  portalUrl = "https://portal.sequoiaes.com",
  communityUrl = "https://portal.sequoiaes.com/community",
  pipelineLeads = defaultLeads,
}) => {
  return (
    <EmailLayout previewText={`Congratulations! Your deal with ${clientName} has been funded.`}>
      {/* Celebration header */}
      <div style={styles.celebrationHeader}>
        <span style={styles.confettiEmoji}>🎉</span>
        <h1 style={styles.headline}>
          Deal Funded,
          <br />
          {consultantFirstName}!
        </h1>
        <p style={styles.subHeadline}>
          Your hard work just paid off. Here are the details.
        </p>
      </div>

      {/* Deal card */}
      <div style={styles.dealCard}>
        {/* Deal details table */}
        <table role="presentation" style={{ width: "100%", borderCollapse: "collapse" as const }}>
          <tbody>
            <tr>
              <td style={{ paddingBottom: "20px", paddingRight: "16px", width: "50%", verticalAlign: "top" as const }}>
                <span style={styles.dealCellLabel}>Client</span>
                <span style={styles.dealCellValue}>{clientName}</span>
              </td>
              <td style={{ paddingBottom: "20px", width: "50%", verticalAlign: "top" as const }}>
                <span style={styles.dealCellLabel}>Deal Type</span>
                <span style={styles.dealCellValue}>{dealType}</span>
              </td>
            </tr>
            <tr>
              <td style={{ paddingRight: "16px", verticalAlign: "top" as const }}>
                <span style={styles.dealCellLabel}>Funded Amount</span>
                <span style={{ ...styles.dealCellValue, fontSize: "20px" }}>
                  {fundedAmount}
                </span>
              </td>
              {fundedDate && (
                <td style={{ verticalAlign: "top" as const }}>
                  <span style={styles.dealCellLabel}>Date Funded</span>
                  <span style={styles.dealCellValue}>{fundedDate}</span>
                </td>
              )}
            </tr>
          </tbody>
        </table>

        {/* Commission callout */}
        <div style={styles.commissionCallout}>
          <p style={styles.commissionLabel}>Your Commission</p>
          <p style={styles.commissionAmount}>{commissionEarned}</p>
          <p style={styles.commissionSub}>
            Processing within 3–5 business days
          </p>
        </div>
      </div>

      {/* Share with community */}
      <div style={styles.shareBox}>
        <p style={styles.shareText}>
          Your teammates would love to celebrate this win with you. Share it to
          the Community Feed and inspire the team.
        </p>
        <a href={communityUrl} style={styles.shareButton}>
          Share Your Success 🙌
        </a>
      </div>

      <hr style={styles.divider} />

      {/* Pipeline / next steps */}
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: colors.greenDark,
          margin: "0 0 6px 0",
        }}
      >
        Ready for your next deal?
      </h2>
      <p style={{ ...styles.bodyText, marginBottom: "20px" }}>
        Here are 3 leads currently in your pipeline:
      </p>

      {pipelineLeads.map((lead, i) => (
        <table
          key={i}
          role="presentation"
          style={{
            width: "100%",
            border: `1px solid #D1E8DB`,
            borderRadius: "8px",
            borderCollapse: "separate" as const,
            marginBottom: "10px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "16px 18px", verticalAlign: "middle" as const }}>
                <p style={styles.pipelineClientName}>{lead.clientName}</p>
                <p style={styles.pipelineDealType}>{lead.dealType}</p>
              </td>
              <td
                style={{
                  padding: "16px 18px",
                  textAlign: "right" as const,
                  verticalAlign: "middle" as const,
                }}
              >
                <span style={styles.pipelineValue}>{lead.estimatedValue}</span>
              </td>
            </tr>
          </tbody>
        </table>
      ))}

      {/* CTA */}
      <div style={{ textAlign: "center" as const, margin: "28px 0 0 0" }}>
        <a href={portalUrl} style={styles.primaryCta}>
          Go to My Portal &rarr;
        </a>
      </div>
    </EmailLayout>
  );
};

export default DealFundedNotification;
