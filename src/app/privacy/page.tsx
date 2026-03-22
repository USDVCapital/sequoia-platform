import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Sequoia Enterprise Solutions',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 21, 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-gray-700">
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              We collect information you provide directly to us when you use our Service, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Personal information:</strong> name, email address, phone number, and
                mailing address when you fill out forms, apply for funding, or enroll as a
                consultant.
              </li>
              <li>
                <strong>Business information:</strong> business name, funding type, estimated
                amounts, and professional background.
              </li>
              <li>
                <strong>Payment information:</strong> billing details processed through our
                third-party payment processor. We do not store credit card numbers on our servers.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, time spent on site, browser type, device
                information, IP address, and referring URLs collected automatically through cookies
                and similar technologies.
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process applications and connect you with appropriate lending partners or advisors.</li>
              <li>Manage your consultant membership account.</li>
              <li>Send transactional emails, service updates, and (with your consent) marketing communications.</li>
              <li>Respond to your comments, questions, and support requests.</li>
              <li>Monitor and analyze trends, usage, and activity to improve user experience.</li>
              <li>Detect, investigate, and prevent fraud or other illegal activities.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Third-Party Sharing</h2>
            <p className="mb-3">
              We do not sell your personal information. We may share your information with third
              parties only in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Lending partners:</strong> When you submit a funding application, we share
                relevant details with our vetted lending partners to facilitate your request. We only
                share what is necessary to process your inquiry.
              </li>
              <li>
                <strong>Service providers:</strong> We engage third-party companies to perform
                services on our behalf (e.g., payment processing, email delivery, analytics). These
                providers are contractually obligated to protect your information.
              </li>
              <li>
                <strong>Legal compliance:</strong> We may disclose information if required by law,
                regulation, legal process, or governmental request.
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with a merger, acquisition, or
                sale of assets, your information may be transferred as part of that transaction.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Cookies &amp; Tracking Technologies</h2>
            <p>
              We use cookies, web beacons, and similar technologies to collect usage data and improve
              our Service. Cookies are small text files stored on your device that help us recognize
              you and remember your preferences. You can instruct your browser to refuse all cookies
              or to indicate when a cookie is being sent. However, some features of the Service may
              not function properly without cookies. We may also use third-party analytics services
              (such as Google Analytics) that use cookies to collect and analyze usage information.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security
              of your personal information, including encryption in transit (TLS/SSL) and at rest.
              However, no method of transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security. You are responsible for maintaining
              the confidentiality of your account credentials.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed
              to provide you services, comply with our legal obligations, resolve disputes, and
              enforce our agreements. When your information is no longer needed, we will securely
              delete or anonymize it.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal
              information:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Access:</strong> You may request a copy of the personal information we hold
                about you.
              </li>
              <li>
                <strong>Correction:</strong> You may request that we correct inaccurate or
                incomplete information.
              </li>
              <li>
                <strong>Deletion:</strong> You may request that we delete your personal information,
                subject to certain legal exceptions.
              </li>
              <li>
                <strong>Opt-out of sale:</strong> We do not sell personal information. If this
                changes, we will provide a clear opt-out mechanism as required under the California
                Consumer Privacy Act (CCPA).
              </li>
              <li>
                <strong>Data portability:</strong> Where applicable under GDPR, you may request your
                data in a structured, commonly used, and machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent:</strong> Where processing is based on consent, you may
                withdraw that consent at any time without affecting the lawfulness of prior
                processing.
              </li>
              <li>
                <strong>Non-discrimination:</strong> We will not discriminate against you for
                exercising any of your privacy rights.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us at{' '}
              <a
                href="mailto:support@seqsolution.com"
                className="font-semibold text-sequoia-700 hover:text-sequoia-800 underline underline-offset-2"
              >
                support@seqsolution.com
              </a>
              . We will respond to your request within 30 days (or as otherwise required by
              applicable law).
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 18. We do not knowingly
              collect personal information from children. If we learn that we have collected personal
              information from a child under 18, we will take steps to delete that information
              promptly.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new Privacy Policy on this page and updating the
              &ldquo;Last updated&rdquo; date above. Your continued use of the Service after any
              changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please
              contact us at:
            </p>
            <p className="mt-3">
              <strong>Sequoia Enterprise Solutions</strong>
              <br />
              9200 Corporate Blvd, Ste 142
              <br />
              Rockville, MD 20850
              <br />
              <a
                href="mailto:support@seqsolution.com"
                className="font-semibold text-sequoia-700 hover:text-sequoia-800 underline underline-offset-2"
              >
                support@seqsolution.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
