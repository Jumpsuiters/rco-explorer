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
   READINESS ASSESSMENT — "Are you ready to form an RCO?"
   ============================================================ */
const PATH_QUESTIONS = [
  {
    q: 'Are you trying to coordinate multiple stakeholders, organizations, or movements — not just build a single company?',
    yes: 'RCOs exist to coordinate ecosystems. You\'re already in the territory the model was built for.',
    no: 'An RCO might be premature for what you\'re building today. Worth bookmarking for when the work expands beyond a single org.',
  },
  {
    q: 'Do you have a guiding question that\'s bigger than any one founder or organization?',
    yes: 'The question is the root system. Everything else in the organism grows from there.',
    no: 'Without a guiding question, the formation process has nowhere to land. Worth sitting with before starting.',
  },
  {
    q: 'Are you willing to enter a discovery process without knowing the answer in advance?',
    yes: 'Good. Discovery is the only way through. You can\'t design what hasn\'t shown up yet.',
    no: 'The RCO process refuses to be rushed or pre-engineered. If you need a known outcome, we should talk before starting.',
  },
  {
    q: 'Are the people who would join your RCO already in some kind of relationship with each other?',
    yes: 'Then the soil is already there. The structure just gives the relationships a home.',
    no: 'We can help you find them, but the work moves faster when the seed network is already alive.',
  },
  {
    q: 'Are you prepared to define "what\'s enough" for yourself as a founder — including return boundaries?',
    yes: 'Defining enough is the most underrated leadership move in the new economy. You\'re already practicing it.',
    no: 'This is the work most founders skip. We\'ll do it with you.',
  },
  {
    q: 'Do you have time and capacity for a multi-phase formation process (typically 3–12 months)?',
    yes: 'The pace of life. Worth every month.',
    no: 'It can be modular. Run the first two phases and decide from there.',
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

function PathLeadForm({ score, total }) {
  const [form, setForm] = useState({ name: '', email: '', org: '', question: '' });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('waitlist').insert([{
      email: form.email,
      source: 'rco_path_assessment',
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
          data: { name: form.name, email: form.email, org: form.org, guiding_question: form.question, score: `${score}/${total}`, source: 'path_assessment' },
        }),
      }).catch(() => {});
    }
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div className="lead-confirmed">
        <p>We see you. We&apos;ll be in touch to schedule your discovery call.</p>
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
        <label>Organization or ecosystem</label>
        <input type="text" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} placeholder="What you're forming" />
      </div>
      <div className="lead-field">
        <label>Your guiding question (if you have one)</label>
        <input type="text" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="The question your ecosystem is exploring" />
      </div>
      <button type="submit" className="lead-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : status === 'error' ? 'Try again' : 'Book a discovery call'}
      </button>
    </form>
  );
}

function PathAssessment() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);

  const total = PATH_QUESTIONS.length;
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
        <span className="diagnostic-eyebrow">Readiness assessment</span>
        <h2 className="diagnostic-title">Are you ready to form an RCO?</h2>
        <p className="diagnostic-intro">
          Six questions. No right answers. A mirror for whether you&apos;re ready to enter the
          5-phase formation process &mdash; and what it might surface.
        </p>
        <button className="diagnostic-start" onClick={() => setStarted(true)}>
          Start the assessment
        </button>
      </section>
    );
  }

  if (done) {
    const level = yesCount >= 5 ? 'high' : yesCount >= 3 ? 'medium' : 'low';

    const verdicts = {
      high: {
        headline: 'You\'re ready. Let\'s talk.',
        body: 'You\'re already living the conditions the RCO formation process was built for. The next step is a discovery call where we map your guiding question and decide which entry point fits.',
      },
      medium: {
        headline: 'You\'re close. Let\'s explore.',
        body: 'Some of the conditions are there, others are still forming. A discovery call will help you see where the soil is fertile and what needs to happen before the formation process can begin.',
      },
      low: {
        headline: 'Maybe not yet. Stay in touch.',
        body: 'The RCO process is for ecosystems that are already pulling toward coherence. It might be too early — and that\'s fine. Bookmark this and come back when the tension shows up.',
      },
    };

    return (
      <section className="diagnostic">
        <span className="diagnostic-eyebrow">Your result</span>
        <h2 className="diagnostic-title">{verdicts[level].headline}</h2>
        <div className="diagnostic-score">
          <div className="score-bar">
            <div className="score-fill" style={{ width: `${(yesCount / total) * 100}%` }} />
          </div>
          <span className="score-label">{yesCount} of {total} signals detected</span>
        </div>
        <p className="diagnostic-verdict">{verdicts[level].body}</p>
        {level !== 'low' && <PathLeadForm score={yesCount} total={total} />}
        <div className="diagnostic-actions">
          <button className="diagnostic-reset" onClick={reset}>
            Take it again
          </button>
        </div>
      </section>
    );
  }

  const q = PATH_QUESTIONS[current];
  const prevAnswer = current > 0 ? answers[current - 1] : null;
  const prevQ = current > 0 ? PATH_QUESTIONS[current - 1] : null;

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
        <button className="diag-btn diag-yes" onClick={() => answer(true)}>Yes</button>
        <button className="diag-btn diag-no" onClick={() => answer(false)}>No</button>
      </div>
      <div className="diagnostic-progress">
        {PATH_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i < current ? 'progress-done' : ''} ${i === current ? 'progress-current' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}

function InvestForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest_job: false,
    interest_dogcultr: false,
    investment_level: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.interest_job && !form.interest_dogcultr) {
      setStatus('select');
      return;
    }
    setStatus('submitting');
    const interests = [];
    if (form.interest_job) interests.push('J.O.B.');
    if (form.interest_dogcultr) interests.push('Dogcultr');

    const { error } = await supabase.from('waitlist').insert([{
      email: form.email,
      source: 'rco_invest',
      metadata: JSON.stringify({
        name: form.name,
        phone: form.phone || null,
        interests: interests.join(', '),
        investment_level: form.investment_level || null,
        message: form.message || null,
      }),
    }]);
    if (!error) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            interests: interests.join(', '),
            investment_level: form.investment_level,
            message: form.message,
            source: 'invest',
          },
        }),
      }).catch(() => {});
    }
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div className="lead-confirmed">
        <p>You&apos;re in. We&apos;ll be in touch to start the conversation.</p>
      </div>
    );
  }

  return (
    <form className="lead-form invest-form" onSubmit={handleSubmit}>
      <div className="lead-field">
        <label>Name *</label>
        <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
      </div>
      <div className="lead-field">
        <label>Email *</label>
        <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
      </div>
      <div className="lead-field">
        <label>Phone</label>
        <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Optional" />
      </div>
      <div className="lead-field">
        <label>I&apos;m interested in *</label>
        <div className="invest-checks">
          <label className="invest-check">
            <input
              type="checkbox"
              checked={form.interest_job}
              onChange={e => setForm(f => ({ ...f, interest_job: e.target.checked }))}
            />
            <span>J.O.B. &mdash; The Joy of Being</span>
          </label>
          <label className="invest-check">
            <input
              type="checkbox"
              checked={form.interest_dogcultr}
              onChange={e => setForm(f => ({ ...f, interest_dogcultr: e.target.checked }))}
            />
            <span>Dogcultr</span>
          </label>
        </div>
      </div>
      <div className="lead-field">
        <label>Investment interest</label>
        <select
          value={form.investment_level}
          onChange={e => setForm(f => ({ ...f, investment_level: e.target.value }))}
        >
          <option value="">Select a range</option>
          <option value="$1K-$10K">$1K – $10K</option>
          <option value="$10K-$50K">$10K – $50K</option>
          <option value="$50K-$100K">$50K – $100K</option>
          <option value="$100K-$500K">$100K – $500K</option>
          <option value="$500K+">$500K+</option>
          <option value="Just exploring">Just exploring</option>
        </select>
      </div>
      <div className="lead-field">
        <label>Message (optional)</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="What drew you in?"
          rows={3}
        />
      </div>
      {status === 'select' && (
        <p className="invest-error">Pick at least one RCO above.</p>
      )}
      <button type="submit" className="lead-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : status === 'error' ? 'Try again' : 'Start the conversation'}
      </button>
    </form>
  );
}

function PartnerForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    org: '',
    region: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('waitlist').insert([{
      email: form.email,
      source: 'rco_strategic_partner',
      metadata: JSON.stringify({
        name: form.name,
        org: form.org || null,
        region: form.region || null,
        message: form.message || null,
      }),
    }]);
    if (!error) {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            name: form.name,
            email: form.email,
            org: form.org,
            region: form.region,
            message: form.message,
            source: 'strategic_partner',
          },
        }),
      }).catch(() => {});
    }
    setStatus(error ? 'error' : 'success');
  }

  if (status === 'success') {
    return (
      <div className="lead-confirmed">
        <p>Thank you. We&apos;ll be in touch about Business 3.0 Guide training.</p>
      </div>
    );
  }

  return (
    <form className="lead-form invest-form" onSubmit={handleSubmit}>
      <div className="lead-field">
        <label>Name *</label>
        <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
      </div>
      <div className="lead-field">
        <label>Email *</label>
        <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
      </div>
      <div className="lead-field">
        <label>Organization</label>
        <input type="text" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} placeholder="Optional" />
      </div>
      <div className="lead-field">
        <label>Region *</label>
        <select
          required
          value={form.region}
          onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
        >
          <option value="">Select your region</option>
          <option value="North America">North America</option>
          <option value="Latin America">Latin America</option>
          <option value="Europe">Europe</option>
          <option value="UK & Ireland">UK &amp; Ireland</option>
          <option value="Africa">Africa</option>
          <option value="Middle East">Middle East</option>
          <option value="East Asia">East Asia</option>
          <option value="South Asia">South Asia</option>
          <option value="Southeast Asia">Southeast Asia</option>
          <option value="Oceania">Oceania</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="lead-field">
        <label>Tell us about your ecosystem</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="What are you seeing in your region? Who&apos;s ready?"
          rows={3}
        />
      </div>
      <button type="submit" className="lead-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : status === 'error' ? 'Try again' : 'Become a Guide'}
      </button>
    </form>
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
            <a href="#build">Create an RCO</a>
            <a href="#partner">Partner</a>
            <a href="#invest">Invest</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="header">
        <p className="header-eyebrow">Regenerative Community Organism</p>
        <h1 className="header-title">Turning organizations into<br />living, breathing organisms.</h1>
        <p className="header-sub">
          A new form of organizational design that fuses commerce and conscience — built to regenerate, not extract.
        </p>
      </header>

      {/* ===== GUIDING QUESTION ===== */}
      <section className="guiding-question-section">
        <h2 className="explainer-title">Every RCO starts with a question.</h2>
        <p className="explainer-body">
          Not a vision or mission statement. A question. And then every member and every organization within the RCO self-organizes around that.
        </p>

        <div className="question-grid">
          <div className="question-card">
            <span className="question-card-tag">Sweden</span>
            <h3>InnrWrks</h3>
            <p className="question-card-q">&ldquo;What kind of world do we want to leave behind for our children?&rdquo;</p>
          </div>
          <div className="question-card">
            <span className="question-card-tag">US</span>
            <h3>J.O.B.</h3>
            <p className="question-card-q">&ldquo;What happens when being human is the only job left?&rdquo;</p>
          </div>
          <div className="question-card">
            <span className="question-card-tag">US</span>
            <h3>Dogcultr</h3>
            <p className="question-card-q">&ldquo;What kind of world do dogs want to live in?&rdquo;</p>
          </div>
        </div>

        <p className="header-question">
          What&apos;s the question you&apos;d spend the rest of your life pursuing?
        </p>
        <a href="#readiness" className="question-cta">Explore your own →</a>
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

      {/* ===== THE PATH ===== */}
      <section id="build" className="implementer">
        <div className="implementer-inner">
          <span className="implementer-eyebrow">Create an RCO</span>
          <h2 className="implementer-title">We&apos;ll guide you through your RCO formation.</h2>
          <p className="implementer-body">
            The RCO formation process is a <strong>discovery process, not a design process</strong>. Together, we step toward the void at the center of your ecosystem and let what wants to emerge, emerge.
          </p>

          <h3 className="explainer-subtitle">Who this is for</h3>
          <p className="implementer-body">
            The RCO creates coherence for ecosystems that require multiple stakeholders to act as one.
          </p>
          <div className="impl-pills">
            <span className="impl-pill">Multi-stakeholder ventures</span>
            <span className="impl-pill">Ecosystems</span>
            <span className="impl-pill">Movements</span>
            <span className="impl-pill">Networks</span>
            <span className="impl-pill">Funds &amp; Foundations</span>
            <span className="impl-pill">Platform Cooperatives</span>
            <span className="impl-pill">Multi-entity IP structures</span>
          </div>

          <h3 className="explainer-subtitle">Why now</h3>
          <p className="implementer-body">
            The world is shifting toward multi-stakeholder, post-AI coordination. Current organizational models can&apos;t hold it.
          </p>
          <div className="impl-pills">
            <span className="impl-pill">AI &amp; automation</span>
            <span className="impl-pill">Meaning crisis</span>
            <span className="impl-pill">Decentralization</span>
            <span className="impl-pill">Network orgs</span>
            <span className="impl-pill">Post-UBI scenarios</span>
          </div>

          <h3 className="explainer-subtitle">The 5-phase journey</h3>
          <p className="implementer-body">
            Each phase invites a pause to sense if alignment exists for the next phase. After all five, the initiative becomes legally coherent, economically aligned, and culturally grounded &mdash; with clear roles, governance, ownership, value boundaries, and mechanisms for ongoing coordination.
          </p>

          <div className="phase-grid">
            <div className="phase-card">
              <span className="phase-num">01</span>
              <h4>Direction Finding</h4>
              <p>Identify the shared question (the <em>why</em>) and the working principles (the <em>how</em>).</p>
              <ul className="phase-outputs">
                <li>1&ndash;3 guiding questions</li>
                <li>3&ndash;5 collaboration principles</li>
              </ul>
            </div>
            <div className="phase-card">
              <span className="phase-num">02</span>
              <h4>Territory Mapping</h4>
              <p>Identify the value the ecosystem intends to create and how participants contribute.</p>
              <ul className="phase-outputs">
                <li>Activities &amp; capacities</li>
                <li>Gaps</li>
                <li>Non-profit scope (the &ldquo;terrain map&rdquo;)</li>
              </ul>
            </div>
            <div className="phase-card">
              <span className="phase-num">03</span>
              <h4>For-Profit &amp; Non-Profit Exploration</h4>
              <p>Align incentives, expectations, and returns. Define cultural, governance, and membership architecture.</p>
              <ul className="phase-outputs">
                <li>Minimum Viable Contribution &amp; Return</li>
                <li>Membership &amp; membranics</li>
                <li>Governance &amp; bylaws</li>
                <li>Funding model</li>
              </ul>
            </div>
            <div className="phase-card">
              <span className="phase-num">04</span>
              <h4>Value Distribution</h4>
              <p>Define &ldquo;what&apos;s enough.&rdquo; Set return boundaries, lifecycle, and resource recycling.</p>
              <ul className="phase-outputs">
                <li>Success definition</li>
                <li>Return boundaries</li>
                <li>Lifecycle model</li>
                <li>Soil contributions &amp; accountability</li>
              </ul>
            </div>
            <div className="phase-card">
              <span className="phase-num">05</span>
              <h4>Vessel Building</h4>
              <p>Incorporate the structure legally and operationally.</p>
              <ul className="phase-outputs">
                <li>Bylaws &amp; shareholder agreements</li>
                <li>Legal entities &amp; templates</li>
                <li>Capital stack &amp; banking ops</li>
                <li>Governance ops &amp; onboarding</li>
              </ul>
            </div>
          </div>

          <h3 className="explainer-subtitle">What emerges</h3>
          <p className="implementer-body">
            These aren&apos;t goals we impose. They&apos;re the unintended consequences of alignment:
          </p>
          <div className="impl-pills">
            <span className="impl-pill">Relationality</span>
            <span className="impl-pill">Responsibility</span>
            <span className="impl-pill">Intimacy</span>
            <span className="impl-pill">Shared meaning</span>
            <span className="impl-pill">Long-term coherence</span>
          </div>

          <h3 className="explainer-subtitle">Multiple entry points</h3>
          <p className="implementer-body">
            You don&apos;t have to commit to all five phases at once. Start where the energy is.
          </p>
          <div className="phase-grid phase-grid-small">
            <div className="phase-card phase-card-small">
              <h4>Begin the Process</h4>
              <p>Direction Finding + Territory Mapping. Decide from there.</p>
            </div>
            <div className="phase-card phase-card-small">
              <h4>Full RCO formation</h4>
              <p>The complete 5-phase journey to a legally formed organism.</p>
            </div>
            <div className="phase-card phase-card-small">
              <h4>Sponsor an ecosystem</h4>
              <p>A philanthropic path. Fund the formation of an RCO for someone who has the passion and energy to give their life to it, but not the capital to begin. You hold the door open; they walk through it.</p>
              <details className="sponsor-details">
                <summary>See RCO questions our world needs</summary>
                <ul className="sponsor-examples">
                  <li>&ldquo;What would food look like if the soil were the shareholder?&rdquo;</li>
                  <li>&ldquo;How do we raise children in a world that&apos;s forgotten how to be a village?&rdquo;</li>
                  <li>&ldquo;What does end-of-life care look like when death is no longer the enemy?&rdquo;</li>
                  <li>&ldquo;How do we rebuild trust between humans and the rivers we&apos;ve poisoned?&rdquo;</li>
                  <li>&ldquo;What happens to a town when the factory leaves and no one comes to save it?&rdquo;</li>
                  <li>&ldquo;How do we care for the incarcerated as if they were our own kin?&rdquo;</li>
                  <li>&ldquo;What does it mean to grieve together in a culture that hides from loss?&rdquo;</li>
                  <li>&ldquo;How do we return the forests to the people who know how to listen to them?&rdquo;</li>
                  <li>&ldquo;What kind of medicine does a lonely generation actually need?&rdquo;</li>
                  <li>&ldquo;How do veterans come home to a country that doesn&apos;t know what home is anymore?&rdquo;</li>
                </ul>
              </details>
            </div>
          </div>

          <a href="https://business-30.vercel.app/" target="_blank" rel="noopener noreferrer" className="implementer-cta">Explore Business 3.0</a>
        </div>
      </section>

      {/* ===== STRATEGIC PARTNERS ===== */}
      <section id="partner" className="partners">
        <span className="investors-eyebrow">For strategic partners</span>
        <h2 className="explainer-title">Bring the RCO process to your region.</h2>
        <p className="explainer-body">
          We&apos;re looking for strategic partners who want to take the RCO process into their own part of the world and adapt it to local needs. Become a <strong>Business 3.0 Guide</strong> and get trained to lead organizations through RCO discovery and formation in your own ecosystem.
        </p>
        <PartnerForm />
      </section>

      {/* ===== READINESS ASSESSMENT ===== */}
      <div id="readiness">
        <PathAssessment />
      </div>

      {/* ===== INVESTORS ===== */}
      <section id="invest" className="investors">
        <span className="investors-eyebrow">For investors</span>
        <h2 className="explainer-title">Invest in the US RCOs already forming.</h2>
        <p className="explainer-body">
          The RCO isn&apos;t anti-profit &mdash; it&apos;s anti-extraction. Two RCOs are taking shape in the United States right now. Each one is exploring its own guiding question, building its own dual-entity structure, and opening its first round to early aligned investors. You can express interest in one or both.
        </p>

        <div className="invest-grid">
          <div className="invest-card">
            <span className="invest-card-tag invest-card-tag-live">Live &middot; raising</span>
            <h3>J.O.B. &mdash; The Joy of Being</h3>
            <p className="invest-card-question">&ldquo;What happens when being human is the only job left?&rdquo;</p>
            <p>The first US RCO. Building infrastructure for the human economy that&apos;s replacing the old one. Raising via Wefunder + private leads.</p>
            <a href="https://itsthejob.com" target="_blank" rel="noopener noreferrer" className="invest-card-link">itsthejob.com →</a>
          </div>
          <div className="invest-card">
            <span className="invest-card-tag">Forming</span>
            <h3>Dogcultr</h3>
            <p className="invest-card-question">&ldquo;What kind of world do dogs want to live in?&rdquo;</p>
            <p>An emerging US RCO joining J.O.B. in bringing the dual-entity model to a new ecosystem. The for-profit side will house conscious companies that honor dog sentience &mdash; dog doulas, psychedelics for dogs, journey guides. The nonprofit side: a dog church without the dogma.</p>
          </div>
        </div>

        <h3 className="explainer-subtitle invest-form-title">Express your interest</h3>
        <p className="explainer-body invest-form-intro">
          Tell us a little about you and which RCO(s) you&apos;re drawn to. We&apos;ll be in touch to start a real conversation &mdash; no pressure, no PDF blast.
        </p>
        <InvestForm />
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
