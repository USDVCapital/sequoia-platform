import React from "react";

interface EmailLayoutProps {
  previewText?: string;
  children: React.ReactNode;
}

const styles = {
  body: {
    margin: "0",
    padding: "0",
    backgroundColor: "#F8FAF9",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    WebkitTextSizeAdjust: "100%" as const,
    MsTextSizeAdjust: "100%" as const,
  } as React.CSSProperties,
  outerTable: {
    width: "100%",
    backgroundColor: "#F8FAF9",
    borderCollapse: "collapse" as const,
  } as React.CSSProperties,
  innerWrapper: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "24px 16px",
  } as React.CSSProperties,
  card: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  header: {
    backgroundColor: "#1B4332",
    padding: "28px 40px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  headerLogoText: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    margin: "0",
    lineHeight: "1.2",
  } as React.CSSProperties,
  headerTagline: {
    color: "#A7C4B5",
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    margin: "6px 0 0 0",
  } as React.CSSProperties,
  goldBar: {
    height: "3px",
    backgroundColor: "#D4A843",
    width: "100%",
  } as React.CSSProperties,
  body_content: {
    padding: "40px",
    color: "#1A1A2E",
  } as React.CSSProperties,
  footer: {
    backgroundColor: "#1B4332",
    padding: "28px 40px",
    textAlign: "center" as const,
  } as React.CSSProperties,
  footerText: {
    color: "#A7C4B5",
    fontSize: "12px",
    lineHeight: "1.8",
    margin: "0 0 12px 0",
  } as React.CSSProperties,
  footerLinks: {
    margin: "12px 0 0 0",
  } as React.CSSProperties,
  footerLink: {
    color: "#D4A843",
    fontSize: "12px",
    textDecoration: "none",
    margin: "0 8px",
  } as React.CSSProperties,
  footerSeparator: {
    color: "#A7C4B5",
    fontSize: "12px",
  } as React.CSSProperties,
};

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  previewText,
  children,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Sequoia Enterprise Solutions</title>
        {previewText && (
          <style>{`
            .preview-text {
              display: none !important;
              font-size: 1px;
              line-height: 1px;
              max-height: 0px;
              max-width: 0px;
              opacity: 0;
              overflow: hidden;
              mso-hide: all;
            }
          `}</style>
        )}
      </head>
      <body style={styles.body}>
        {/* Preview text for email clients */}
        {previewText && (
          <div className="preview-text" aria-hidden="true">
            {previewText}
            {/* Padding to prevent inbox from pulling body text */}
            {"\u00A0\u200C".repeat(100)}
          </div>
        )}

        <table role="presentation" style={styles.outerTable}>
          <tbody>
            <tr>
              <td>
                <div style={styles.innerWrapper}>
                  <div style={styles.card}>
                    {/* Header */}
                    <div style={styles.header}>
                      <p style={styles.headerLogoText}>
                        Sequoia Enterprise Solutions
                      </p>
                      <p style={styles.headerTagline}>
                        Building Wealth. Securing Futures.
                      </p>
                    </div>

                    {/* Gold accent bar */}
                    <div style={styles.goldBar} />

                    {/* Body content */}
                    <div style={styles.body_content}>{children}</div>

                    {/* Footer */}
                    <div style={styles.footer}>
                      <p style={styles.footerText}>
                        Sequoia Enterprise Solutions
                        <br />
                        123 Business Center Drive, Suite 400
                        <br />
                        Atlanta, GA 30301
                        <br />
                        (800) 555-0100 &nbsp;|&nbsp; support@sequoiaes.com
                      </p>
                      <p style={styles.footerLinks}>
                        <a href="#portal" style={styles.footerLink}>
                          Agent Portal
                        </a>
                        <span style={styles.footerSeparator}>|</span>
                        <a href="#privacy" style={styles.footerLink}>
                          Privacy Policy
                        </a>
                        <span style={styles.footerSeparator}>|</span>
                        <a href="#unsubscribe" style={styles.footerLink}>
                          Unsubscribe
                        </a>
                      </p>
                      <p
                        style={{
                          ...styles.footerText,
                          marginTop: "12px",
                          marginBottom: "0",
                          fontSize: "11px",
                        }}
                      >
                        You are receiving this email because you are a
                        registered consultant
                        <br />
                        with Sequoia Enterprise Solutions.
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};

export default EmailLayout;
