'use client';

import { useState } from 'react';

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
        desc: 'Studying what happens when humans deprogramm. Publishing findings. Building the evidence base for a new way of being. The organism documents its own evolution.',
      },
    ],
  },
};

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
        {open && item.desc && (
          <div className="node-desc">{item.desc}</div>
        )}
        {!open && item.desc && (
          <div className="node-hint">Click to explore</div>
        )}
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

export default function Home() {
  return (
    <div className="page">
      <header className="header">
        <p className="header-eyebrow">Regenerative Community Organism</p>
        <h1 className="header-title">How we structure J.O.B.</h1>
        <p className="header-sub">
          Not a company, an organism. Sovereign entities, in regenerative relationship with one another, each uniquely exploring the same question:
        </p>
        <p className="header-question">
          What happens when being human IS the job?
        </p>
        <p className="header-sub">
          Click anything to explore.
        </p>
      </header>

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

      <footer className="footer">
        <p>The organism is growing. <a href="https://itsthejob.vercel.app" target="_blank" rel="noopener noreferrer">itsthejob.vercel.app</a></p>
      </footer>
    </div>
  );
}
