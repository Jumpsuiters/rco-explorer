'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

/* ============================================================
   DATA — JOB org chart
   ============================================================ */
const DATA = {
  holdco: {
    label: 'For-Profit HoldCo',
    tag: 'Sustainability engine',
    desc: 'The commercial arm of the organism. A holding company that houses investable subsidiaries (SPVs), runs operations, and distributes profits to investors. This is how the organism sustains itself financially — without compromising the mission held by the nonprofit.',
    children: [
      {
        id: 'investment-pool',
        label: 'Investment Pool',
        desc: 'Community-owned capital via Wefunder / Reg CF equity crowdfunding. The people who believe in JOB own a piece of it. Capital flows into experiments, and successful ones become their own investable entities.',
      },
      {
        id: 'operations',
        label: 'Operations + Incubator',
        desc: 'The nervous system. Runs day-to-day operations and incubates new experiments. When something works, it graduates into its own SPV. When it doesn\'t, the organism learns and adapts.',
      },
      {
        id: 'spvs',
        label: 'SPV Subsidiaries',
        desc: 'Successful experiments become their own investable entities. Each SPV can raise independently while staying connected to the organism.',
        children: [
          { id: 'b30-spv', label: 'Business 3.0 SPV', desc: 'Consulting IP and organizational transformation. Helping companies become organisms, not machines.' },
          { id: 'msl-spv', label: 'MagicShowLand SPV', desc: 'Physical immersive spaces — abandoned churches, castles, colleges — where humans go to remember what they are.' },
          { id: 'ms-spv', label: 'Magic Shows SPV', desc: 'Experiential events that crack people open. Corporate retreats, public gatherings, initiatory experiences.' },
          { id: 'board-spv', label: 'J.O.B. Board SPV', desc: 'A marketplace for things AI can\'t do. Humans post uniquely human offers. Other humans pay for them.' },
        ],
      },
      {
        id: 'external-spvs',
        label: 'External Investments',
        desc: 'The organism can also invest in member projects and aligned ventures, expanding the mycelial network.',
        children: [
          { id: 'spirittech', label: 'SpiritTech SPV', desc: 'Technology that serves the human spirit, not the other way around.' },
          { id: 'immersive', label: 'Immersive Centers SPV', desc: 'Spaces designed for transformation — experiential environments beyond MagicShowLand.' },
        ],
      },
      {
        id: 'profits',
        label: 'Distributes Profits to Investors',
        desc: 'The organism rewards the humans who fund it. Profits flow back to community investors — the people who believed before it was obvious.',
      },
    ],
  },
  nonprofit: {
    label: 'Nonprofit 508(c)(1)(a)',
    tag: 'Mission guardian',
    desc: 'The soul of the organism. A religious nonprofit that holds the mission, doctrine, and community functions. Protected by a purpose trust (Patagonia model) so the mission can never be sold or corrupted. This is the root — everything else grows from here.',
    children: [
      {
        id: 'doctrine',
        label: 'Doctrine & Sacrament',
        desc: 'The sacred texts of the organism. Not dogma — living doctrine. The Church, Sunday Night Live, elder-guided tracks, the initiatory journey. The deprogramming is the root; everything else is a surface for that transformation to show up.',
      },
      {
        id: 'mutual-aid',
        label: 'Public Benefit / Mutual Aid',
        desc: 'The organism takes care of its own. Community support, resource sharing, mutual aid networks. Humans helping humans — the original technology.',
      },
      {
        id: 'grants',
        label: 'Grants / MicroGrants',
        desc: 'Funding for members who are building something. Small bets on sovereign humans. The organism invests in the people it creates.',
      },
      {
        id: 'church-ip',
        label: 'Church IP (licensed to HoldCo)',
        desc: 'The transformation methodology, curriculum, and practices. Owned by the nonprofit, licensed to the HoldCo. This is the bridge — mission-side IP fuels commercial-side revenue without the mission losing control.',
      },
      {
        id: 'land',
        label: 'Holds Land',
        desc: 'Physical spaces owned by the nonprofit — sanctuaries, gathering spaces, future MagicShowLand locations. Land held in trust for the community, not for profit.',
      },
      {
        id: 'research',
        label: 'Research & Publication Arm',
        desc: 'Studying what happens when humans deprogram. Publishing findings. Building the evidence base for a new way of being. The organism documents its own evolution.',
      },
    ],
  },
};

/* ============================================================
   DIAGNOSTIC — "Could your organization be an RCO?"
   ============================================================ */
const QUESTIONS = [
  {
    q: 'Does your mission sometimes conflict with your revenue model?',
    yes: 'This is the core tension the RCO resolves. When mission and money live in separate entities with shared purpose, they stop fighting.',
    no: 'Lucky you. But if growth ever pressures you to compromise, the RCO has a structural answer.',
  },
  {
    q: 'Do you serve a community that should have ownership in what you\'re building?',
    yes: 'RCOs are designed for exactly this — community ownership through equitable value distribution, not just lip service.',
    no: 'Even traditional businesses benefit from stakeholder alignment. The RCO model makes it structural, not aspirational.',
  },
  {
    q: 'Are you trying to build something that outlasts you?',
    yes: 'Purpose trusts and dual-entity design mean the mission can\'t be sold, acquired, or diluted. It\'s built to outlive its founders.',
    no: 'Nothing wrong with that. But if you ever feel the pull toward legacy, the structure will be here.',
  },
  {
    q: 'Do you have both commercial activities AND a public benefit or social mission?',
    yes: 'You\'re already living the dual reality. The RCO gives it a legal and organizational home — instead of forcing one side to subsidize the other.',
    no: 'An RCO might not be the right fit today. But as your work matures, the need for structural integrity between mission and commerce often emerges.',
  },
  {
    q: 'Would your organization benefit from incubating new experiments without risking the whole?',
    yes: 'The SPV model lets you spin up experiments, fund them independently, and let them fail or fly — without endangering the mothership.',
    no: 'Focus is powerful. The RCO is for organisms that want to grow through exploration, not just optimization.',
  },
  {
    q: 'Do you believe the organizational structures we inherited are inadequate for what\'s coming next?',
    yes: 'Then you already understand why the RCO exists. New paradigms need new containers.',
    no: 'We respectfully disagree. But we\'d love to buy you coffee and talk about it.',
  },
];

/* ============================================================
   COMPONENTS
   ============================================================ */
function Node({ item, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={`node depth-${depth}`}>
      <div
        className={`node-card ${open ? 'node-card-open' : ''} ${hasChildren ? 'node-card-parent' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <div className="node-label">{item.label}</div>
        {open && item.desc && <div className="node-desc">{item.desc}</div>}
        {!open && item.desc && <div className="node-hint">Click to explore</div>}
      </div>
      {open && hasChildren && (
        <div className="node-children">
          {item.children.map((child) => (
            <Node key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function Column({ side, data }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`column column-${side}`}>
      <div
        className={`column-header ${open ? 'column-header-open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <h2 className="column-title">{data.label}</h2>
        <span className="column-tag">{data.tag}</span>
        {open && <p className="column-desc">{data.desc}</p>}
      </div>
      {open && (
        <div className="column-body">
          {data.children.map((child) => (
            <Node key={child.id} item={child} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadForm({ score, total }) {
  const [form, setForm] = useState({ name: '', email: '', org: '', question: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('waitlist').insert([{
      email: form.email,
      source: 'rco_diagnostic',
      metadata: JSON.stringify({
        name: form.name,
        org: form.org || null,
        guiding_question: form.question || null,
        score: `${score}/${total}`,
      }),
    }]);
    if (!error) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { name: form.name, email: form.email, org: form.org, guiding_question: form.question, score: `${score}/${total}` },
        }),
      }).catch(() => {})
    }
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div className="lead-confirmed">
        <p>We see you. Expect to hear from us soon.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="lead-field">
        <label>Name *</label>
        <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
      </div>
      <div className="lead-field">
        <label>Email *</label>
        <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@org.com" />
      </div>
      <div className="lead-field">
        <label>Organization</label>
        <input type="text" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} placeholder="Your org (optional)" />
      </div>
      <div className="lead-field">
        <label>What&apos;s your guiding question?</label>
        <input type="text" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="The question your org is exploring (optional)" />
      </div>
      <button type="submit" className="lead-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : status === 'error' ? 'Try again' : 'Start the conversation'}
      </button>
    </form>
  );
}

function Diagnostic() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);

  const total = QUESTIONS.length;
  const done = current >= total;
  const yesCount = answers.filter((a) => a === true).length;

  function answer(isYes) {
    setAnswers([...answers, isYes]);
    setCurrent(current + 1);
  }

  function reset() {
    setCurrent(0);
    setAnswers([]);
    setStarted(false);
  }

  if (!started) {
    return (
      <section className="diagnostic">
        <span className="diagnostic-eyebrow">Interactive</span>
        <h2 className="diagnostic-title">Could your organization be an RCO?</h2>
        <p className="diagnostic-intro">
          Six questions. No right answers. Just a mirror for where your organization is
          and whether the RCO model might be the structure it&apos;s been missing.
        </p>
        <button className="diagnostic-start" onClick={() => setStarted(true)}>
          Start the diagnostic
        </button>
      </section>
    );
  }

  if (done) {
    const level =
      yesCount >= 5 ? 'high' : yesCount >= 3 ? 'medium' : 'low';

    const verdicts = {
      high: {
        headline: 'Your organization is ready for this.',
        body: 'You\'re already living the tensions the RCO was designed to resolve. You don\'t need convincing — you need a blueprint. Business 3.0 can help you design and implement your RCO structure.',
      },
      medium: {
        headline: 'There\'s something here.',
        body: 'You\'re feeling the pull between mission and commerce, between growth and integrity. The RCO won\'t solve everything, but it gives those tensions a home instead of letting them tear at your culture. Worth a conversation.',
      },
      low: {
        headline: 'Maybe not yet. And that\'s fine.',
        body: 'The RCO is a specific answer to a specific set of tensions. If you\'re not feeling them yet, the model might not be for you right now. But bookmark this — organizations evolve, and when the tension shows up, you\'ll know where to look.',
      },
    };

    return (
      <section className="diagnostic">
        <span className="diagnostic-eyebrow">Your result</span>
        <h2 className="diagnostic-title">{verdicts[level].headline}</h2>
        <div className="diagnostic-score">
          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${(yesCount / total) * 100}%` }}
            />
          </div>
          <span className="score-label">{yesCount} of {total} signals detected</span>
        </div>
        <p className="diagnostic-verdict">{verdicts[level].body}</p>
        {level !== 'low' && (
          <LeadForm score={yesCount} total={total} />
        )}
        <div className="diagnostic-actions">
          <button className="diagnostic-reset" onClick={reset}>
            Take it again
          </button>
        </div>
      </section>
    );
  }

  const q = QUESTIONS[current];
  const prevAnswer = current > 0 ? answers[current - 1] : null;
  const prevQ = current > 0 ? QUESTIONS[current - 1] : null;

  return (
    <section className="diagnostic">
      <span className="diagnostic-eyebrow">
        Question {current + 1} of {total}
      </span>
      {prevQ && prevAnswer !== null && (
        <div className="diagnostic-reflection">
          <p>{prevAnswer ? prevQ.yes : prevQ.no}</p>
        </div>
      )}
      <h2 className="diagnostic-question">{q.q}</h2>
      <div className="diagnostic-buttons">
        <button className="diag-btn diag-yes" onClick={() => answer(true)}>
          Yes
        </button>
        <button className="diag-btn diag-no" onClick={() => answer(false)}>
          No
        </button>
      </div>
      <div className="diagnostic-progress">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < current ? 'progress-done' : ''} ${i === current ? 'progress-current' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Home() {
  return (
    <div className="page">
      {/* ===== NAV ===== */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo">RCO</a>
          <div className="nav-links">
            <a href="#what">The Model</a>
            <a href="#job">The Case Study</a>
            <a href="#build">Build Yours</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="header">
        <p className="header-eyebrow">Regenerative Community Organism</p>
        <h1 className="header-title">From organizations<br />to living, breathing organisms.</h1>
        <p className="header-sub">
          A new form of organizational design that fuses commerce and conscience — built to regenerate, not extract.
        </p>
      </header>

      {/* ===== GUIDING QUESTION ===== */}
      <section className="guiding-question-section">
        <h2 className="explainer-title">Every RCO starts with a question.</h2>
        <p className="explainer-body">
          Not a mission statement. Not a tagline. A living inquiry — one that shapes every entity, every decision, and every relationship inside the organism. The question isn&apos;t something you answer. It&apos;s something you keep following.
        </p>
        <p className="header-question">
          What might be your guiding question?
        </p>
      </section>

      {/* ===== WHAT IS AN RCO ===== */}
      <section id="what" className="explainer">
        <h2 className="explainer-title">What is an RCO?</h2>
        <p className="explainer-body">
          A <strong>Regenerative Community Organism</strong> is a new form of organizational design — created by entrepreneurs <strong>Nils von Heijne</strong> and <strong>Amit Paul</strong> — that fuses a for-profit enterprise with a nonprofit association under a shared, protected purpose.
        </p>
        <p className="explainer-body" style={{ marginTop: '0.75rem' }}>
          It&apos;s built on a simple conviction: the organizational structures we inherited — corporations optimized for extraction, nonprofits optimized for survival — are not adequate for what&apos;s coming next. We need containers that can hold both commerce and conscience without one consuming the other.
        </p>
        <p className="explainer-source" style={{ marginTop: '0.75rem' }}>
          The RCO framework was pioneered by <a href="https://rco.life" target="_blank" rel="noopener noreferrer">rco.life</a>. The first formally incorporated RCO is <a href="https://innrwrks.com" target="_blank" rel="noopener noreferrer">Innrwrks</a>, a resilience lab in Sweden.
        </p>

        <div style={{ maxWidth: '720px', margin: '2rem auto 0' }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/yYmmUplsumQ"
              title="What is a Regenerative Community Organism?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: '12px' }}
            />
          </div>
        </div>

        <div className="explainer-principles">
          <div className="explainer-principle">
            <span className="principle-label">Dual Entity</span>
            <p>A for-profit company and a nonprofit association, legally separate but sharing the same underlying purpose. Commerce funds the mission. The mission governs the commerce. Neither can exist without the other.</p>
          </div>
          <div className="explainer-principle">
            <span className="principle-label">Guiding Question</span>
            <p>Every RCO is organized around a central question — not a mission statement, not a slogan. A living inquiry that every entity within the organism explores in its own way. The question is the root system.</p>
          </div>
          <div className="explainer-principle">
            <span className="principle-label">Fair Value Distribution</span>
            <p>Stakeholders, community, and investors all participate in the value the organism creates. Not charity. Not extraction. Regeneration — where the system creates more than it consumes.</p>
          </div>
        </div>

        <h3 className="explainer-subtitle">A model for regeneration</h3>
        <p className="explainer-body">
          An RCO isn&apos;t just a structure — it&apos;s a pattern of life. The organism <strong>follows the energy</strong>: when something is working, it gets more resources. When something has run its course, it gets <strong>composted</strong> — its learnings, relationships, and assets are recycled back into the system. Nothing is wasted.
        </p>
        <p className="explainer-body" style={{ marginTop: '0.75rem' }}>
          The organism <strong>attracts others who share the question</strong>. New entities join — not through acquisition, but through resonance. Each one retains its full agency while being in <strong>right relationship with the whole</strong>. Like mycelium: autonomous nodes, connected underground, sharing nutrients, strengthening the network by strengthening each other.
        </p>
        <p className="explainer-body" style={{ marginTop: '0.75rem' }}>
          This is what regeneration actually looks like at the organizational level: not perpetual growth, but perpetual reinvestment. The organism feeds itself, evolves itself, and creates conditions for more life.
        </p>
      </section>

      {/* ===== WHY NOW ===== */}
      <section id="why" className="why-now">
        <h2 className="explainer-title">Why now?</h2>
        <div className="why-grid">
          <div className="why-card">
            <span className="why-number">01</span>
            <h3>AI is displacing work faster than we can retrain for it</h3>
            <p>The jobs aren&apos;t coming back. But human potential isn&apos;t going anywhere. We need structures that develop humans, not just employ them.</p>
          </div>
          <div className="why-card">
            <span className="why-number">02</span>
            <h3>Mission-driven founders keep hitting the same wall</h3>
            <p>You either sell out (literally) or burn out (structurally). The RCO is a third option: build commercially while protecting the mission with the force of law.</p>
          </div>
          <div className="why-card">
            <span className="why-number">03</span>
            <h3>Community ownership is becoming viable</h3>
            <p>Reg CF, equity crowdfunding, DAOs, purpose trusts — the infrastructure for community-owned organizations finally exists. The RCO gives it form.</p>
          </div>
        </div>
      </section>

      {/* ===== JOB AS PROOF ===== */}
      <section id="job" className="job-rco">
        <span className="job-rco-eyebrow">Case study</span>
        <h2 className="explainer-title">J.O.B. is the first RCO in the United States.</h2>
        <p className="explainer-body">
          J.O.B. — the Joy of Being — is bringing the RCO model to America. Not as a theory, but as a living proof of concept. Our guiding question — <em>What happens when being human IS the job?</em> — is the root system. Every entity in the organism explores it differently: a church, a marketplace, a consulting practice, immersive experiences, a community investment pool. Sovereign entities, in regenerative relationship, each following the energy of the same question.
        </p>
        <p className="explainer-body" style={{ marginTop: '0.75rem' }}>
          Click into the structure below to see how it works.
        </p>
      </section>

      {/* ===== INTERACTIVE ORG CHART ===== */}
      <div className="organism">
        <div className="organism-root">
          <span className="organism-root-label">J.O.B.</span>
          <span className="organism-root-sub">The Joy of Being</span>
        </div>

        <div className="organism-branches">
          <div className="branch-line branch-line-left" />
          <div className="branch-line branch-line-right" />
        </div>

        <div className="columns">
          <Column side="left" data={DATA.holdco} />
          <Column side="right" data={DATA.nonprofit} />
        </div>
      </div>

      {/* ===== DIAGNOSTIC ===== */}
      <div id="diagnostic">
        <Diagnostic />
      </div>

      {/* ===== IMPLEMENTER ===== */}
      <section id="build" className="implementer">
        <div className="implementer-inner">
          <span className="implementer-eyebrow">The path</span>
          <h2 className="implementer-title">We&apos;ll guide you on your RCO journey.</h2>
          <p className="implementer-body">
            Through <strong>Business 3.0</strong>, our organizational transformation practice, we have a team of certified guides who help founders and organizations discover, design, and launch their own RCOs.
          </p>
          <div className="implementer-steps">
            <div className="impl-step">
              <span className="impl-step-num">1</span>
              <div>
                <strong>Discovery</strong>
                <p>An immersive, embodied ceremony — in person or virtual — that helps you discover your guiding question. Using multi-intelligence — somatic, emotional, and intuitive intelligence (entheogenics, optional) — to sense what the organism wants to become.</p>
              </div>
            </div>
            <div className="impl-step">
              <span className="impl-step-num">2</span>
              <div>
                <strong>Design</strong>
                <p>Your guide architects your dual-entity structure — what lives where, how value flows, how the mission stays protected.</p>
              </div>
            </div>
            <div className="impl-step">
              <span className="impl-step-num">3</span>
              <div>
                <strong>Launch</strong>
                <p>We help you incorporate, set up governance, and begin operating as a living organism.</p>
              </div>
            </div>
          </div>
          <a href="https://business-30.vercel.app/" target="_blank" rel="noopener noreferrer" className="implementer-cta">Explore Business 3.0</a>
        </div>
      </section>

      {/* ===== INVESTORS ===== */}
      <section id="invest" className="investors">
        <h2 className="explainer-title">For investors</h2>
        <p className="explainer-body">
          The RCO isn&apos;t anti-profit. It&apos;s anti-extraction. Investors participate in the upside through the HoldCo — community-owned equity via Reg CF crowdfunding. When the organism thrives, everyone who believed in it shares in what it creates.
        </p>
        <p className="explainer-body" style={{ marginTop: '0.75rem' }}>
          J.O.B. is raising its first round through <strong>Wefunder</strong>. If you want to own a piece of the first US RCO — not as a bet on a company, but as a stake in a new way of organizing human potential — we&apos;d love to talk.
        </p>
        <a
          href="https://itsthejob.com"
          target="_blank"
          rel="noopener noreferrer"
          className="investors-cta"
        >
          Express interest at itsthejob.com
        </a>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>
          The organism is growing.
        </p>
        <div className="footer-links">
          <a href="https://itsthejob.com" target="_blank" rel="noopener noreferrer">J.O.B.</a>
          <a href="https://business-30.vercel.app/" target="_blank" rel="noopener noreferrer">Business 3.0</a>
          <a href="https://rco.life" target="_blank" rel="noopener noreferrer">rco.life</a>
        </div>
      </footer>
    </div>
  );
}
