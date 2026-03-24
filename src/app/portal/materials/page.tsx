'use client'

import { useEffect, useState } from 'react'
import {
  FileText,
  Download,
  Search,
  Building2,
  Home,
  Landmark,
  Layers,
  MapPin,
  Hammer,
  Heart,
  Banknote,
  Zap,
  Shield,
  Briefcase,
  DollarSign,
  Image,
  Presentation,
  FileSpreadsheet,
  Video,
  FolderOpen,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Material {
  id: string
  title: string
  filepath: string // relative to /public/
  category: string
  subcategory?: string
  description: string
  fileType: string // pdf, image, video, doc, spreadsheet
}

// ---------------------------------------------------------------------------
// Helper: detect file type from extension
// ---------------------------------------------------------------------------

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  if (['pdf'].includes(ext)) return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'image'
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video'
  if (['pptx', 'pptm'].includes(ext)) return 'presentation'
  if (['docx', 'doc'].includes(ext)) return 'document'
  if (['xlsx', 'csv'].includes(ext)) return 'spreadsheet'
  if (['eps', 'ai', 'psd'].includes(ext)) return 'design'
  return 'file'
}

function getFileIcon(fileType: string) {
  switch (fileType) {
    case 'pdf': return <FileText size={14} />
    case 'image': return <Image size={14} />
    case 'video': return <Video size={14} />
    case 'presentation': return <Presentation size={14} />
    case 'spreadsheet': return <FileSpreadsheet size={14} />
    default: return <FileText size={14} />
  }
}

function getFileLabel(fileType: string): string {
  switch (fileType) {
    case 'pdf': return 'PDF'
    case 'image': return 'Image'
    case 'video': return 'Video'
    case 'presentation': return 'PowerPoint'
    case 'document': return 'Word Doc'
    case 'spreadsheet': return 'Spreadsheet'
    case 'design': return 'Design File'
    default: return 'File'
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Real Estate': return <Building2 size={20} />
    case 'Business Funding': return <Banknote size={20} />
    case 'EHMP / Wellness': return <Heart size={20} />
    case 'Property Claims': return <Shield size={20} />
    case 'Clean Energy': return <Zap size={20} />
    case 'Company Materials': return <Briefcase size={20} />
    case 'Compensation': return <DollarSign size={20} />
    default: return <FolderOpen size={20} />
  }
}

// ---------------------------------------------------------------------------
// Materials data — sourced from /public/Program Flyers/ and /public/Compensation Materials/
// ---------------------------------------------------------------------------

const materials: Material[] = [
  // ── Real Estate Loan Programs ─────────────────────────────
  {
    id: 're-new-construction',
    title: 'New Construction Loans',
    filepath: 'Program Flyers/01_NEW_CONSTRUCTION_LOANS.pdf',
    category: 'Real Estate',
    description: 'Ground-up construction financing with draw schedules and flexible terms.',
    fileType: 'pdf',
  },
  {
    id: 're-multi-family',
    title: 'Multi-Family Loan Program',
    filepath: 'Program Flyers/02_MULTI-FAMILY_LOAN_PROGRAM.pdf',
    category: 'Real Estate',
    description: 'Financing for 5+ unit apartment buildings including bridge, stabilized, and value-add.',
    fileType: 'pdf',
  },
  {
    id: 're-bridge-loan',
    title: 'Bridge Loan Program',
    filepath: 'Program Flyers/03_BRIDGE_LOAN_PROGRAM.pdf',
    category: 'Real Estate',
    description: 'Short-term bridge financing for time-sensitive acquisitions and repositioning.',
    fileType: 'pdf',
  },
  {
    id: 're-fix-flip-3',
    title: 'Fix & Flip — 3 Options',
    filepath: 'Program Flyers/04_FIX_and_FLIP_LOAN_3 OPTIONS_20250702.pdf',
    category: 'Real Estate',
    description: 'Comprehensive comparison of three fix-and-flip loan structures.',
    fileType: 'pdf',
  },
  {
    id: 're-fix-flip',
    title: 'Fix & Flip Loan Program',
    filepath: 'Program Flyers/04_FIX_and_FLIP_LOAN_PROGRAM.pdf',
    category: 'Real Estate',
    description: 'Standard fix-and-flip financing: up to 90% of purchase, 100% of rehab.',
    fileType: 'pdf',
  },
  {
    id: 're-1-4-unit',
    title: '1-4 Unit Investment Properties',
    filepath: 'Program Flyers/07_1-4_UNIT_INVESTMENT_PROPERTIES.pdf',
    category: 'Real Estate',
    description: 'DSCR and investor loans for 1-4 unit rental properties. No income verification.',
    fileType: 'pdf',
  },
  {
    id: 're-commercial',
    title: 'Commercial Properties',
    filepath: 'Program Flyers/10_COMMERCIAL_PROPERTIES.pdf',
    category: 'Real Estate',
    description: 'Office, retail, industrial, and mixed-use commercial property financing.',
    fileType: 'pdf',
  },
  {
    id: 're-land',
    title: 'Land Loan',
    filepath: 'Program Flyers/13_LAND_LOAN.pdf',
    category: 'Real Estate',
    description: 'Raw land, entitled land, and land with approved plans. Up to 65% LTV.',
    fileType: 'pdf',
  },
  {
    id: 're-mixed-use',
    title: 'Mixed-Use Properties',
    filepath: 'Program Flyers/14_MIXED-USED_PROPERTIES_LOAN.pdf',
    category: 'Real Estate',
    description: 'Financing for properties combining residential and commercial uses.',
    fileType: 'pdf',
  },

  // ── Business Funding ──────────────────────────────────────
  {
    id: 'biz-credit-repair',
    title: 'Credit Repair',
    filepath: 'Program Flyers/02. Business Funding/05_CREDIT_REPAIR.pdf',
    category: 'Business Funding',
    description: 'Help clients improve credit scores to qualify for better funding terms.',
    fileType: 'pdf',
  },
  {
    id: 'biz-cost-seg',
    title: 'Cost Segregation',
    filepath: 'Program Flyers/02. Business Funding/06_COST_SEGREGATION.pdf',
    category: 'Business Funding',
    description: 'Tax strategy for commercial property owners to accelerate depreciation deductions.',
    fileType: 'pdf',
  },
  {
    id: 'biz-ar-funding',
    title: 'Accounts Receivable (AR) Funding',
    filepath: 'Program Flyers/02. Business Funding/08_ACCOUNTS_RECEIVABLE_(AR)_FUNDING.pdf',
    category: 'Business Funding',
    description: 'Turn outstanding invoices into immediate working capital.',
    fileType: 'pdf',
  },
  {
    id: 'biz-acquisition',
    title: 'Business Acquisition Loan',
    filepath: 'Program Flyers/02. Business Funding/09_BUSINESS_ACQUISITION_LOAN.pdf',
    category: 'Business Funding',
    description: 'Financing for purchasing or acquiring existing businesses.',
    fileType: 'pdf',
  },
  {
    id: 'biz-equipment',
    title: 'Equipment Loan',
    filepath: 'Program Flyers/02. Business Funding/11_EQUIPMENT_LOAN.pdf',
    category: 'Business Funding',
    description: 'Finance heavy equipment, vehicles, and machinery purchases.',
    fileType: 'pdf',
  },
  {
    id: 'biz-equity-share',
    title: 'Equity Share',
    filepath: 'Program Flyers/02. Business Funding/12_EQUITY_SHARE.pdf',
    category: 'Business Funding',
    description: 'Shared equity financing arrangements for business growth.',
    fileType: 'pdf',
  },
  {
    id: 'biz-gap-funding',
    title: 'Gap Funding',
    filepath: 'Program Flyers/02. Business Funding/15_GAP_FUNDING.pdf',
    category: 'Business Funding',
    description: 'Bridge the gap between primary financing and total project costs.',
    fileType: 'pdf',
  },
  {
    id: 'biz-working-capital',
    title: 'Working Capital',
    filepath: 'Program Flyers/02. Business Funding/17_WORKING_CAPITAL.pdf',
    category: 'Business Funding',
    description: 'Fast funding for day-to-day operational cash flow needs.',
    fileType: 'pdf',
  },
  {
    id: 'biz-retirement-plan',
    title: 'Retirement Plan Business Funding',
    filepath: 'Program Flyers/02. Business Funding/18_RETIREMENT_PLAN_BUSINESS_FUNDING.pdf',
    category: 'Business Funding',
    description: 'Use retirement funds (ROBS) to finance your business tax-free.',
    fileType: 'pdf',
  },

  // ── EHMP / Wellness ───────────────────────────────────────
  {
    id: 'ehmp-intro-en-1',
    title: 'Workplace Wellness Flyer (English) — Part 1',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Intro Flyer/English/REVISED 1.7.25 Workplace Wellness Flyers-EBS 2025_Part1.pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Intro Flyers',
    description: 'Client-facing wellness program overview flyer (English).',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-intro-en-2',
    title: 'Workplace Wellness Flyer (English) — Part 2',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Intro Flyer/English/REVISED 1.7.25 Workplace Wellness Flyers-EBS 2025_Part2.pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Intro Flyers',
    description: 'Benefits breakdown and employer savings details.',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-intro-en-3',
    title: 'Workplace Wellness Flyer (English) — Part 3',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Intro Flyer/English/REVISED 1.7.25 Workplace Wellness Flyers-EBS 2025_Part3.pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Intro Flyers',
    description: 'Enrollment process and next steps for employers.',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-intro-spanish',
    title: 'Workplace Wellness Flyer (Spanish)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Intro Flyer/Spanish/Combined Workplace Wellness Flyers 2025-SPANISH Fillable.pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Intro Flyers',
    description: 'Complete wellness program flyer in Spanish — fillable PDF.',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-calassian',
    title: 'Sequoia EHMP — CalASsian Flyer',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Intro Flyer/Sequoia EHMP - CalASsian 20260122.jpg',
    category: 'EHMP / Wellness',
    subcategory: 'Intro Flyers',
    description: 'CalASsian community event wellness flyer.',
    fileType: 'image',
  },
  {
    id: 'ehmp-commission',
    title: 'EHMP Commission Structure (Updated)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Commission/EHMP Commission Updated.jpeg',
    category: 'EHMP / Wellness',
    subcategory: 'Commission',
    description: 'PEPM commission tiers: $20 (5-199), $22 (200-499), $24 (500+) per employee per month.',
    fileType: 'image',
  },
  {
    id: 'ehmp-roadmap-flyer',
    title: 'EHMP Enrollment Roadmap',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Enrollment Roadmap/EHMP Roadmap-Flyer 20251111.pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Enrollment',
    description: 'Step-by-step enrollment roadmap for new wellness clients.',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-roadmap-ppt',
    title: 'EHMP Enrollment Roadmap (Presentation)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Enrollment Roadmap/EHMP Roadmap-PPT 20251110.pptx',
    category: 'EHMP / Wellness',
    subcategory: 'Enrollment',
    description: 'PowerPoint version of the enrollment roadmap for presentations.',
    fileType: 'presentation',
  },
  {
    id: 'ehmp-elevator-pitch',
    title: 'EHMP Elevator Pitch',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Elevator Pitch/EHMP Elevator Pitch 20250910.docx',
    category: 'EHMP / Wellness',
    subcategory: 'Sales Tools',
    description: 'Quick pitch script for introducing the wellness program to employers.',
    fileType: 'document',
  },
  {
    id: 'ehmp-gold-scripts',
    title: 'SIMERP Gold Scripts',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Elevator Pitch/SIMERP Gold Scripts_ Sequoia_081224.pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Sales Tools',
    description: 'Proven call scripts for EHMP/SIMERP outreach.',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-email-template',
    title: 'EHMP Email Template',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Email Template/EHMP Overview - Email Template 20260119.docx',
    category: 'EHMP / Wellness',
    subcategory: 'Sales Tools',
    description: 'Ready-to-send email template introducing the EHMP program to employers.',
    fileType: 'document',
  },
  {
    id: 'ehmp-presentation-en',
    title: 'EHMP Presentation (English)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Presentation/REVISED 1.7.25 Presentation 102524.pptx',
    category: 'EHMP / Wellness',
    subcategory: 'Presentations',
    description: 'Full EHMP program presentation deck for employer meetings.',
    fileType: 'presentation',
  },
  {
    id: 'ehmp-video-en',
    title: 'SIMERP Video Intro (English)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Video Intro/SIMERP Intro-ENG.mp4',
    category: 'EHMP / Wellness',
    subcategory: 'Videos',
    description: 'Short video introducing the SIMERP wellness program.',
    fileType: 'video',
  },
  {
    id: 'ehmp-video-wellness',
    title: 'The Wellness Program (Video)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Video Intro/The Wellness Program.mp4',
    category: 'EHMP / Wellness',
    subcategory: 'Videos',
    description: 'Overview video explaining the wellness program benefits.',
    fileType: 'video',
  },
  {
    id: 'ehmp-video-spanish',
    title: 'SIMERP Video Intro (Spanish)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Video Intro/Introducción al Programa SIMERP.mp4',
    category: 'EHMP / Wellness',
    subcategory: 'Videos',
    description: 'Programa de bienestar SIMERP — video introductorio en español.',
    fileType: 'video',
  },
  {
    id: 'ehmp-census',
    title: 'EHMP Census Template',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Census/census_template_2025-11-25.csv',
    category: 'EHMP / Wellness',
    subcategory: 'Forms',
    description: 'Employee census template for wellness enrollment processing.',
    fileType: 'spreadsheet',
  },
  {
    id: 'ehmp-contest-en',
    title: 'EHMP 500 Contest Flyer (English)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Contest/EHMP 500-ENG 20260102-2.png',
    category: 'EHMP / Wellness',
    subcategory: 'Contests',
    description: 'Enroll 500 employees contest promotion flyer.',
    fileType: 'image',
  },
  {
    id: 'ehmp-sea-launch',
    title: 'Sequoia EHMP AI Assistant Launch Flyer',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Sequoia EHMP AI Assistance/SEA Launch-Flyer 20251102.png',
    category: 'EHMP / Wellness',
    subcategory: 'AI Assistant',
    description: 'Announcing the Sequoia EHMP AI assistant for consultants.',
    fileType: 'image',
  },
  {
    id: 'ehmp-section125',
    title: 'Section 125 Plan Documents',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/Section 125 Plan Docs (2024).pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Legal',
    description: 'Section 125 cafeteria plan documentation for employer compliance.',
    fileType: 'pdf',
  },
  {
    id: 'ehmp-big-beautiful-bill',
    title: 'One Big Beautiful Bill Act (Full Text)',
    filepath: 'Program Flyers/03. EHMP (Workplace Wellness)/One Big Beautiful Bill Act (Full Text).pdf',
    category: 'EHMP / Wellness',
    subcategory: 'Legal',
    description: 'Full text of the One Big Beautiful Bill Act relevant to wellness programs.',
    fileType: 'pdf',
  },

  // ── Property Claims ───────────────────────────────────────
  {
    id: 'prop-inspection-en',
    title: 'Free Property Inspection Flyer (English)',
    filepath: 'Program Flyers/04. Property Claims/Nexus Claim-Free Property Inspection 20260203-Eng.jpg',
    category: 'Property Claims',
    description: 'Nexus Claim free property inspection promotion for clients.',
    fileType: 'image',
  },
  {
    id: 'prop-inspection-cn',
    title: 'Free Property Inspection Flyer (Chinese)',
    filepath: 'Program Flyers/04. Property Claims/Nexus Claim-Free Property Inspection 20260203-Chinese.jpg',
    category: 'Property Claims',
    description: 'Nexus Claim free property inspection promotion (Chinese).',
    fileType: 'image',
  },
  {
    id: 'prop-commission',
    title: 'Property Restoration Commission Structure',
    filepath: 'Program Flyers/04. Property Claims/Property Restoration & Claim Commission Structure 20260204.jpg',
    category: 'Property Claims',
    description: 'Agent commission: 8%. Override levels: 1%, 0.75%, 0.5%, 0.5%, 0.25%, 0.25%.',
    fileType: 'image',
  },
  {
    id: 'prop-presentation',
    title: 'Property Restoration & Claims Presentation',
    filepath: 'Program Flyers/04. Property Claims/Property Restoration & Insurance Claims Presentation-20260205.pptx',
    category: 'Property Claims',
    description: 'Full presentation deck for the property restoration and insurance claims program.',
    fileType: 'presentation',
  },

  // ── Clean Energy ──────────────────────────────────────────
  {
    id: 'solar-intro',
    title: 'Commercial Solar Introduction (Video)',
    filepath: 'Program Flyers/05. Solar & EV/Commercial Solar/Sunlife Solar-Intro.mp4',
    category: 'Clean Energy',
    description: 'Introduction video for the Sunlife commercial solar program.',
    fileType: 'video',
  },
  {
    id: 'ev-revenue-share',
    title: 'EV Charging Revenue Share',
    filepath: 'Program Flyers/05. Solar & EV/EV Charging/EVBar-Revenue Share 021425.pdf',
    category: 'Clean Energy',
    description: 'EVBar EV charging station revenue share program details.',
    fileType: 'pdf',
  },

  // ── Company Materials ─────────────────────────────────────
  {
    id: 'co-presentation-en',
    title: 'SES Company Presentation (English)',
    filepath: 'Program Flyers/06. Company Materials/01. Company Presentation/SES Presentation -Updated 032825.pptx',
    category: 'Company Materials',
    subcategory: 'Presentations',
    description: 'Full Sequoia Enterprise Solutions company presentation deck.',
    fileType: 'presentation',
  },
  {
    id: 'co-presentation-cn',
    title: 'SES Company Presentation (Chinese)',
    filepath: 'Program Flyers/06. Company Materials/01. Company Presentation/SES Presentation-Updated 032825-中文.pptx',
    category: 'Company Materials',
    subcategory: 'Presentations',
    description: 'Sequoia Enterprise Solutions company presentation (Chinese).',
    fileType: 'presentation',
  },
  {
    id: 'co-comp-plan',
    title: 'Compensation Plan 7.0',
    filepath: 'Program Flyers/06. Company Materials/02. Compensation Plan/Sequoia Compensation Plan 7.0.pdf',
    category: 'Company Materials',
    subcategory: 'Compensation',
    description: 'Official Sequoia compensation plan document.',
    fileType: 'pdf',
  },
  {
    id: 'co-successful-cases-ppt',
    title: 'Successful Cases Presentation',
    filepath: 'Program Flyers/06. Company Materials/03. Successful Cases/Sequoia Successful Cases 043025.pptx',
    category: 'Company Materials',
    subcategory: 'Success Stories',
    description: 'PowerPoint deck of Sequoia successful funded deals and case studies.',
    fileType: 'presentation',
  },
  {
    id: 'co-one-pager-en',
    title: 'Company One-Pager (English, Fillable)',
    filepath: 'Program Flyers/06. Company Materials/04. One-Pager/English/FILLABLE ENG - SES Company One Pager 2025 Revised 4.19.25.pdf',
    category: 'Company Materials',
    subcategory: 'One-Pagers',
    description: 'Fillable company one-page overview — add your name and contact info.',
    fileType: 'pdf',
  },
  {
    id: 'co-one-pager-cn',
    title: 'Company One-Pager (Chinese, Fillable)',
    filepath: 'Program Flyers/06. Company Materials/04. One-Pager/Chinese/(Fillable Chinese)SES Company One Pager 2025 4.19.25.pdf',
    category: 'Company Materials',
    subcategory: 'One-Pagers',
    description: 'Fillable company one-pager in Chinese.',
    fileType: 'pdf',
  },
  {
    id: 'co-rollup-banner',
    title: 'Roll-up Banner (General)',
    filepath: 'Program Flyers/06. Company Materials/05. Roll-up Banner (General)/SeqES Roll Up Banner 4.15.25.pdf',
    category: 'Company Materials',
    subcategory: 'Print Materials',
    description: 'Print-ready roll-up banner for events and trade shows.',
    fileType: 'pdf',
  },
  {
    id: 'co-rollup-recruiting',
    title: 'Roll-up Banner (Recruiting)',
    filepath: 'Program Flyers/06. Company Materials/06. Roll-up Banner (Recruiting)/SeqES Roll Up Banner Recruiting 041525.pdf',
    category: 'Company Materials',
    subcategory: 'Print Materials',
    description: 'Recruiting-focused roll-up banner for agent recruitment events.',
    fileType: 'pdf',
  },
  {
    id: 'co-brochure',
    title: 'Z-Fold Brochure (Agent Recruiting)',
    filepath: 'Program Flyers/06. Company Materials/07. Z-Fold Brochure (Agent Recruiting)/Z-Fold Brochure.pdf',
    category: 'Company Materials',
    subcategory: 'Print Materials',
    description: 'Tri-fold brochure for recruiting new loan consultants.',
    fileType: 'pdf',
  },
  {
    id: 'co-table-banner',
    title: 'Tabletop Banner (Recruiting)',
    filepath: 'Program Flyers/06. Company Materials/08. Tabletop Banner (Recruiting)/Table Banner.pdf',
    category: 'Company Materials',
    subcategory: 'Print Materials',
    description: 'Tabletop banner for recruitment events and expos.',
    fileType: 'pdf',
  },
  {
    id: 'co-business-card',
    title: 'Business Card Template',
    filepath: 'Program Flyers/06. Company Materials/09. Business Card Template/Business Card Template 010725.pdf',
    category: 'Company Materials',
    subcategory: 'Print Materials',
    description: 'Editable business card template — two style options included.',
    fileType: 'pdf',
  },
  {
    id: 'co-enrollment-form',
    title: 'Sequoia Enrollment Form',
    filepath: 'Program Flyers/06. Company Materials/Sequoia_Enrollment_Form.docx',
    category: 'Company Materials',
    subcategory: 'Forms',
    description: 'New consultant enrollment form.',
    fileType: 'document',
  },
  {
    id: 'co-zoom-bg',
    title: 'Zoom Background 2026',
    filepath: 'Program Flyers/06. Company Materials/Zoom Background 2026.png',
    category: 'Company Materials',
    subcategory: 'Digital Assets',
    description: 'Branded Sequoia Zoom virtual background.',
    fileType: 'image',
  },
  {
    id: 'co-training-fix-flip',
    title: 'Fix and Flip Training',
    filepath: 'Program Flyers/06. Company Materials/11. Training/Fix and Flip_20250604.pptm',
    category: 'Company Materials',
    subcategory: 'Training',
    description: 'Training presentation for fix-and-flip loan programs.',
    fileType: 'presentation',
  },
  {
    id: 'co-training-sba',
    title: 'SBA Loans Explained',
    filepath: 'Program Flyers/06. Company Materials/11. Training/SBA Loans Explained_Updated 20260121.pptx',
    category: 'Company Materials',
    subcategory: 'Training',
    description: 'Comprehensive training on SBA loan types and qualification.',
    fileType: 'presentation',
  },
  {
    id: 'co-training-checklist',
    title: 'Real Estate Loan Welcome Checklist',
    filepath: 'Program Flyers/06. Company Materials/11. Training/Real Estate Loan - Welcome Checklist.docx',
    category: 'Company Materials',
    subcategory: 'Training',
    description: 'Onboarding checklist for new real estate loan consultants.',
    fileType: 'document',
  },
  {
    id: 'co-big-beautiful-bill',
    title: 'Big Beautiful Bill Summary',
    filepath: 'Program Flyers/06. Company Materials/big beautiful bill.pdf',
    category: 'Company Materials',
    subcategory: 'Legal',
    description: 'Summary of the Big Beautiful Bill and its impact on Sequoia programs.',
    fileType: 'pdf',
  },

  // ── EHMP Calculator ───────────────────────────────────────
  {
    id: 'ehmp-calculator',
    title: 'SIMERP Income Calculator',
    filepath: 'Program Flyers/SIMERP Calculator 043024.xlsx',
    category: 'EHMP / Wellness',
    subcategory: 'Tools',
    description: 'Excel calculator to project EHMP/SIMERP income based on enrollment targets.',
    fileType: 'spreadsheet',
  },

  // ── Compensation Materials ────────────────────────────────
  {
    id: 'comp-spm-75',
    title: 'SPM Compensation Plan 7.5 (Full Deck)',
    filepath: 'Compensation Materials/SPM 7.5.pdf',
    category: 'Compensation',
    description: 'Complete compensation plan: 23% referral, 46% personal, 6-level revenue sharing, bonus pool, wellness PEPM.',
    fileType: 'pdf',
  },
  {
    id: 'comp-ehmp',
    title: 'EHMP Compensation Overview',
    filepath: 'Compensation Materials/EHMP Compensation.jpeg',
    category: 'Compensation',
    description: '$20-$24 PEPM tiered by enrollment count. 3-level team revenue share. Paid in perpetuity.',
    fileType: 'image',
  },
  {
    id: 'comp-property',
    title: 'Property Restoration Commission',
    filepath: 'Compensation Materials/Property Restoration Compensation.jpeg',
    category: 'Compensation',
    description: 'Agent commission: 8%. Team overrides: 1%, 0.75%, 0.5%, 0.5%, 0.25%, 0.25% across 6 levels.',
    fileType: 'image',
  },
]

const categories = ['All', ...Array.from(new Set(materials.map(m => m.category)))]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MaterialsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories))

  useEffect(() => {
    document.title = 'Marketing Materials — Sequoia Consultant Portal'
  }, [])

  const filtered = materials.filter(m => {
    const matchesSearch = search === '' ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      (m.subcategory?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Group by category for display
  const grouped = filtered.reduce<Record<string, Material[]>>((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {})

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const categoryOrder = ['Compensation', 'Real Estate', 'Business Funding', 'EHMP / Wellness', 'Property Claims', 'Clean Energy', 'Company Materials']

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Marketing Materials
        </h2>
        <p className="mt-1 text-neutral-500 text-sm">
          Download program flyers, compensation plans, presentations, and more. All materials are branded and ready to use.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-gold-600" />
          <span className="text-sm font-semibold text-neutral-900">{materials.length} Materials</span>
        </div>
        <div className="text-sm text-neutral-500">
          {filtered.length === materials.length ? 'Showing all' : `${filtered.length} matching`}
        </div>
        <div className="flex items-center gap-3 ml-auto text-xs text-neutral-400">
          <span className="flex items-center gap-1"><FileText size={12} /> PDF</span>
          <span className="flex items-center gap-1"><Image size={12} /> Image</span>
          <span className="flex items-center gap-1"><Video size={12} /> Video</span>
          <span className="flex items-center gap-1"><Presentation size={12} /> Slides</span>
        </div>
      </div>

      {/* Grouped material list */}
      <div className="space-y-4">
        {categoryOrder.filter(cat => grouped[cat]).map(category => (
          <div key={category} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-3 w-full px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-100 text-gold-700">
                {getCategoryIcon(category)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-900 text-sm">{category}</h3>
                <p className="text-xs text-neutral-500">{grouped[category].length} items</p>
              </div>
              {expandedCategories.has(category) ? <ChevronDown size={18} className="text-neutral-400" /> : <ChevronRight size={18} className="text-neutral-400" />}
            </button>

            {/* Material items */}
            {expandedCategories.has(category) && (
              <div className="border-t border-neutral-100">
                {grouped[category].map((mat, idx) => (
                  <div
                    key={mat.id}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors ${
                      idx > 0 ? 'border-t border-neutral-100' : ''
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
                      {getFileIcon(mat.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-neutral-900 text-sm truncate">{mat.title}</span>
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                          {getFileLabel(mat.fileType)}
                        </span>
                        {mat.subcategory && (
                          <span className="inline-block text-[10px] font-medium text-gold-700 bg-gold-50 px-1.5 py-0.5 rounded">
                            {mat.subcategory}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{mat.description}</p>
                    </div>
                    <a
                      href={`/${mat.filepath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FileText size={40} className="mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 text-sm">No materials match your search.</p>
        </div>
      )}

      {/* Tip */}
      <div className="rounded-xl border border-gold-200 bg-gold-50 p-5">
        <p className="text-sm font-semibold text-gold-800">
          Tip: Share these materials directly with your clients
        </p>
        <p className="mt-1 text-xs text-gold-700 leading-relaxed">
          Each flyer and presentation is designed to be client-ready. Download, email, or print them for meetings.
          For custom materials with your name and contact info, reach out to support@seqsolution.com.
        </p>
      </div>
    </div>
  )
}
