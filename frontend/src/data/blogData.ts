export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Product Updates' | 'Business' | 'Security' | 'Developer' | 'Company News';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
  image?: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'addispay-launches-instant-qr-payment',
    title: 'Addispay Launches Instant QR Payment for 50,000+ Ethiopian Merchants',
    excerpt: 'Our new QR-based checkout lets customers pay in under 3 seconds — no app download required. Rolling out nationwide to all registered Addispay merchant partners starting August 2026.',
    content: `
      <p class="lead">We are thrilled to announce the official nationwide rollout of Addispay Instant QR Payment, a groundbreaking payment solution engineered specifically for Ethiopian commerce.</p>
      
      <h2>Revolutionizing In-Person Checkout</h2>
      <p>Traditional POS terminals and manual mobile bank transfers often suffer from network delays, manual receipt verification, and long queue times. With Addispay Instant QR, merchants can accept payments from any mobile banking app or telebirr wallet in under three seconds.</p>

      <blockquote>"Speed and reliability are non-negotiable for small business owners during peak hours. Instant QR eliminates receipt fraud and cuts transaction time by 80%." — Ewnetu Abera, Board Chairman at Addispay.</blockquote>

      <h3>Key Features of Addispay Instant QR:</h3>
      <ul>
        <li><strong>Zero App Friction:</strong> Customers scan using their existing banking app (CBE, Telebirr, HelloCash, Bank of Abyssinia, Coop Bank).</li>
        <li><strong>Instant Sound & SMS Notifications:</strong> Merchants receive real-time audio and SMS confirmation as soon as funds clear.</li>
        <li><strong>Automatic Reconciliation:</strong> Every QR transaction is instantly logged to your Addispay Merchant Dashboard.</li>
        <li><strong>Dynamic & Static QR Codes:</strong> Print static tabletop displays or integrate dynamic QR on digital checkout screens.</li>
      </ul>

      <h2>Rolling Out to 50,000+ Merchants</h2>
      <p>Starting this week, merchant partners across Addis Ababa, Hawassa, Adama, Dire Dawa, and Mekelle can activate Instant QR directly within their Merchant Portal at no additional hardware cost.</p>
    `,
    category: 'Product Updates',
    author: {
      name: 'Addispay Product Team',
      role: 'Core Engineering',
      avatar: '/avatars/team.png'
    },
    date: 'August 4, 2026',
    readTime: '5 min read',
    featured: true,
    tags: ['QR Payment', 'Merchants', 'Product Update', 'Ethiopia Tech']
  },
  {
    id: '2',
    slug: 'ethiopian-smes-growing-3x-faster-digital-payments',
    title: 'How Ethiopian SMEs Are Growing 3x Faster with Digital Payments',
    excerpt: 'An analysis of transaction data from 12,000 small businesses shows that merchants who switched to Addispay increased monthly revenue by an average of 31% in their first quarter.',
    content: `
      <p class="lead">Cash-free transactions are no longer a novelty in Ethiopia—they are a core growth engine for modern retailers, wholesalers, and service providers.</p>
      
      <h2>The Shift Away from Cash Dependency</h2>
      <p>According to transaction data compiled across 12,000 active Addispay merchant accounts between Q1 2025 and Q2 2026, businesses accepting multi-channel digital payments experienced a 31% average boost in top-line monthly revenue.</p>

      <h3>Why Digital Merchants Outpace Cash-Only Stores:</h3>
      <ul>
        <li><strong>Higher Basket Sizes:</strong> Customers spent 24% more per transaction when paying digitally compared to cash.</li>
        <li><strong>Remote Orders & Social Commerce:</strong> Merchants using Addispay Payment Links were able to process sales across Telegram, Instagram, and phone calls effortlessly.</li>
        <li><strong>Simplified Credit & Working Capital:</strong> Verified transaction histories enable fast-tracked loan approvals from partner financial institutions.</li>
      </ul>

      <p>Whether operating a boutique in Bole, a pharmacy in Kazanchis, or an e-commerce store delivering nationwide, digital payment readiness is now the single biggest predictor of quarter-over-quarter retail growth in Ethiopia.</p>
    `,
    category: 'Business',
    author: {
      name: 'Desta Asmamaw',
      role: 'Strategy & Insights',
      avatar: '/avatars/desta.png'
    },
    date: 'August 3, 2026',
    readTime: '7 min read',
    tags: ['SME Growth', 'Retail Trends', 'Business Insights', 'Digital Payments']
  },
  {
    id: '3',
    slug: 'bank-grade-security-how-addispay-keeps-transactions-safe',
    title: 'Bank-Grade Security: How Addispay Keeps Every Transaction Safe',
    excerpt: 'We use 256-bit AES encryption, real-time fraud detection, and are fully NBE-licensed under NPS/PSO/007/2022. Here is exactly how we protect your money.',
    content: `
      <p class="lead">Security is the foundation of trust in financial technology. At Addispay, safeguarding customer funds and sensitive transaction data is built into every layer of our platform.</p>

      <h2>Licensed by the National Bank of Ethiopia</h2>
      <p>Addispay Financial Technology Share Company is fully licensed and regulated by the National Bank of Ethiopia (NBE) under license number <strong>NPS/PSO/007/2022</strong> as a Payment System Operator (PSO).</p>

      <h2>Core Security Infrastructure</h2>
      <ul>
        <li><strong>End-to-End Encryption:</strong> 256-bit AES encryption for stored data and TLS 1.3 protocol for data in transit.</li>
        <li><strong>AI Fraud Detection Engine:</strong> Our automated threat intelligence monitors transaction velocity, unusual location logins, and duplicate payload requests in real-time.</li>
        <li><strong>PCI-DSS Level 1 Compliance:</strong> Cardholder data is tokenized and stored in certified vault infrastructure.</li>
        <li><strong>Multi-Factor Authentication (MFA):</strong> Every admin payout, setting change, or withdrawal requires biometric or OTP verification.</li>
      </ul>

      <p>Your financial security is our highest priority. We undergo quarterly third-party vulnerability audits and maintain 99.99% system uptime standards.</p>
    `,
    category: 'Security',
    author: {
      name: 'Security & Compliance Desk',
      role: 'Cybersecurity Office',
      avatar: '/avatars/security.png'
    },
    date: 'August 2, 2026',
    readTime: '6 min read',
    tags: ['NBE License', 'Security', 'Compliance', 'Encryption']
  },
  {
    id: '4',
    slug: 'addispay-api-v3-faster-webhooks-better-sdks',
    title: 'Addispay API v3: Faster Webhooks, Better SDKs, Zero Downtime',
    excerpt: 'Our v3 API brings latency down to under 80ms, adds Python and Go SDKs, and introduces idempotency keys so your integration is bulletproof — even on flaky networks.',
    content: `
      <p class="lead">For developers building e-commerce apps, mobile software, and SaaS platforms in East Africa, our API is your direct pipeline to Ethiopian payment rails.</p>

      <h2>What is New in Addispay API v3</h2>
      <p>Engineered after months of developer feedback, API v3 sets a new benchmark for financial API performance in the region.</p>

      <h3>1. Ultra-Low Latency (< 80ms Response Times)</h3>
      <p>By optimizing our gateway routing across Ethiopian telecom infrastructure, API response times have been cut by 60%.</p>

      <h3>2. Webhook Resilience & Idempotency</h3>
      <p>Network hiccups will no longer cause double-charges or missed order confirmations. All v3 endpoints support <code>Idempotency-Key</code> headers and automatic retry policies with exponential backoff.</p>

      <h3>3. Official SDKs</h3>
      <p>We are releasing official SDKs for Node.js, Python, Go, PHP (Laravel), and Flutter. Integrate payment collection into your app in fewer than 10 lines of code.</p>
    `,
    category: 'Developer',
    author: {
      name: 'Mikiyas Tamirat',
      role: 'Chief Technology Officer',
      avatar: '/avatars/mikiyas.png'
    },
    date: 'August 1, 2026',
    readTime: '8 min read',
    tags: ['Developer', 'API v3', 'Webhooks', 'SDK', 'Fintech Architecture']
  },
  {
    id: '5',
    slug: 'addispay-closes-series-a-etb-380m-expansion',
    title: 'Addispay Closes Series A: ETB 380M to Expand Across East Africa',
    excerpt: 'We are thrilled to announce our Series A round, led by Aldar Capital and joined by AfricaFin Ventures. The funds will power expansion into Kenya, Uganda, and Rwanda by Q2 2027.',
    content: `
      <p class="lead">Today marks a milestone moment in the journey of Addispay Financial Technology Share Company. We have successfully closed our ETB 380 Million ($3.2M) Series A funding round.</p>

      <h2>Fueling Regional Interoperability</h2>
      <p>The investment will accelerate our core mission: providing a seamless, one-touch end-to-end commercial transaction experience across East Africa.</p>

      <h2>Key Investment Priorities:</h2>
      <ul>
        <li>Scaling our merchant acquisition team from 50,000 to over 200,000 partners.</li>
        <li>Expanding cross-border remittance and B2B payment corridors between Ethiopia, Kenya, and Uganda.</li>
        <li>Launching new financial products for MSMEs, including micro-invoicing and instant settlement accounts.</li>
      </ul>
    `,
    category: 'Company News',
    author: {
      name: 'Ewnetu Abera',
      role: 'Board Chairman',
      avatar: '/avatars/ewnetu.png'
    },
    date: 'July 30, 2026',
    readTime: '4 min read',
    tags: ['Series A', 'Funding', 'East Africa', 'Company News']
  },
  {
    id: '6',
    slug: 'understanding-nbe-payment-system-regulations',
    title: 'Understanding National Bank of Ethiopia Payment System Regulations',
    excerpt: 'A comprehensive guide for entrepreneurs, fintech founders, and merchants navigating payment system licensing, interoperability mandates, and compliance in Ethiopia.',
    content: `
      <p class="lead">Navigating financial regulations in Ethiopia is essential for operating a sustainable business. Here is what merchants and tech companies need to know about NBE regulatory standards.</p>

      <h2>The Role of Payment System Operators (PSO)</h2>
      <p>Under the National Bank of Ethiopia directive, PSOs act as authorized technological bridges connecting financial institutions, mobile money operators, merchants, and end consumers.</p>

      <h3>Compliance Checklist for Merchants:</h3>
      <p>Always verify that your payment gateway provider holds an official NBE license certificate (such as Addispay NPS/PSO/007/2022) to guarantee fund protection and legal operation.</p>
    `,
    category: 'Business',
    author: {
      name: 'Legal & Regulatory Desk',
      role: 'Compliance Office',
      avatar: '/avatars/legal.png'
    },
    date: 'July 25, 2026',
    readTime: '6 min read',
    tags: ['NBE Compliance', 'Regulations', 'Ethiopia Law', 'PSO']
  }
];
