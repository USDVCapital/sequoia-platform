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
  "What are the requirements for a fix & flip loan?",
  "How does the Wellness Program work?",
  "Help me pitch to a CPA",
  "What's the max LTV for commercial?",
]

// ── AI Response Logic ─────────────────────────────────────────────────────────

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes('fix') && (lower.includes('flip') || lower.includes('fix & flip'))) {
    return `Great question! Here's what you need to know about **Fix & Flip loans** through Sequoia:

**Eligibility:**
- Minimum credit score: 620+
- Experience preferred but not required for first-time flippers
- Property must be non-owner-occupied residential

**Loan Terms:**
- Up to 90% LTC (Loan-to-Cost) on purchase
- Up to 100% of rehab costs covered
- Loan amounts: $75K – $5M+
- Terms: 6–24 months

**What we look for:**
- ARV (After Repair Value) should support the loan amount
- Exit strategy (sell or refinance)
- A basic scope of work / budget

**Pro tip:** Lead with the ARV when talking to clients — that's what drives the loan amount, not the purchase price. Want help walking through the submission process?`
  }

  if (lower.includes('wellness') || lower.includes('ehmp') || lower.includes('employee')) {
    return `The **Employee Health Management Program (EHMP)** is one of Sequoia's most powerful products. Here's the breakdown:

**What it is:**
EHMP is a fully-funded employer wellness benefit — meaning eligible employers pay $0 out of pocket for a robust health and wellness program for their employees.

**How it works:**
1. You identify employers with 2–500 employees
2. They complete a short discovery questionnaire
3. If eligible, the program is set up at no cost to the employer
4. You earn a recurring residual commission per enrolled employee

**Best clients to target:**
- Small businesses (5–50 employees) that can't afford traditional group insurance
- Construction companies, restaurants, retail, healthcare staff

**Your pitch:**
"I help business owners provide a meaningful health benefit to their team — at zero cost to the business." That's it. That's your opener.

Want a deeper walkthrough of the objection handling process?`
  }

  if (lower.includes('cpa') || lower.includes('accountant') || lower.includes('tax')) {
    return `CPAs are one of the **highest-value referral sources** in your network. Here's how to approach them:

**The angle:**
CPAs work with business owners every day. Their clients regularly ask about capital, growth financing, and benefits. You're not competing with them — you're adding value to their clients.

**Your opening script:**
*"Hi [Name], I work with Sequoia Enterprise Solutions. We help business owners access commercial funding and employee wellness programs. I've found that a lot of your clients probably have questions about capital that you can't always help with directly. I'd love to set up a 15-minute call to show you what we do — if it's a fit, I can be a resource you refer clients to with full confidence."*

**What to offer:**
- A referral arrangement (you pay them for qualified leads)
- A simple one-pager they can hand to clients
- A shared Google intake form for easy warm referrals

**Key insight:** Don't pitch the product first. Pitch the *partnership*. CPAs are protective of their client relationships — show them you're professional and they'll send you deal flow for years.

Want me to help you draft a cold outreach email?`
  }

  if (lower.includes('ltv') || lower.includes('loan to value') || lower.includes('commercial')) {
    return `Here are the **LTV guidelines** for our main commercial products:

| Product | Max LTV | Notes |
|---|---|---|
| Multi-Family (5+ units) | 80% | Stabilized properties |
| Mixed-Use | 75% | Depends on occupancy |
| Office / Retail | 70–75% | Market-dependent |
| Industrial / Warehouse | 70% | Strong fundamentals needed |
| Bridge Loans | 70–75% | On stabilized as-is value |
| DSCR Rental (1–4 unit) | 80% | Min 1.1 DSCR required |
| Fix & Flip | 90% LTC | Up to 100% rehab |
| Construction | 70% ARV | Draws on completion |
| SBA 7(a) | Up to 90% | With SBA guarantee |

**Important:** These are general guidelines. Every deal is reviewed on its merits — strong sponsors or cash-flowing properties can sometimes push above these benchmarks.

Do you have a specific deal scenario you'd like help underwriting?`
  }

  if (lower.includes('dscr') || lower.includes('debt service')) {
    return `**DSCR (Debt Service Coverage Ratio)** loans are one of our most popular rental property products.

**What is DSCR?**
DSCR measures whether a property generates enough income to cover the mortgage payment.

*DSCR = Annual Net Operating Income ÷ Annual Debt Service*

**Our DSCR Program:**
- Minimum DSCR: 1.1x (some programs go down to 0.75x with compensating factors)
- Property types: 1–4 unit residential investment properties
- No income verification required — the property qualifies, not the borrower
- Max LTV: 80%
- Loan amounts: $75K – $3M+
- Min credit score: 640+

**Why clients love it:**
Self-employed investors, foreign nationals, and people with complex tax returns often can't qualify conventionally. DSCR removes that barrier.

Would you like help running a quick DSCR calculation for a client deal?`
  }

  if (lower.includes('sba') || lower.includes('small business')) {
    return `Great topic! Here's a quick overview of **SBA loan options** available through Sequoia:

**SBA 7(a) — Most popular:**
- Best for: Business acquisition, working capital, equipment, real estate
- Loan amounts: Up to $5M
- Terms: 10–25 years depending on use of funds
- Down payment: As low as 10%
- Personal guarantee required

**SBA 504 — Real estate / equipment heavy use:**
- Best for: Owner-occupied commercial real estate or major equipment
- Loan structure: 50% bank / 40% SBA / 10% borrower
- Very competitive long-term fixed rates

**Ideal SBA candidates:**
- U.S.-based for-profit businesses
- 2+ years in business (preferred)
- Good credit (680+ preferred)
- Can demonstrate ability to repay

**Watch out for:** businesses in certain restricted industries (gambling, lending, multi-level marketing) are ineligible.

Want me to walk you through how to identify a strong SBA candidate in your pipeline?`
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hi Todd! Great to see you in the portal. I'm your Sequoia AI assistant — here to help you close more deals and support your consulting business.

You can ask me about:
- **Loan products** — criteria, LTV, eligibility
- **Sales strategy** — pitching, objection handling, referral partners
- **The Wellness Program** — how it works, who to target
- **Deal structuring** — how to package a file for underwriting

What can I help you with today?`
  }

  if (lower.includes('pitch') || lower.includes('script') || lower.includes('how do i sell') || lower.includes('how to sell')) {
    return `Here's a **universal opening pitch** that works across most Sequoia products:

---
*"I work with a platform called Sequoia Enterprise Solutions. We help business owners and investors access capital and business services they typically can't get through a traditional bank — things like commercial real estate loans, working capital, and even no-cost employee wellness programs.*

*I'm not here to sell you anything today. I just want to understand what you're working on and see if there's a fit. What's the biggest financial challenge your business is dealing with right now?"*

---

**Why this works:**
- You're not leading with a product
- You're positioning yourself as a resource, not a salesperson
- The open question invites them to qualify themselves

**From there, listen for:**
- "We need capital to expand" → commercial lending
- "We can't afford benefits for our team" → EHMP
- "I'm trying to grow my portfolio" → real estate loans

Want a deeper script for a specific product or client type?`
  }

  // Generic fallback
  return `I can help with that! Here's what I know about **"${input.slice(0, 40)}${input.length > 40 ? '...' : ''}"**:

This touches on an important area of the Sequoia platform. Here are a few directions I can help you go:

1. **Product criteria** — specific requirements, LTV limits, eligibility
2. **Sales approach** — how to pitch this to a prospect or referral partner
3. **Deal structuring** — how to package and submit a file
4. **Common objections** — what clients push back on and how to handle it

Try asking me something more specific — for example:
- *"What's the minimum credit score for a working capital loan?"*
- *"How do I pitch the wellness program to a restaurant owner?"*
- *"What docs do I need for a commercial real estate submission?"*

I'm here to help you close more deals.`
}

function getTimestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
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

What would you like to know?`,
  timestamp: getTimestamp(),
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

  // Render simple markdown-like formatting
  function renderContent(text: string) {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      // Bold (**text**)
      const parts = line.split(/\*\*(.*?)\*\*/g)
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )
      return (
        <span key={i}>
          {rendered}
          {i < lines.length - 1 && <br />}
        </span>
      )
    })
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
          {renderContent(message.content)}
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
