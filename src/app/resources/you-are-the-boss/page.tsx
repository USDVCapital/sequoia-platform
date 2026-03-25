import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function YouAreTheBossPage() {
  const listItems = [
    'Your income is determined by your level of effort.',
    'You decide how many hours you are going to work.',
    'Do you want to work out of your home? Fine. An office? Fine. Do it. Like everything else, the decision is yours.',
    'You keep your own records.',
    'You enjoy the tax benefits of being in business for yourself.',
    'You must agree to abide by the Terms and Conditions and Company Policies and Procedures.',
  ];

  const cards = [
    {
      number: 1,
      title: 'Retail',
      description:
        'Your income is determined by your level of effort. Traditional retail involves buying products at wholesale prices and selling them at retail prices, keeping the markup as profit.',
    },
    {
      number: 2,
      title: 'Catalog / Online Sales',
      description:
        'We either order from a website or the manufacturer sends catalogues, allowing us to order the items we want. The manufacturer then ships the merchandise directly to us, thereby eliminating two links in the distribution chain.',
    },
    {
      number: 3,
      title: 'Direct Sales',
      description:
        'The door-to-door selling technique. A manufacturer\u2019s representative comes to our home, shows us the line and we make our selections. The only markup is the commission paid to the manufacturer\u2019s representative. Fuller Brush, the Avon Lady, Tupperware, home parties \u2014 these are all examples of Direct Sales companies.',
    },
    {
      number: 4,
      title: 'Network Marketing',
      description:
        'This is the modern form of selling. Goods and services are available directly from the company through its network of Consultants. The company provides the materials and support needed to make each Consultant a successful business person.',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4">
              <span>Training Library</span>
              <span className="mx-2">&gt;</span>
              <span>Mindset &amp; Business Basics</span>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-800 font-medium">You Are the Boss</span>
            </nav>

            {/* Badge */}
            <span className="bg-[#C9A84C] text-white text-xs px-3 py-1 rounded-full font-medium inline-block mb-4">
              Foundational Reading
            </span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0D2B1E] mb-3">
              You Are the Boss
            </h1>

            {/* Meta line */}
            <p className="text-gray-500 text-sm">
              5 min read &middot; Mindset &amp; Business Basics
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* Opening paragraph */}
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              You are the Boss &mdash; you really are. You decide who you want to have as
              customers and who as Consultants. No one will be looking over your shoulder;
              there is no time clock to punch; no set number of hours you have to work. You
              make every decision. You are a member of our family. The only one setting
              limits and goals is YOU.
            </p>

            {/* Ordered list with gold number badges */}
            <ol className="space-y-4 mb-10">
              {listItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#C9A84C] text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-base leading-relaxed pt-1">
                    {item}
                  </span>
                </li>
              ))}
            </ol>

            {/* Second paragraph */}
            <p className="text-gray-700 text-lg leading-relaxed mb-12">
              These standards are to ensure the highest levels of product and customer
              satisfaction. You work as an independent contractor, not as an employee. If
              you truly dedicate 100% of your efforts to the program, the results could
              amaze you. A key to reaching those stratospheric plateaus is being very
              selective about whom you sponsor. You will achieve your maximum potential by
              selecting individuals with great care. Like yourself, they must be
              goal-oriented, profit-motivated, and not afraid to expend the total effort
              that will help both them and you achieve your common goals. For your part, it
              is not enough to simply sign up Consultants &mdash; you have to set the
              standard by working with them until they feel comfortable enough to go out on
              their own, and even then, continue to motivate, train, and lead them.
            </p>

            {/* Section heading */}
            <h2 className="text-3xl font-bold text-[#0D2B1E] mb-8">
              How Products Are Sold
            </h2>

            {/* 2x2 card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {cards.map((card) => (
                <div
                  key={card.number}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <span className="w-8 h-8 rounded-full bg-[#C9A84C] text-white font-bold flex items-center justify-center mb-4">
                    {card.number}
                  </span>
                  <h3 className="text-lg font-semibold text-[#0D2B1E] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Closing paragraph with gold left border */}
            <blockquote className="border-l-4 border-[#C9A84C] pl-6 italic text-gray-700 mb-12">
              The ultimate goal of any marketing system is to sell product. A major
              difference between Network Marketing and other sales systems is the Network
              Marketing philosophy of sharing the profits. The moment you become a
              Consultant, you instantly become the BOSS. We will, of course, be there every
              step of the way &mdash; but as a partner, not your employer. It is in our most
              selfish interest to make sure that you succeed.
            </blockquote>

            {/* Motto callout */}
            <div className="bg-[#0D2B1E] text-white rounded-2xl p-8 text-center mb-12">
              <p className="text-2xl sm:text-3xl font-bold mb-4">
                YOUR SUCCESS IS OUR SUCCESS
              </p>
              <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
                That is the key philosophy behind our Network Marketing plan &mdash; you
                working with your people to make them winners so they can do the same for
                you.
              </p>
            </div>

            {/* Bottom navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
              <Link
                href="/resources/getting-started"
                className="text-[#0D2B1E] hover:text-[#C9A84C] font-medium transition-colors"
              >
                &larr; Previous Article
              </Link>
              <Link
                href="/portal/training"
                className="text-gray-500 hover:text-[#0D2B1E] text-sm transition-colors"
              >
                Back to Training Library
              </Link>
              <Link
                href="/resources/how-to-be-liked"
                className="text-[#0D2B1E] hover:text-[#C9A84C] font-medium transition-colors"
              >
                Next Article &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
