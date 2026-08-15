import { AssessmentQuestion } from '../managerAssessment';

export const EN_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    dimension: 'reality',
    title: 'Discrepancy in Production Yield',
    scenario: 'The monthly dashboard shows packaging efficiency at 92%, yet the finished goods warehouse reports stockouts for critical orders.',
    options: [
      { id: 'a', score: 3, text: 'Trust the digital report and demand an explanation from warehouse managers regarding lost cargo.' },
      { id: 'b', score: 2, text: 'Ask the production manager to recalculate and reconcile their yield tables.' },
      { id: 'c', score: 0, text: 'Personally walk the shop floor and warehouse, directly observing unlogged micro-stoppages and hidden scrap.' },
      { id: 'd', score: 1, text: 'Schedule a joint cross-functional alignment session between production, logistics, and sales.' }
    ]
  },
  {
    id: 2,
    dimension: 'reality',
    title: 'Critical Client Quality Escalation',
    scenario: 'A premier account sends a direct complaint stating that the quality of the latest shipment has plummeted.',
    options: [
      { id: 'a', score: 2, text: 'Immediately reprimand the quality assurance team.' },
      { id: 'b', score: 0, text: 'Inspect shipment batch samples, QC audit logs, and delivery records, then speak directly with the buyer.' },
      { id: 'c', score: 3, text: 'Instruct sales to issue an immediate rebate on the next PO to pacify the client.' },
      { id: 'd', score: 1, text: 'Halt production on the line until an informal review is completed.' }
    ]
  },
  {
    id: 3,
    dimension: 'reality',
    title: 'Discounted Raw Material Lot',
    scenario: 'A long-time supplier offers a raw material batch at a 15% discount, but lab quality sign-off is still pending.',
    options: [
      { id: 'a', score: 3, text: 'Authorize full bulk purchasing immediately to capture urgent cash savings.' },
      { id: 'b', score: 2, text: 'Allow purchase of limited tonnage without line trial under purchasing head responsibility.' },
      { id: 'c', score: 0, text: 'Withhold bulk orders until pilot testing and scrap yield impacts are conclusively verified.' },
      { id: 'd', score: 1, text: 'Execute the purchase contingent upon a formal written guarantee from the vendor.' }
    ]
  },
  {
    id: 4,
    dimension: 'execution',
    title: 'Stalled Executive Resolutions',
    scenario: 'Five key initiatives were ratified in the board meeting to curtail waste, but two weeks later zero progress has been made.',
    options: [
      { id: 'a', score: 3, text: 'Rebuke managers angrily at the next meeting and issue tighter emergency ultimatums.' },
      { id: 'b', score: 0, text: 'Assign a single empowered owner, firm delivery milestones, numeric output KPIs, and a weekly review cadence.' },
      { id: 'c', score: 2, text: 'Take personal direct command of all five tasks to force velocity.' },
      { id: 'd', score: 1, text: 'Delegate follow-up to an external consultant or an ad-hoc special committee.' }
    ]
  },
  {
    id: 5,
    dimension: 'execution',
    title: 'Plant Expansion Schedule Slippage',
    scenario: 'A new manufacturing line commissioning is 3 months behind schedule with a 20% budget overrun.',
    options: [
      { id: 'a', score: 3, text: 'Terminate the project contractor and change the implementation team.' },
      { id: 'b', score: 2, text: 'Extend deadlines indefinitely to relieve operational stress.' },
      { id: 'c', score: 0, text: 'Appoint an accountable lead, audit critical path bottlenecks, re-baseline milestones, and enforce weekly checkpoints.' },
      { id: 'd', score: 1, text: 'Mandate daily standup meetings requiring verbal progress reports from all parties.' }
    ]
  },
  {
    id: 6,
    dimension: 'execution',
    title: 'Sudden Operational Crisis',
    scenario: 'A sudden equipment breakdown or hazardous material leak threatens production, client safety, or brand reputation.',
    options: [
      { id: 'a', score: 0, text: 'First contain the physical hazard; isolate verified facts; designate single point of contact, actions, and post-mortem review.' },
      { id: 'b', score: 3, text: 'Take all decisions unilaterally and issue rapid executive emergency decrees.' },
      { id: 'c', score: 2, text: 'Postpone major containment decisions until 100% of theoretical forensic data is gathered.' },
      { id: 'd', score: 1, text: 'Execute a temporary makeshift patch and defer systematic investigation.' }
    ]
  },
  {
    id: 7,
    dimension: 'systems',
    title: 'Local Unit Output Surge',
    scenario: 'An upstream stamping station boosts hourly output by 30%, but work-in-progress inventory piles up and delays downstream assembly.',
    options: [
      { id: 'a', score: 3, text: 'Praise the stamping team publicly and urge downstream assembly to speed up.' },
      { id: 'b', score: 2, text: 'Throttle stamping station speed back to historical levels.' },
      { id: 'c', score: 0, text: 'Analyze full value-stream flow, identify the true system constraint, and benchmark against end-to-end throughput.' },
      { id: 'd', score: 1, text: 'Authorize temporary overtime downstream while investigating the imbalance.' }
    ]
  },
  {
    id: 8,
    dimension: 'systems',
    title: 'Maintenance Budget Cut Pressure',
    scenario: 'Due to short-term liquidity pressure, an executive proposal suggests slashing preventive maintenance by 30%.',
    options: [
      { id: 'a', score: 3, text: 'Halt all non-emergency maintenance immediately until cash flow recovers.' },
      { id: 'b', score: 2, text: 'Instruct the plant maintenance manager to cut 10% across the board arbitrarily.' },
      { id: 'c', score: 0, text: 'Evaluate failure probability, downtime cost, safety compliance, maintenance debt, and total impact on production.' },
      { id: 'd', score: 1, text: 'Defer low-risk servicing items with monitored thresholds and a fixed review date.' }
    ]
  },
  {
    id: 9,
    dimension: 'systems',
    title: 'Credit Sales to Legacy Partner',
    scenario: 'A long-time customer places a massive new order. Their ledger shows high outstanding receivables past maturity.',
    options: [
      { id: 'a', score: 2, text: 'Approve the sale based strictly on recent transaction volume.' },
      { id: 'b', score: 3, text: 'Rely on personal trust and long-standing personal relationship.' },
      { id: 'c', score: 0, text: 'Audit current ledger, open liabilities, payment cadence, gross margin, and corporate risk tolerance.' },
      { id: 'd', score: 1, text: 'Grant a reduced credit ceiling and tie subsequent releases to first installment settlement.' }
    ]
  },
  {
    id: 10,
    dimension: 'memory',
    title: 'Key Person Absence',
    scenario: 'A seasoned supervisor is suddenly hospitalized for two weeks with no designated backup in place.',
    options: [
      { id: 'a', score: 3, text: 'Call them continuously on their personal phone to keep operations running.' },
      { id: 'b', score: 2, text: 'Disperse daily tasks among random workers based on gut judgment.' },
      { id: 'c', score: 0, text: 'Rely on documented Standard Operating Procedures (SOPs), checklists, access privileges, and cross-trained deputies.' },
      { id: 'd', score: 1, text: 'Appoint an interim lead and immediately begin documenting undocumented tribal knowledge.' }
    ]
  },
  {
    id: 11,
    dimension: 'memory',
    title: 'Recurring Batch Defect',
    scenario: 'A recurring calibration error in production resurfaces for the third time this year despite repeat training.',
    options: [
      { id: 'a', score: 3, text: 'Formally penalize the operator to send a strong disciplinary signal.' },
      { id: 'b', score: 2, text: 'Schedule the exact same training classroom session once more.' },
      { id: 'c', score: 0, text: 'Audit the underlying process, tooling, work instructions, authority boundaries, incentives, and error-proofing controls.' },
      { id: 'd', score: 1, text: 'Add an interim manual inspection gate before and after the station while investigating.' }
    ]
  },
  {
    id: 12,
    dimension: 'memory',
    title: 'Breakthrough Solution by Engineer',
    scenario: 'A frontline technician innovates a method that reduces machine setup changeover time from 45 to 12 minutes.',
    options: [
      { id: 'a', score: 2, text: 'Thank them verbally and consider the matter closed.' },
      { id: 'b', score: 1, text: 'Issue an informative company-wide circular announcement.' },
      { id: 'c', score: 3, text: 'Leave execution exclusively to that individual since they know it best.' },
      { id: 'd', score: 0, text: 'Document, test, standardize, and train all shift crews, establishing metrics to institutionalize the gains.' }
    ]
  },
  {
    id: 13,
    dimension: 'culture',
    title: 'Frontline Innovation Suggestion',
    scenario: 'A frontline assembly operator proposes a sheet-metal shearing modification that could eliminate 10% of raw scrap.',
    options: [
      { id: 'a', score: 0, text: 'Evaluate the technical premise, run a small pilot trial, report outcomes transparently, and reward economic value created.' },
      { id: 'b', score: 2, text: 'Direct them to file the idea in the digital employee suggestion portal.' },
      { id: 'c', score: 1, text: 'Rely on managerial intuition to assess whether the idea is worth pursuing.' },
      { id: 'd', score: 3, text: 'Remind shop-floor workers to focus exclusively on their assigned mechanical tasks.' }
    ]
  },
  {
    id: 14,
    dimension: 'culture',
    title: 'Honest Error Reporting',
    scenario: 'An operator self-reports an accidental mixing ratio error immediately before shipping, preventing massive customer claims.',
    options: [
      { id: 'a', score: 3, text: 'Discipline the operator strictly to reinforce a zero-tolerance culture.' },
      { id: 'b', score: 0, text: 'Commend the proactive report, contain the bad lot, and distinguish honest mistakes from negligence or willful misconduct.' },
      { id: 'c', score: 2, text: 'Conceal the incident internally so the employee avoids disciplinary scrutiny.' },
      { id: 'd', score: 1, text: 'Give a verbal warning and consider the incident closed.' }
    ]
  },
  {
    id: 15,
    dimension: 'culture',
    title: 'Sales Commissions vs. Bad Debt',
    scenario: 'Sales commissions drive gross invoiced bookings up, but overdue receivables, returned goods, and defaulted notes spike sharply.',
    options: [
      { id: 'a', score: 3, text: 'Raise top-line sales quotas further to compensate for liquidity leakages.' },
      { id: 'b', score: 2, text: 'Maintain the existing commission scheme while issuing stern warnings to sales reps.' },
      { id: 'c', score: 0, text: 'Restructure incentive comp around collected cash margin, low return rates, customer health, and long-term profitability.' },
      { id: 'd', score: 1, text: 'Mandate CEO signature on all borderline credit terms.' }
    ]
  },
  {
    id: 16,
    dimension: 'data',
    title: 'High Output vs. Surging Complaints',
    scenario: 'The dashboard highlights a 20% surge in monthly tonnage, yet scrap volume and customer warranty claims hit an all-time high.',
    options: [
      { id: 'a', score: 3, text: 'Celebrate the volume milestone and handle warranty claims as isolated customer service tickets.' },
      { id: 'b', score: 2, text: 'Blame the QA department for not catching defects generated by fast-paced lines.' },
      { id: 'c', score: 0, text: 'Audit data integrity, tracking first-pass yield, defect costs, gross margin, on-time delivery, and customer disputes in unison.' },
      { id: 'd', score: 1, text: 'Cap production volume temporarily until the variance is clarified.' }
    ]
  },
  {
    id: 17,
    dimension: 'data',
    title: 'AI / Algorithmic Recommendation',
    scenario: 'An automated credit-scoring model recommends cutting off credit to an influential, long-standing distributor.',
    options: [
      { id: 'a', score: 3, text: 'Blindly execute the system recommendation since AI processes more data.' },
      { id: 'b', score: 2, text: 'Ignore the algorithm entirely; manager gut-feel trumps software models.' },
      { id: 'c', score: 0, text: 'Treat the output as supporting evidence, evaluating the decision against governance rules, approval thresholds, exceptions, and human accountability.' },
      { id: 'd', score: 1, text: 'Hand the file to a senior manager for manual sign-off and log the outcome.' }
    ]
  },
  {
    id: 18,
    dimension: 'data',
    title: 'Conflicting Departmental Metrics',
    scenario: 'Finance, Sales, and Warehousing present three conflicting inventory valuation figures.',
    options: [
      { id: 'a', score: 3, text: 'Accept the figure provided by the most senior department executive.' },
      { id: 'b', score: 2, text: 'Take the mathematical average of the three figures as a working baseline.' },
      { id: 'c', score: 0, text: 'Clarify metric definitions, the single source of truth (SSOT), timestamp capture, data ownership, and variance root causes.' },
      { id: 'd', score: 1, text: 'Use a conservative documented estimate for immediate decisions and enforce a deadline for data reconciliation.' }
    ]
  },
  {
    id: 19,
    dimension: 'operations',
    title: 'High Revenue, Shrinking Profit',
    scenario: 'Gross revenue and shipment volumes are up 25%, but net operating margin and cash liquidity continue to deteriorate.',
    options: [
      { id: 'a', score: 3, text: 'Scale up output volume further to dilute fixed overhead costs.' },
      { id: 'b', score: 2, text: 'Impose a flat price hike across the entire product catalog.' },
      { id: 'c', score: 0, text: 'Analyze profitability by SKU, customer tier, production line, scrap rate, discount structures, collection cycles, and material substitution elasticity.' },
      { id: 'd', score: 1, text: 'Throttle production on visibly unprofitable SKUs while full analytics complete.' }
    ]
  },
  {
    id: 20,
    dimension: 'operations',
    title: 'Chronic Minor Defect',
    scenario: 'A minor visual flaw persists on finished goods. Shift workers remark: “It has always been this way.”',
    options: [
      { id: 'a', score: 3, text: 'Accept the flaw as an inevitable characteristic of our manufacturing process.' },
      { id: 'b', score: 2, text: 'Increase end-of-line visual inspection staffing.' },
      { id: 'c', score: 0, text: 'Trace the flaw root cause in the upstream process, implement a controlled intervention, and update standard operating procedures.' },
      { id: 'd', score: 1, text: 'Temporarily segregate affected lots and schedule a dedicated engineering review.' }
    ]
  },
  {
    id: 21,
    dimension: 'operations',
    title: 'Recurring 5-Minute Stoppages',
    scenario: 'The primary assembly line micro-stops 6 to 8 times per shift for approximately 5 minutes each.',
    options: [
      { id: 'a', score: 3, text: 'Since each stop is brief, treat them as negligible and ignore them.' },
      { id: 'b', score: 2, text: 'Compensate for lost production tonnage with scheduled weekend overtime.' },
      { id: 'c', score: 0, text: 'Log frequency, duration, root causes, and cumulative financial cost, measuring their exact compounding effect on bottleneck uptime.' },
      { id: 'd', score: 1, text: 'Deploy a temporary buffer line and set a hard deadline for maintenance resolution.' }
    ]
  },
  {
    id: 22,
    dimension: 'market',
    title: 'Aggressive Discount Demands',
    scenario: 'A key distributor demands an immediate 15% discount, threatening to switch to a competitor.',
    options: [
      { id: 'a', score: 2, text: 'Concede the discount immediately to preserve the customer volume.' },
      { id: 'b', score: 1, text: 'Flatly reject the request to defend company pricing dignity.' },
      { id: 'c', score: 0, text: 'Analyze true customer switching cost, perceived value, contribution margin, payment terms, and alternative non-price service bundles.' },
      { id: 'd', score: 3, text: 'Maintain nominal price but silently downgrade service frequency or quality.' }
    ]
  },
  {
    id: 23,
    dimension: 'market',
    title: 'Large Order with Poor Payment Record',
    scenario: 'A notorious slow-paying client places a massive new production contract.',
    options: [
      { id: 'a', score: 3, text: 'Accept the contract immediately; gross sales growth ultimately benefits the firm.' },
      { id: 'b', score: 1, text: 'Reject the contract on the spot without further negotiation.' },
      { id: 'c', score: 0, text: 'Analyze margin, production capacity impact, collection history, and collateral, establishing mandatory down-payments, credit caps, or staged milestone deliveries.' },
      { id: 'd', score: 2, text: 'Accept based on executive handshake and personal verbal assurances.' }
    ]
  },
  {
    id: 24,
    dimension: 'market',
    title: 'Unrealistic Delivery Promise',
    scenario: 'A premier client demands a shipment delivery date that exceeds current operational plant capacity.',
    options: [
      { id: 'a', score: 3, text: 'Accept the impossible date and put aggressive pressure on the production team.' },
      { id: 'b', score: 1, text: 'Flatly reject the RFP and refuse further discussion.' },
      { id: 'c', score: 0, text: 'Communicate realistic capacity transparently, offering a verified delivery schedule, partial split shipments, or alternative priority options.' },
      { id: 'd', score: 2, text: 'Tell the client “we’ll probably make it” and hope unforeseen slack saves the deadline.' }
    ]
  }
];
