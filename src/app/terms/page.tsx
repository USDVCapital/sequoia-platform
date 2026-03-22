import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Sequoia Enterprise Solutions',
}

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 21, 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-gray-700">
          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Sequoia Enterprise Solutions website and services
              (collectively, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). If you do not agree to all of these Terms, you may not
              access or use the Service. We reserve the right to update or modify these Terms at any
              time, and your continued use of the Service after any such changes constitutes your
              acceptance of the revised Terms.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              Sequoia Enterprise Solutions provides a commercial funding advisory and consultant
              platform. Our services include, but are not limited to, connecting businesses with
              lending partners, offering consultant enrollment and training, clean-energy program
              facilitation, and employee wellness program administration. We act as an intermediary
              and advisor; we are not a direct lender.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Membership</h2>
            <p>
              The Sequoia Consultant Membership is offered at a rate of <strong>$29.99 per month</strong>.
              Your membership grants you access to the consultant portal, training library, AI
              assistant, CRM tools, and the full Sequoia product suite. Membership fees are billed
              monthly on the date of enrollment. All fees are non-refundable except as expressly
              stated in our Cancellation Policy below.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Cancellation Policy</h2>
            <p>
              You may cancel your Consultant Membership at any time through your account dashboard
              or by contacting our support team at{' '}
              <a
                href="mailto:support@seqsolution.com"
                className="font-semibold text-sequoia-700 hover:text-sequoia-800 underline underline-offset-2"
              >
                support@seqsolution.com
              </a>
              . Cancellation will take effect at the end of your current billing cycle. You will
              retain access to the platform until the end of the period for which you have already
              paid. No partial refunds are provided for unused portions of a billing period.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. User Conduct</h2>
            <p>
              You agree to use the Service only for lawful purposes and in accordance with these
              Terms. You agree not to: (a) use the Service in any way that violates any applicable
              federal, state, or local law; (b) impersonate any person or entity; (c) transmit any
              material that is defamatory, obscene, or otherwise objectionable; or (d) interfere
              with or disrupt the Service or servers or networks connected to the Service.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Service — including but not limited to
              text, graphics, logos, icons, images, audio clips, training materials, and software —
              are the exclusive property of Sequoia Enterprise Solutions or its licensors and are
              protected by United States and international copyright, trademark, and other
              intellectual property laws.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Sequoia Enterprise Solutions, its
              officers, directors, employees, and agents shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or
              revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
              or other intangible losses, resulting from: (a) your access to or use of or inability
              to access or use the Service; (b) any conduct or content of any third party on the
              Service; or (c) unauthorized access, use, or alteration of your transmissions or
              content. In no event shall our aggregate liability exceed the amount you have paid us
              in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis
              without any warranties of any kind, either express or implied, including but not
              limited to implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement. Sequoia Enterprise Solutions does not guarantee that the Service will
              be uninterrupted, secure, or error-free.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              State of Maryland, without regard to its conflict of law provisions. Any legal action
              or proceeding arising out of or related to these Terms or the Service shall be brought
              exclusively in the federal or state courts located in Montgomery County, Maryland, and
              you consent to the personal jurisdiction of such courts.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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
