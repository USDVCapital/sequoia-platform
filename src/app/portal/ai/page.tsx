'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCheck,
  TreePine,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ── Suggested prompts ─────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "What credit score do I need for a fix-and-flip loan?",
  "How do I explain the EHMP to a skeptical employer?",
  "What documents does an SBA borrower need?",
  "How does the DSCR loan work for rental properties?",
  "What is the minimum employee count for EHMP?",
  "How much can I earn as a consultant?",
]

// ── Keyword-matched response library ──────────────────────────────────────────

const responseMap: { keywords: string[]; response: string }[] = [
  {
    keywords: ['fix and flip', 'fix & flip', 'flip', 'rehab'],
    response: '**Fix & Flip Loan Criteria:**\n\n- Credit Score: 620+\n- LTV: Up to 90% of purchase price, 100% of rehab costs, based on 70% of ARV\n- Terms: 6\u201318 months\n- No income verification required\n- Funding in 5\u201310 business days\n- Loan amounts: $100K\u2013$5M\n\nThis is one of our fastest-closing products. The key is having a solid ARV appraisal and a clear scope of work. Would you like help preparing a submission?'
  },
  {
    keywords: ['dscr', 'rental', 'investment property'],
    response: '**DSCR Rental Loan Criteria:**\n\n- Minimum DSCR: 1.0\n- LTV: Up to 75%\n- No income verification \u2014 qualification based on property cash flow\n- 30-year fixed rate available\n- Credit: 640+\n- Available for non-owner-occupied 1\u20134 unit and small multifamily\n\nDSCR loans are ideal for investors who want to qualify based on the property\'s income rather than personal income. The debt service coverage ratio is calculated as: Net Operating Income \u00f7 Annual Debt Service.'
  },
  {
    keywords: ['sba', '7a', '504'],
    response: '**SBA Loan Programs:**\n\n**SBA 7(a):**\n- Up to $5M\n- Credit: 680+\n- 2 years in business required\n- Terms: 10\u201325 years\n- Collateral required above $25K\n- Best for: working capital, equipment, real estate\n\n**SBA 504:**\n- For owner-occupied commercial real estate and heavy equipment\n- Up to $5.5M SBA portion\n- 10% borrower equity\n- 20\u201325 year fixed rate\n\n**Documents typically needed:** 3 years tax returns, YTD P&L, balance sheet, business plan, debt schedule.'
  },
  {
    keywords: ['ehmp', 'wellness', 'health', 'fica', 'section 125', 'employee benefit'],
    response: '**EHMP (Employee Health Management Platform):**\n\nThe EHMP is a Section 125 IRS-compliant plan that restructures how certain employee benefits are delivered, generating FICA payroll tax savings that fully fund a comprehensive health benefit program.\n\n**Key facts:**\n- Zero net cost to the employer (funded by FICA savings)\n- Minimum 5 employees\n- Consultant commission: $12\u2013$18 per employee per month (recurring)\n- Enrollment typically takes 2\u20134 weeks\n- Benefits include: telehealth, prescription savings, mental health, vision, dental, wellness coaching\n\n**The math:** A 200-employee company generates approximately $3,600/month in recurring commissions for the consultant. That\'s $43,200/year from a single account.'
  },
  {
    keywords: ['skeptical', 'objection', 'too good', 'pitch', 'present', 'sell', 'employer'],
    response: '**How to Present EHMP to Skeptical Employers:**\n\n1. **Lead with their pain point**, not the product: \u201cAre you concerned about rising healthcare costs and employee retention?\u201d\n\n2. **Introduce the concept:** \u201cWhat if I could show you a way to offer comprehensive health benefits that actually saves your company money?\u201d\n\n3. **Explain the mechanism simply:** \u201cThrough a legal restructuring of how certain benefits are delivered, your company generates FICA tax savings that fully fund the program.\u201d\n\n4. **Address the #1 objection:** \u201cThis isn\'t a loophole \u2014 it\'s built on Section 125 of the IRS code, which has been in place since 1978.\u201d\n\n5. **Show specific numbers:** Use the EHMP calculator to show their exact savings based on employee count.\n\n6. **Low-risk close:** \u201cLet us run the numbers for your company at no cost. If it doesn\'t make sense, no obligation.\u201d'
  },
  {
    keywords: ['equipment', 'machinery', 'vehicle', 'truck'],
    response: '**Equipment Financing:**\n\n- Equipment serves as collateral (no additional collateral needed)\n- Credit: 600+\n- 1 year in business minimum\n- Up to 100% financing\n- Terms: 2\u20137 years\n- Available for: construction equipment, medical equipment, restaurant equipment, manufacturing, trucks, commercial vehicles\n\n**Commercial Vehicle/Fleet:**\n- Credit: 580+\n- New and used vehicles\n- Terms up to 72 months\n- For trucks, vans, and commercial fleets'
  },
  {
    keywords: ['working capital', 'mca', 'cash advance', 'fast funding', 'quick'],
    response: '**Working Capital / MCA:**\n\n- Revenue-based qualification\n- 6 months bank statements required\n- Credit: 550+ (most flexible product)\n- Same-day approval possible\n- Funding: $10K\u2013$500K\n- Factor rates from 1.15\n\nThis is our fastest product \u2014 ideal for businesses that need capital quickly and have strong revenue. The qualification is based primarily on bank deposits rather than credit score.'
  },
  {
    keywords: ['commission', 'earn', 'income', 'compensation', 'pay', 'money'],
    response: '**Sequoia Consultant Income Streams:**\n\n1. **EHMP Recurring Commissions:** $12\u2013$18 per enrolled employee per month. This is recurring passive income \u2014 a single 200-employee account = ~$3,600/month.\n\n2. **Loan Referral Commissions:** One-time commissions on funded commercial deals. Varies by product and loan size.\n\n3. **Revenue Share:** Earn a percentage of production from consultants you\'ve recruited into the network.\n\n**Example monthly income:**\n- 50 EHMP enrollees = $600\u2013$900/month\n- 100 EHMP enrollees = $1,200\u2013$1,800/month\n- 250 EHMP enrollees = $3,000\u2013$4,500/month\n- Plus loan commissions on closed deals'
  },
  {
    keywords: ['get started', 'new', 'begin', 'first', 'start', 'join'],
    response: '**Getting Started as a Sequoia Consultant:**\n\n1. **Enroll** at $29.99/month \u2014 this gives you full access to the platform\n2. **Complete your profile** in the portal\n3. **Watch the \u201cWelcome to Sequoia\u201d training video**\n4. **Attend your first Wednesday training** (every Wed at 8 PM ET)\n5. **Start with EHMP** \u2014 it\'s the fastest path to your first commission because it costs the employer nothing out of pocket\n6. **Use the CEA AI** (that\'s me!) to prepare for client conversations\n7. **Submit your first lead** through the portal\n\nThe 30-Day Reactivation Challenge at /reactivation is a great structured path if you want step-by-step guidance.'
  },
  {
    keywords: ['solar', 'ev', 'charging', 'clean energy', 'green'],
    response: '**Clean Energy Financing:**\n\n**Commercial Solar:**\n- Zero-down financing available\n- Terms: 20\u201325 years\n- Average ROI: 15\u201325% over system life\n- Federal tax credits (ITC) + depreciation benefits\n- For commercial and industrial properties\n\n**EV Charging Stations:**\n- Level 2 and DC fast charging\n- For commercial properties, multifamily, and fleets\n- Federal tax credits up to 30%\n- Financing available\n\nWe have 2 active locations in Chicago with 15 charging stations already deployed.'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    response: 'Hi Todd! Great to see you in the portal. I\'m your Sequoia AI assistant \u2014 here to help you close more deals and support your consulting business.\n\nYou can ask me about:\n- **Loan products** \u2014 criteria, LTV, eligibility\n- **Sales strategy** \u2014 pitching, objection handling, referral partners\n- **The Wellness Program** \u2014 how it works, who to target\n- **Deal structuring** \u2014 how to package a file for underwriting\n- **Commission & earnings** \u2014 how much you can make\n\nWhat can I help you with today?'
  },
  {
    keywords: ['ltv', 'loan to value', 'commercial'],
    response: '**LTV Guidelines for Commercial Products:**\n\n- Multi-Family (5+ units): 80% LTV (stabilized properties)\n- Mixed-Use: 75% LTV (depends on occupancy)\n- Office / Retail: 70\u201375% LTV (market-dependent)\n- Industrial / Warehouse: 70% LTV\n- Bridge Loans: 70\u201375% LTV (on stabilized as-is value)\n- DSCR Rental (1\u20134 unit): 80% LTV (min 1.1 DSCR)\n- Fix & Flip: 90% LTC (up to 100% rehab)\n- Construction: 70% ARV (draws on completion)\n- SBA 7(a): Up to 90% (with SBA guarantee)\n\n**Important:** These are general guidelines. Every deal is reviewed on its merits \u2014 strong sponsors or cash-flowing properties can sometimes push above these benchmarks.'
  },
  {
    keywords: ['cpa', 'accountant', 'tax', 'referral'],
    response: '**CPAs as Referral Partners:**\n\nCPAs work with business owners every day. Their clients regularly ask about capital, growth financing, and benefits. You\'re not competing with them \u2014 you\'re adding value.\n\n**Your opening script:**\n\u201cHi [Name], I work with Sequoia Enterprise Solutions. We help business owners access commercial funding and employee wellness programs. I\'d love to set up a 15-minute call to show you what we do \u2014 if it\'s a fit, I can be a resource you refer clients to with full confidence.\u201d\n\n**What to offer:**\n- A referral arrangement\n- A simple one-pager they can hand to clients\n- A shared intake form for easy warm referrals\n\n**Key insight:** Don\'t pitch the product first. Pitch the partnership. CPAs are protective of their client relationships \u2014 show them you\'re professional and they\'ll send you deal flow for years.'
  },
]

const FALLBACK_RESPONSE = "That's a great question. I don't have a specific answer in my current knowledge base, but your Sequoia specialist can address it directly. You can reach the team at support@seqsolution.com or join Wednesday's live training at 8 PM ET."

// ── AI Response Logic ─────────────────────────────────────────────────────────

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()

  for (const entry of responseMap) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        return entry.response
      }
    }
  }

  return FALLBACK_RESPONSE
}

function getTimestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ── localStorage helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = 'sequoia-cea-chat-history'

function loadChatHistory(): Message[] | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore parse errors
  }
  return null
}

function saveChatHistory(messages: Message[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore storage errors
  }
}

// ── Welcome message ───────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: 0,
  role: 'assistant',
  content: `Hi Todd! I'm your **Sequoia Enterprise AI assistant** (CEA). Ask me anything about our products, loan criteria, or how to approach a client.

Here are a few things I can help with:
- Loan product criteria and eligibility
- LTV limits and deal structuring
- Sales scripts and pitch strategies
- How the Wellness / EHMP program works
- Objection handling for any product line
- Commission and earnings potential

What would you like to know?`,
  timestamp: getTimestamp(),
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Empty line -> spacing
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
      i++
      continue
    }

    // Bullet points
    if (line.trimStart().startsWith('- ')) {
      const bulletItems: { content: string; index: number }[] = []
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        bulletItems.push({ content: lines[i].trimStart().slice(2), index: i })
        i++
      }
      elements.push(
        <ul key={`ul-${bulletItems[0].index}`} className="list-disc list-inside space-y-1 ml-1">
          {bulletItems.map((item) => (
            <li key={item.index}>{renderInline(item.content)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trimStart())) {
      const listItems: { content: string; index: number }[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trimStart())) {
        listItems.push({ content: lines[i].trimStart().replace(/^\d+\.\s/, ''), index: i })
        i++
      }
      elements.push(
        <ol key={`ol-${listItems[0].index}`} className="list-decimal list-inside space-y-1 ml-1">
          {listItems.map((item) => (
            <li key={item.index}>{renderInline(item.content)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Regular line
    elements.push(
      <p key={i}>{renderInline(line)}</p>
    )
    i++
  }

  return <>{elements}</>
}

function renderInline(text: string): React.ReactNode {
  // Split on bold markers (**text**)
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, j) =>
    j % 2 === 1 ? (
      <strong key={j} className="font-semibold">
        {renderItalic(part)}
      </strong>
    ) : (
      <span key={j}>{renderItalic(part)}</span>
    ),
  )
}

function renderItalic(text: string): React.ReactNode {
  // Handle *italic* and \u201cquoted\u201d text
  const parts = text.split(/\u201c(.*?)\u201d/g)
  return parts.map((part, j) =>
    j % 2 === 1 ? (
      <span key={j} className="italic">&ldquo;{part}&rdquo;</span>
    ) : (
      part
    )
  )
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  function copyText() {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-br from-sequoia-700 to-sequoia-900 text-white'
        }`}
      >
        {isUser ? <User size={14} /> : <TreePine size={14} />}
      </div>

      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-sequoia-800 text-white rounded-tr-sm'
              : 'bg-white border border-[var(--neutral-200)] text-[var(--neutral-700)] rounded-tl-sm shadow-[var(--shadow-sm)]'
          }`}
        >
          {isUser ? message.content : renderMarkdown(message.content)}
        </div>

        {/* Timestamp + copy */}
        <div
          className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} opacity-0 group-hover:opacity-100 transition-opacity duration-150`}
        >
          <span className="text-xs text-[var(--neutral-400)]">{message.timestamp}</span>
          {!isUser && (
            <button
              onClick={copyText}
              className="text-[var(--neutral-300)] hover:text-sequoia-600 transition-colors cursor-pointer"
              title="Copy message"
            >
              {copied ? <CheckCheck size={12} className="text-sequoia-600" /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = loadChatHistory()
    if (stored) {
      setMessages(stored)
    }
    setHydrated(true)
  }, [])

  // Save chat history whenever messages change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveChatHistory(messages)
    }
  }, [messages, hydrated])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content) return

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: getTimestamp(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(
      () => {
        const aiMsg: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: getAIResponse(content),
          timestamp: getTimestamp(),
        }
        setMessages((prev) => [...prev, aiMsg])
        setIsTyping(false)
      },
      700 + Math.random() * 600,
    )
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function resetChat() {
    setMessages([WELCOME_MESSAGE])
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-sequoia shrink-0">
        <div className="container-brand py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Bot size={20} className="text-gold-300" />
              </div>
              <div>
                <p className="text-sequoia-300 text-xs font-medium uppercase tracking-widest">
                  Consultant Portal
                </p>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  CEA AI Assistant
                  <span className="inline-flex items-center gap-1 bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Sparkles size={10} />
                    Beta
                  </span>
                </h1>
              </div>
            </div>
            <button
              onClick={resetChat}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg glass text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Chat area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="container-brand max-w-3xl py-6 space-y-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sequoia-700 to-sequoia-900 flex items-center justify-center">
                  <TreePine size={14} className="text-white" />
                </div>
                <div className="bg-white border border-[var(--neutral-200)] rounded-2xl rounded-tl-sm px-4 py-3 shadow-[var(--shadow-sm)]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sequoia-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-sequoia-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-sequoia-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input area ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-[var(--neutral-200)] bg-white/80 backdrop-blur-sm">
          <div className="container-brand max-w-3xl py-4">
            {/* Suggested prompt chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isTyping}
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--neutral-200)] bg-white text-[var(--neutral-600)] hover:border-sequoia-400 hover:text-sequoia-700 hover:bg-sequoia-50 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about loan criteria, sales tips, product details..."
                className="input-brand flex-1"
                disabled={isTyping}
                aria-label="Chat input"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="btn-gold px-4 py-2.5 shrink-0 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={15} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>

            <p className="text-xs text-[var(--neutral-400)] mt-2 text-center">
              CEA AI provides general guidance. Always confirm deal specifics with your underwriting team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
