import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const principles = [
  'To have a friend, you must be one.',
  'The greatest hunger that people have is to be needed, wanted, and loved. Help create those feelings in others.',
  'Do not try to impress others. Let them impress you.',
  'Be kind to people. You cannot always love them, but you can be kind to them.',
  'Learn to like yourself. Others will respond to you the way you respond to yourself.',
  'Be enthusiastic. Nothing significant was ever achieved without enthusiasm — including deep, rich human relationships.',
  'Be positive. Positive people attract others; negative people repel others.',
  'Do things to make people feel important. Write a letter. Give a compliment. Say "Thank you." Praise. Encourage. Support. Cooperate.',
  'Sticking up for your rights is great, but do you always have to be right? Letting the other person be right once in a while will keep friendships warm.',
  'Be a good listener. You can have a greater effect on others by the way that you listen than by the way that you talk.',
  'Unless you can say something worthy about a person, say nothing.',
  'Call a person by name. Use it often in your conversation.',
  'Communicate cheerfulness. Smile. Be pleasant. Talk about the brighter things in life.',
  'Avoid arguments.',
  'If you are going to make fun of someone, make sure it is yourself.',
  'Help people like themselves. The greatest compliment someone can give you is to say, "I like myself better when I am with you."',
  'Be genuinely interested in others. Get them to talk about themselves. Ask for their opinions, ideas, and viewpoints.',
]

export default function HowToBeLinkedPage() {
  return (
    <>
      <Navbar />

      <main className="bg-white min-h-screen">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/portal/training" className="hover:text-gray-700 transition-colors">
                Training Library
              </Link>
              <span>&gt;</span>
              <span>Mindset &amp; Business Basics</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-medium">How to Be Liked by Others</span>
            </nav>

            {/* Badge */}
            <span className="bg-[#C9A84C] text-white text-xs px-3 py-1 rounded-full font-medium inline-block mb-4">
              Foundational Reading
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0D2B1E] mb-3">
              How to Be Liked by Others
            </h1>

            {/* Meta line */}
            <p className="text-gray-500 text-sm">
              4 min read &middot; Mindset &amp; Business Basics
            </p>
          </div>
        </section>

        {/* Content Body */}
        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Opening paragraph */}
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              You will get what you want out of life only if you are able to get along with people.
              Getting along with others means that they like you and will do things for you. In other
              words, they react positively to your personality. Your personality is nothing more nor
              less than your attitudes in action — it is the way you communicate your thoughts about
              others and yourself. Here are some principles to remember to make your personality
              pleasing and create positive reactions in others.
            </p>

            {/* The 17 Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {principles.map((principle, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4 items-start${
                    index === 16 ? ' md:col-span-2' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#C9A84C] text-white font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1.5">{principle}</p>
                </div>
              ))}
            </div>

            {/* Reflection prompt */}
            <div className="bg-[#0D2B1E]/5 rounded-xl p-6 mt-8">
              <h2 className="text-lg font-bold text-[#0D2B1E] mb-2">Reflect on This</h2>
              <p className="text-gray-700 leading-relaxed">
                Which of these 17 principles do you find most challenging? Which comes most naturally
                to you? The consultants who build the largest and most loyal teams are almost always
                those who master the art of genuine human connection.
              </p>
            </div>

            {/* Bottom navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
              <Link
                href="/resources/you-are-the-boss"
                className="text-[#0D2B1E] font-medium hover:underline text-sm"
              >
                &larr; Previous Article
              </Link>
              <Link
                href="/portal/training"
                className="text-[#0D2B1E] font-medium hover:underline text-sm"
              >
                Back to Training Library
              </Link>
              <span className="text-gray-400 text-sm">
                More articles coming soon
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
