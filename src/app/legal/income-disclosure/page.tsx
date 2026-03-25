import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const incomeData = [
  { level: '$25,000+', activePercent: '0%', allPercent: '0%', high: '$0', low: '$0', avg: '$0', annualized: '$0' },
  { level: '$10,000–$24,999', activePercent: '0%', allPercent: '0%', high: '$0', low: '$0', avg: '$0', annualized: '$0' },
  { level: '$5,000–$9,999', activePercent: '0%', allPercent: '0%', high: '$0', low: '$0', avg: '$0', annualized: '$0' },
  { level: '$2,500–$4,999', activePercent: '0%', allPercent: '0%', high: '$0', low: '$0', avg: '$0', annualized: '$0' },
  { level: '$1,000–$2,499', activePercent: '0%', allPercent: '0%', high: '$0', low: '$0', avg: '$0', annualized: '$0' },
  { level: '$500–$999', activePercent: '0%', allPercent: '0%', high: '$0', low: '$0', avg: '$0', annualized: '$0' },
  { level: '$250–$499', activePercent: '< 1%', allPercent: '< 1%', high: '$304', low: '$304', avg: '$304', annualized: '$3,654' },
  { level: '$100–$249', activePercent: '1%', allPercent: '< 1%', high: '$227', low: '$106', avg: '$162', annualized: '$1,945' },
  { level: 'Less Than $100 (Active)', activePercent: '99%', allPercent: '11%', high: '$62', low: '$0', avg: '$0', annualized: '$8' },
  { level: 'Less Than $100 (All)', activePercent: 'N/A', allPercent: '88%', high: '$39', low: '$0', avg: '$0', annualized: '$0' },
];

export default function IncomeDisclosurePage() {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <section className="bg-[#0D2B1E] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Income Disclosure Statement
          </h1>
          <p className="text-lg md:text-xl text-[#C9A84C]">
            Sequoia Enterprise Solutions — Effective June 19, 2022 through February 28, 2026
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed">
          <p>
            The Sequoia Enterprise Solutions Compensation Plan is an exciting opportunity that rewards you for selling our products and services and for sponsoring other participants who do the same. Although the opportunity is unlimited, individual results will vary depending on commitment levels and sales skills of each participant. Since Sequoia Enterprise Solutions has recently launched, it lacks enough statistical data to prepare reliable income disclosures. The numbers below reflect estimates prepared by the company pending a more detailed survey to be conducted after its first year. Based on industry standards and company projections, the average annual gross income for consultants is projected to be anywhere between $500 and $2,000. There will certainly be participants who will earn less while others will earn much more. We are excited about the Sequoia Enterprise Solutions Compensation Plan and we are confident it will provide you a solid foundation to help you achieve your financial goals.
          </p>
          <p>
            Sequoia Enterprise Solutions pays commissions according to the current compensation plan. Study our commission structure and the income statistics below. Discuss our company with professional advisers and experienced affiliate marketers before deciding to purchase or promote any of Sequoia Enterprise Solutions&apos; products and services. Sequoia Enterprise Solutions does not guarantee you will make any money from your use or promotion of our products and services.
          </p>
          <p>
            If income projections were presented to you prior to your enrollment, such projections are not necessarily representative of the income, if any, that you can or will earn through your participation in the Compensation Plan. These income projections should not be considered as guarantees or projections of your actual earnings or profits. Success with Sequoia Enterprise Solutions results only from hard work, dedication, and leadership.
          </p>
        </div>
      </section>

      {/* Income Statistics Table */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0D2B1E] text-center mb-8">
            Income Statistics from June 19, 2022 to February 28, 2026
          </h2>

          <div className="border-t-4 border-[#C9A84C] rounded-lg overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0D2B1E] text-white">
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Monthly Income Level</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">% Of Active Consultants</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">% Of All Consultants</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Monthly Income High</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Monthly Income Low</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Monthly Income Average</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Annualized Average Income</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F0E8]'}
                    >
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{row.level}</td>
                      <td className="px-4 py-3 text-center">{row.activePercent}</td>
                      <td className="px-4 py-3 text-center">{row.allPercent}</td>
                      <td className="px-4 py-3 text-center">{row.high}</td>
                      <td className="px-4 py-3 text-center">{row.low}</td>
                      <td className="px-4 py-3 text-center">{row.avg}</td>
                      <td className="px-4 py-3 text-center">{row.annualized}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile scroll hint */}
          <p className="sm:hidden text-center text-sm text-gray-500 mt-3">
            Scroll right to see all columns →
          </p>

          {/* Footnote */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-gray-700 mt-6 leading-relaxed">
            Each month we track the high, low and average monthly income for our Consultants for the income levels shown. This table shows for each monthly income level the corresponding income statistics over the indicated time frame. Incomes are for our Consultants, are net of refunds and chargebacks, and do not account for any costs incurred by the Consultant. The average consultant spends between $500 and $3,000 in expenses as they build their business. Less than 4% earn sufficient commissions to cover their costs. Note that it takes hard work to make substantial income in this business and some Consultants make no money at all. A Consultant is someone who: (a) has executed a Consultant application; (b) is qualified to earn commissions during the month; and (c) has not been terminated or chosen to discontinue for any reason during that month. A Consultant is considered active if they have additionally earned a commission during the month. All figures are in US dollars.
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-green-50 border-t-4 border-[#C9A84C] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-700 mb-6">
            Questions about the compensation plan? Review the full plan document or speak with your sponsor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/portal/compensation"
              className="inline-block bg-[#0D2B1E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#164A33] transition-colors"
            >
              View Compensation Plan
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-[#0D2B1E] text-[#0D2B1E] px-6 py-3 rounded-lg font-semibold hover:bg-[#0D2B1E] hover:text-white transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
