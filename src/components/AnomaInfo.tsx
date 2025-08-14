import React from 'react';

const AnomaInfo: React.FC = () => {
  return (
    <div className="bg-anoma-black text-anoma-white p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-mono font-bold text-anoma-white uppercase tracking-wider mb-6">
          ANOMA NETWORK
        </h1>
        <p className="text-xl text-anoma-white/80 font-sans">
          An Architectural Analysis of the Intent-Centric Operating System for Web3
        </p>
      </div>

      {/* Executive Summary */}
      <section className="mb-12">
        <h2 className="text-3xl font-mono font-bold text-anoma-red mb-6 uppercase tracking-wider">
          I. Executive Summary
        </h2>
        <div className="space-y-4 text-anoma-white/90 font-sans">
          <p>
            Anoma represents a fundamental architectural paradigm shift in blockchain design, moving from the imperative, 
            transaction-centric execution model of Virtual Machines (VMs) to a declarative, intent-centric model embodied 
            by its "Intent Machine" (IM).
          </p>
          <p>
            The project's core thesis is to serve as the universal operating system for Web3, directly addressing the 
            critical, systemic problems of state fragmentation, poor user experience, and inefficient cross-chain 
            coordination that currently plague the decentralized ecosystem.
          </p>
          <p>
            The key innovation of Anoma is its unified architecture for full-stack decentralized applications, which 
            it achieves by vertically integrating decentralized counterparty discovery, solving, and atomic multi-chain 
            settlement into a single, cohesive protocol.
          </p>
        </div>
      </section>

      {/* Core Innovation */}
      <section className="mb-12">
        <h2 className="text-3xl font-mono font-bold text-anoma-lime mb-6 uppercase tracking-wider">
          Core Innovation
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-4">Intent-Centric Design</h3>
            <p className="text-anoma-white/80">
              Users express desired outcomes as "intents" - high-level statements of preference without specifying 
              exact execution paths. Specialized agents called "solvers" find optimal execution routes.
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-4">Fractal Scaling</h3>
            <p className="text-anoma-white/80">
              Allows creation of customizable, parallel blockchains called fractal instances. Each instance can have 
              its own security model while maintaining interoperability.
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-4">Multi-Asset Shielded Pool (MASP)</h3>
            <p className="text-anoma-white/80">
              Asset-agnostic privacy using advanced zero-knowledge cryptography. Single unified privacy set for all 
              asset types across multiple chains.
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-4">Anoma Resource Machine (ARM)</h3>
            <p className="text-anoma-white/80">
              Declarative state transition engine that verifies state changes against validity predicates, making 
              applications "safer by construction."
            </p>
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="mb-12">
        <h2 className="text-3xl font-mono font-bold text-anoma-red mb-6 uppercase tracking-wider">
          Founding Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray text-center">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-2">Christopher Goes</h3>
            <p className="text-anoma-white/80 text-sm mb-2">Lead, IBC @ Tendermint</p>
            <p className="text-anoma-white/70 text-xs">
              Principal architect of the industry-standard interoperability protocol (IBC). 
              Deep expertise in distributed systems and protocol design.
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray text-center">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-2">Awa Sun Yin</h3>
            <p className="text-anoma-white/80 text-sm mb-2">Researcher @ Tendermint, Data Scientist @ Chainalysis</p>
            <p className="text-anoma-white/70 text-xs">
              Expertise in on-chain data analysis, privacy, cryptography, and consensus algorithms. 
              President of the Anoma Foundation.
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray text-center">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-2">Adrian Brink</h3>
            <p className="text-anoma-white/80 text-sm mb-2">Core Protocol Engineer @ Tendermint/Cosmos</p>
            <p className="text-anoma-white/70 text-xs">
              Deep technical expertise in building the core Cosmos stack, consensus engines, 
              and proof-of-stake systems.
            </p>
          </div>
        </div>
      </section>

      {/* Funding & Investors */}
      <section className="mb-12">
        <h2 className="text-3xl font-mono font-bold text-anoma-lime mb-6 uppercase tracking-wider">
          Funding & Strategic Investors
        </h2>
        <div className="bg-anoma-gray/20 p-6 border border-anoma-gray">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-mono font-bold text-anoma-white mb-2">
              Total Raised: $60+ Million
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-mono font-bold text-anoma-white mb-3">Lead Investors</h4>
              <ul className="space-y-2 text-anoma-white/80">
                <li>• Polychain Capital</li>
                <li>• CMCC Global</li>
                <li>• Electric Capital</li>
                <li>• Delphi Digital</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-mono font-bold text-anoma-white mb-3">Notable Participants</h4>
              <ul className="space-y-2 text-anoma-white/80">
                <li>• Coinbase Ventures</li>
                <li>• The Spartan Group</li>
                <li>• KR1</li>
                <li>• Dialectic</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="mb-12">
        <h2 className="text-3xl font-mono font-bold text-anoma-red mb-6 uppercase tracking-wider">
          Technical Architecture
        </h2>
        <div className="space-y-6">
          <div className="bg-anoma-gray/20 p-6 border border-anoma-gray">
            <h3 className="text-xl font-mono font-bold text-anoma-white mb-3">Intent Lifecycle</h3>
            <div className="grid md:grid-cols-5 gap-4 text-center">
              <div className="bg-anoma-black/50 p-3 border border-anoma-gray">
                <div className="text-anoma-lime font-mono font-bold">1</div>
                <div className="text-xs text-anoma-white/80 mt-1">Intent Expression</div>
              </div>
              <div className="bg-anoma-black/50 p-3 border border-anoma-gray">
                <div className="text-anoma-lime font-mono font-bold">2</div>
                <div className="text-xs text-anoma-white/80 mt-1">Intent Gossip</div>
              </div>
              <div className="bg-anoma-black/50 p-3 border border-anoma-gray">
                <div className="text-anoma-lime font-mono font-bold">3</div>
                <div className="text-xs text-anoma-white/80 mt-1">Discovery & Solving</div>
              </div>
              <div className="bg-anoma-black/50 p-3 border border-anoma-gray">
                <div className="text-anoma-lime font-mono font-bold">4</div>
                <div className="text-xs text-anoma-white/80 mt-1">Transaction Submission</div>
              </div>
              <div className="bg-anoma-black/50 p-3 border border-anoma-gray">
                <div className="text-anoma-lime font-mono font-bold">5</div>
                <div className="text-xs text-anoma-white/80 mt-1">Consensus & Execution</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-12">
        <h2 className="text-3xl font-mono font-bold text-anoma-lime mb-6 uppercase tracking-wider">
          Development Roadmap
        </h2>
        <div className="space-y-4">
          <div className="bg-anoma-gray/20 p-4 border border-anoma-gray">
            <h3 className="text-lg font-mono font-bold text-anoma-white mb-2">
              Phase 1: Ethereum Ecosystem Integration
            </h3>
            <p className="text-anoma-white/80">
              Deploy "Anoma protocol adapter" to Ethereum mainnet and key L2s, enabling settlement of Anoma intents 
              using Ethereum's security and existing liquidity (nicknamed "Resource Plasma").
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-4 border border-anoma-gray">
            <h3 className="text-lg font-mono font-bold text-anoma-white mb-2">
              Phase 2: Multi-Chain Expansion
            </h3>
            <p className="text-anoma-white/80">
              Roll out support for additional chains and ecosystems. Introduce advanced functionalities including 
              private solving, FHE, MPC, and Chimera chains.
            </p>
          </div>
          <div className="bg-anoma-gray/20 p-4 border border-anoma-gray">
            <h3 className="text-lg font-mono font-bold text-anoma-white mb-2">
              Future: Native Consensus & Token
            </h3>
            <p className="text-anoma-white/80">
              Launch native on-demand consensus mechanism and native token, enabling fully sovereign settlement 
              for fractal instances with custom security models.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="text-center">
        <h2 className="text-3xl font-mono font-bold text-anoma-red mb-6 uppercase tracking-wider">
          Vision & Impact
        </h2>
        <div className="bg-anoma-gray/20 p-8 border border-anoma-gray">
          <p className="text-lg text-anoma-white/90 font-sans mb-4">
            Anoma is a project of profound ambition, born from a first-principles re-evaluation of the core 
            architecture of decentralized networks. It is not an incremental improvement on existing designs but 
            a radical reimagining of how users and applications should coordinate in a trust-minimized environment.
          </p>
          <p className="text-lg text-anoma-white/90 font-sans">
            By elevating the "intent" to a first-class primitive, Anoma seeks to solve the deeply entrenched 
            problems of user experience, cross-chain fragmentation, and the parasitic effects of MEV at their 
            structural root.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AnomaInfo; 