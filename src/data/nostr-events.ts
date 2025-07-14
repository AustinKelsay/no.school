/**
 * Nostr event mock data
 * Contains NIP-51 course lists, NIP-23 free content, and NIP-99 paid content
 * Based on content_data_models.md structure
 */

import type { 
  NostrCourseListEvent, 
  NostrFreeContentEvent, 
  NostrPaidContentEvent
} from './types'

// ============================================================================
// MOCK INSTRUCTOR PUBKEYS
// ============================================================================

export const mockInstructorPubkeys = {
  alexJohnson: '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e',
  mariaSantos: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
  davidWilson: '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa',
  sarahLee: '82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2',
  mikeTaylor: '91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3'
}

// ============================================================================
// NIP-51 COURSE LIST EVENTS (kind 30001)
// ============================================================================

export const nostrCourseListEvents: NostrCourseListEvent[] = [
  {
    id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
    pubkey: mockInstructorPubkeys.alexJohnson,
    created_at: 1705315200, // 2024-01-15T10:00:00Z
    kind: 30001, // NIP-51 list
    content: '', // Empty for lists
    tags: [
      ['d', 'bitcoin-lightning-dev'],
      ['title', 'Bitcoin & Lightning Protocol Development'],
      ['description', 'Deep dive into Bitcoin protocol development and Lightning Network implementation. Learn how to build on the most secure blockchain network.'],
      ['image', '/images/courses/bitcoin-dev.jpg'],
      ['published_at', '1705315200'],
      ['l', 'bitcoin'],
      ['t', 'bitcoin'],
      ['t', 'lightning'],
      ['t', 'development'],
      // Resource references (lessons) - naddr format
      ['a', '30023:' + mockInstructorPubkeys.alexJohnson + ':bitcoin-fundamentals'],
      ['a', '30023:' + mockInstructorPubkeys.alexJohnson + ':lightning-basics'],
      ['a', '30402:' + mockInstructorPubkeys.alexJohnson + ':advanced-bitcoin-dev']
    ],
    sig: 'signature1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12'
  },
  {
    id: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
    pubkey: mockInstructorPubkeys.mariaSantos,
    created_at: 1704974400, // 2024-01-11T09:00:00Z
    kind: 30001, // NIP-51 list
    content: '', // Empty for lists
    tags: [
      ['d', 'nostr-protocol-dev'],
      ['title', 'Nostr Protocol Development'],
      ['description', 'Build decentralized applications on the Nostr protocol. Learn about relays, clients, and the core concepts of censorship-resistant communication.'],
      ['image', '/images/courses/nostr-dev.jpg'],
      ['published_at', '1704974400'],
      ['l', 'nostr'],
      ['t', 'nostr'],
      ['t', 'development'],
      ['t', 'decentralized'],
      // Resource references (lessons) - naddr format
      ['a', '30023:' + mockInstructorPubkeys.mariaSantos + ':nostr-fundamentals'],
      ['a', '30023:' + mockInstructorPubkeys.mariaSantos + ':relay-development'],
      ['a', '30402:' + mockInstructorPubkeys.mariaSantos + ':advanced-nostr-patterns']
    ],
    sig: 'signature2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef2345678901bcdef23'
  }
]

// ============================================================================
// NIP-23 FREE CONTENT EVENTS (kind 30023)
// ============================================================================

export const nostrFreeContentEvents: NostrFreeContentEvent[] = [
  // Free lesson: Bitcoin Fundamentals
  {
    id: 'f1r2e3e4c5o6n7t8e9n0t1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2',
    pubkey: mockInstructorPubkeys.alexJohnson,
    created_at: 1705401600, // 2024-01-16T10:00:00Z
    kind: 30023, // NIP-23 long-form content
    content: `# Bitcoin Fundamentals

## Introduction to Bitcoin

Bitcoin is a peer-to-peer electronic cash system that allows online payments to be sent directly from one party to another without going through a financial institution.

### Key Concepts

- **Blockchain**: A distributed ledger technology
- **Proof of Work**: The consensus mechanism
- **UTXO Model**: Unspent Transaction Output model
- **Private Keys**: Your digital signature

## Getting Started

To start developing with Bitcoin, you'll need:

1. Basic understanding of cryptography
2. Knowledge of hashing functions
3. Understanding of digital signatures
4. Familiarity with peer-to-peer networks

## Next Steps

In the next lesson, we'll explore Lightning Network basics and how it extends Bitcoin's capabilities.`,
    tags: [
      ['d', 'bitcoin-fundamentals'],
      ['title', 'Bitcoin Fundamentals'],
      ['summary', 'Learn the core concepts of Bitcoin including blockchain, proof of work, and the UTXO model.'],
      ['published_at', '1705401600'],
      ['t', 'bitcoin'],
      ['t', 'fundamentals'],
      ['t', 'blockchain'],
      ['image', '/images/lessons/bitcoin-fundamentals.jpg']
    ],
    sig: 'signature3456789012cdef3456789012cdef3456789012cdef3456789012cdef3456789012cdef3456789012cdef3456789012cdef3456789012cdef3456789012cdef34'
  },
  // Free lesson: Lightning Network Basics
  {
    id: 'f2r3e4e5c6o7n8t9e0n1t2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3',
    pubkey: mockInstructorPubkeys.alexJohnson,
    created_at: 1705488000, // 2024-01-17T10:00:00Z
    kind: 30023, // NIP-23 long-form content
    content: `# Lightning Network Basics

## What is Lightning Network?

The Lightning Network is a "layer 2" payment protocol that operates on top of a blockchain-based cryptocurrency. It enables fast transactions between participating nodes.

### Key Features

- **Instant Payments**: Lightning-fast blockchain payments
- **Scalability**: Capable of millions to billions of transactions per second
- **Low Cost**: Fees are typically a fraction of blockchain fees
- **Cross Blockchains**: Atomic swaps can occur across different blockchains

## How It Works

1. **Channel Opening**: Two parties create a multisig wallet
2. **Off-chain Transactions**: Parties can transact without broadcasting to blockchain
3. **Channel Closing**: Final state is broadcast to blockchain

## Payment Channels

Payment channels are the foundation of Lightning Network. They allow two parties to conduct multiple transactions without publishing each one to the blockchain.

### Channel Lifecycle

1. **Funding**: Channel is opened with initial funding
2. **Operation**: Parties exchange signed transactions
3. **Closing**: Final state is settled on-chain

## Routing

Lightning Network uses onion routing to find paths between nodes, enabling payments between parties who don't have direct channels.`,
    tags: [
      ['d', 'lightning-basics'],
      ['title', 'Lightning Network Basics'],
      ['summary', 'Understanding Lightning Network fundamentals, payment channels, and routing.'],
      ['published_at', '1705488000'],
      ['t', 'lightning'],
      ['t', 'payments'],
      ['t', 'scaling'],
      ['image', '/images/lessons/lightning-basics.jpg']
    ],
    sig: 'signature4567890123def4567890123def4567890123def4567890123def4567890123def4567890123def4567890123def4567890123def4567890123def4567890123def45'
  },
  // Free document: Nostr Protocol Guide
  {
    id: 'f3r4e5e6c7o8n9t0e1n2t3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4',
    pubkey: mockInstructorPubkeys.mariaSantos,
    created_at: 1705574400, // 2024-01-18T10:00:00Z
    kind: 30023, // NIP-23 long-form content
    content: `# Nostr Protocol Guide

## What is Nostr?

Nostr (Notes and Other Stuff Transmitted by Relays) is a simple, open protocol that enables global, decentralized, and censorship-resistant social media.

### Core Concepts

- **Events**: The basic unit of data in Nostr
- **Relays**: Servers that store and forward events
- **Clients**: Applications that create and consume events
- **Keys**: Your identity in the Nostr network

## Event Structure

All data in Nostr is stored as events. Each event has:

\`\`\`json
{
  "id": "event_id",
  "pubkey": "author_pubkey",
  "created_at": 1234567890,
  "kind": 1,
  "tags": [],
  "content": "Hello, Nostr!",
  "sig": "signature"
}
\`\`\`

## Event Kinds

Different event kinds serve different purposes:

- **Kind 0**: User metadata
- **Kind 1**: Text notes
- **Kind 2**: Recommend relay
- **Kind 3**: Contacts
- **Kind 4**: Direct messages
- **Kind 5**: Event deletion

## Relays

Relays are simple servers that accept events from clients and forward them to other clients. They implement a simple WebSocket API.

### Relay Commands

- **REQ**: Request events
- **EVENT**: Send events
- **CLOSE**: Close subscription

## Getting Started

To start building with Nostr:

1. Generate a key pair
2. Choose relays to connect to
3. Create and publish events
4. Subscribe to events from others`,
    tags: [
      ['d', 'nostr-protocol-guide'],
      ['title', 'Nostr Protocol Guide'],
      ['summary', 'Complete guide to understanding and implementing the Nostr protocol.'],
      ['published_at', '1705574400'],
      ['t', 'nostr'],
      ['t', 'protocol'],
      ['t', 'guide'],
      ['t', 'document'],
      ['image', '/images/documents/nostr-guide.jpg']
    ],
    sig: 'signature5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef5678901234ef56'
  },
  // Free video: Bitcoin Transaction Tutorial
  {
    id: 'f4r5e6e7c8o9n0t1e2n3t4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5',
    pubkey: mockInstructorPubkeys.alexJohnson,
    created_at: 1705660800, // 2024-01-19T10:00:00Z
    kind: 30023, // NIP-23 long-form content
    content: `# Bitcoin Transaction Deep Dive

## Visual Learning Experience

This video tutorial provides a comprehensive visual explanation of how Bitcoin transactions work, from creation to confirmation on the blockchain.

## What You'll Learn

- How Bitcoin transactions are structured
- The UTXO (Unspent Transaction Output) model
- Digital signatures and verification
- Transaction fees and prioritization
- Block confirmation process

## Video Content

*Duration: 25 minutes 30 seconds*

### Chapters

1. **Introduction** (0:00-2:30)
2. **Transaction Structure** (2:30-8:00)
3. **UTXO Model Explained** (8:00-15:00)
4. **Digital Signatures** (15:00-20:00)
5. **Confirmation Process** (20:00-25:30)

## Prerequisites

- Basic understanding of cryptography
- Familiarity with Bitcoin basics
- Interest in technical details

## Resources

- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Developer Documentation](https://developer.bitcoin.org/)
- [Block Explorer](https://blockstream.info/)

## Next Steps

After watching this video, you'll be ready to explore Lightning Network payments and how they build on Bitcoin's foundation.`,
    tags: [
      ['d', 'bitcoin-transaction-tutorial'],
      ['title', 'Bitcoin Transaction Deep Dive'],
      ['summary', 'Visual explanation of Bitcoin transactions, UTXO model, and confirmation process.'],
      ['published_at', '1705660800'],
      ['t', 'bitcoin'],
      ['t', 'transactions'],
      ['t', 'video'],
      ['t', 'tutorial'],
      ['duration', '25:30'],
      ['r', '/videos/bitcoin-transaction-tutorial.mp4'],
      ['image', '/images/videos/bitcoin-transaction-thumb.jpg']
    ],
    sig: 'signature6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f6789012345f67'
  }
]

// ============================================================================
// NIP-99 PAID CONTENT EVENTS (kind 30402)
// ============================================================================

export const nostrPaidContentEvents: NostrPaidContentEvent[] = [
  // Paid lesson: Advanced Bitcoin Development
  {
    id: 'p1a2i3d4c5o6n7t8e9n0t1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2',
    pubkey: mockInstructorPubkeys.alexJohnson,
    created_at: 1705747200, // 2024-01-20T10:00:00Z
    kind: 30402, // NIP-99 classified listing
    content: `# Advanced Bitcoin Development

## Professional Bitcoin Development Mastery

This advanced course takes you deep into Bitcoin Core development, covering topics that professional Bitcoin developers need to know.

## Premium Content Includes

### Advanced Topics
- **Custom Script Development**: Create complex Bitcoin scripts
- **Segregated Witness**: Advanced SegWit implementation
- **Lightning Network Integration**: Connect Bitcoin to Lightning
- **Security Best Practices**: Professional security patterns
- **Performance Optimization**: Scalable Bitcoin applications

### Practical Projects
1. **Multi-signature Wallet**: Build a production-ready multisig wallet
2. **Payment Processor**: Create a Bitcoin payment processing system
3. **Lightning Node**: Set up and manage Lightning Network nodes
4. **Script Interpreter**: Build a Bitcoin script interpreter

### Expert Guidance
- Direct access to instructor for questions
- Code reviews for your projects
- Industry best practices and patterns
- Real-world case studies

## Prerequisites

- Completion of Bitcoin Fundamentals (free)
- Experience with JavaScript/Node.js
- Basic understanding of cryptography
- Familiarity with command line tools

## Course Materials

- 15 hours of video content
- 50+ code examples
- Production-ready templates
- Testing frameworks
- Deployment guides

## Certificate

Upon completion, you'll receive a Nostr-verifiable certificate of completion that proves your advanced Bitcoin development skills.`,
    tags: [
      ['d', 'advanced-bitcoin-dev'],
      ['title', 'Advanced Bitcoin Development'],
      ['summary', 'Professional-level Bitcoin development including custom scripts, multisig, and Lightning integration.'],
      ['published_at', '1705747200'],
      ['price', '25000', 'sats'],
      ['t', 'bitcoin'],
      ['t', 'advanced'],
      ['t', 'development'],
      ['t', 'professional'],
      ['image', '/images/lessons/advanced-bitcoin-dev.jpg']
    ],
    sig: 'signature7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f7890123456f78'
  },
  // Paid document: Bitcoin Script Programming Reference
  {
    id: 'p2a3i4d5c6o7n8t9e0n1t2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3',
    pubkey: mockInstructorPubkeys.davidWilson,
    created_at: 1705833600, // 2024-01-21T10:00:00Z
    kind: 30402, // NIP-99 classified listing
    content: `# Bitcoin Script Programming Reference

## The Complete Bitcoin Script Manual

This comprehensive reference manual covers everything you need to know about Bitcoin Script programming, from basic operations to advanced patterns.

## What's Included

### Complete Opcode Reference
- **Arithmetic Operations**: OP_ADD, OP_SUB, OP_MUL, OP_DIV
- **Bitwise Operations**: OP_AND, OP_OR, OP_XOR, OP_NOT
- **Cryptographic Operations**: OP_HASH160, OP_CHECKSIG, OP_CHECKMULTISIG
- **Flow Control**: OP_IF, OP_ELSE, OP_ENDIF, OP_RETURN
- **Stack Operations**: OP_DUP, OP_SWAP, OP_ROT, OP_DROP

### Advanced Script Patterns
- **Multi-signature Scripts**: 2-of-3, 3-of-5, and custom patterns
- **Time-locked Scripts**: OP_CHECKLOCKTIMEVERIFY patterns
- **Hash-locked Scripts**: Payment channels and atomic swaps
- **Conditional Scripts**: Complex conditional logic
- **Covenant Scripts**: Restricting how coins can be spent

### Real-World Examples
- **Escrow Services**: Trustless escrow implementations
- **Decentralized Exchanges**: Atomic swap mechanisms
- **Payment Channels**: Lightning Network script patterns
- **Oracles**: External data integration
- **Inheritance**: Time-locked inheritance patterns

### Security Considerations
- **Script Vulnerabilities**: Common attack vectors
- **Testing Frameworks**: Script validation tools
- **Debugging Techniques**: Script analysis methods
- **Best Practices**: Industry-standard patterns

## Bonus Materials

- **Interactive Script Debugger**: Web-based script testing tool
- **Code Templates**: Production-ready script templates
- **Video Walkthroughs**: Visual explanations of complex scripts
- **Community Access**: Private Discord for advanced developers

## Perfect For

- Bitcoin developers building custom applications
- Lightning Network developers
- Security researchers
- Blockchain architects
- Anyone serious about Bitcoin programming`,
    tags: [
      ['d', 'bitcoin-script-reference'],
      ['title', 'Bitcoin Script Programming Reference'],
      ['summary', 'Complete reference manual for Bitcoin Script programming with advanced patterns and real-world examples.'],
      ['published_at', '1705833600'],
      ['price', '15000', 'sats'],
      ['t', 'bitcoin'],
      ['t', 'script'],
      ['t', 'programming'],
      ['t', 'reference'],
      ['t', 'document'],
      ['image', '/images/documents/bitcoin-script-ref.jpg']
    ],
    sig: 'signature8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f8901234567f89'
  },
  // Paid video: Lightning Network Node Management
  {
    id: 'p3a4i5d6c7o8n9t0e1n2t3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4',
    pubkey: mockInstructorPubkeys.sarahLee,
    created_at: 1705920000, // 2024-01-22T10:00:00Z
    kind: 30402, // NIP-99 classified listing
    content: `# Lightning Network Node Management

## Professional Lightning Node Operations

Master the art of running production Lightning Network nodes with this comprehensive video course covering everything from setup to advanced management.

## Video Course Contents

### Part 1: Foundation Setup (30 minutes)
- **Node Types**: LND, c-lightning, and Eclair comparison
- **Hardware Requirements**: Optimal configurations
- **Security Setup**: Key management and backup strategies
- **Initial Configuration**: Network settings and optimization

### Part 2: Channel Management (45 minutes)
- **Channel Opening**: Strategic channel selection
- **Liquidity Management**: Balancing inbound and outbound
- **Fee Optimization**: Dynamic fee strategies
- **Channel Monitoring**: Health checks and alerts

### Part 3: Routing and Revenue (40 minutes)
- **Routing Strategies**: Becoming a successful routing node
- **Revenue Optimization**: Fee strategies and positioning
- **Network Analysis**: Finding profitable routes
- **Automation Tools**: Scripting and management tools

### Part 4: Advanced Operations (35 minutes)
- **Multi-node Management**: Scaling your operations
- **API Integration**: Building custom management tools
- **Monitoring Systems**: Professional-grade monitoring
- **Disaster Recovery**: Backup and recovery procedures

### Part 5: Troubleshooting (25 minutes)
- **Common Issues**: Channel force closes, stuck payments
- **Debugging Tools**: Log analysis and diagnostic tools
- **Network Problems**: Connectivity and sync issues
- **Recovery Procedures**: Emergency protocols

## Bonus Content

- **Management Scripts**: Production-ready automation scripts
- **Monitoring Dashboard**: Custom Grafana dashboards
- **Alert Systems**: Telegram and email notifications
- **Community Access**: Private group for node operators

## Prerequisites

- Basic understanding of Lightning Network
- Linux command line experience
- Bitcoin node operation experience
- Understanding of networking basics

## What You'll Achieve

By the end of this course, you'll be able to:
- Run a profitable Lightning routing node
- Manage multiple nodes efficiently
- Troubleshoot complex issues
- Optimize for maximum revenue
- Build custom management tools

## Perfect For

- Lightning Network node operators
- Bitcoin service providers
- Fintech developers
- Cryptocurrency exchanges
- Anyone running Lightning infrastructure`,
    tags: [
      ['d', 'lightning-node-management'],
      ['title', 'Lightning Network Node Management'],
      ['summary', 'Professional Lightning Network node operations including setup, management, and optimization.'],
      ['published_at', '1705920000'],
      ['price', '35000', 'sats'],
      ['duration', '2:55:00'],
      ['t', 'lightning'],
      ['t', 'node'],
      ['t', 'management'],
      ['t', 'video'],
      ['t', 'professional'],
      ['r', '/videos/lightning-node-management.mp4'],
      ['image', '/images/videos/lightning-node-thumb.jpg']
    ],
    sig: 'signature9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f9012345678f90'
  }
]

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const allNostrEvents = [
  ...nostrCourseListEvents,
  ...nostrFreeContentEvents,
  ...nostrPaidContentEvents
]

export const nostrEventsByKind = {
  courseList: nostrCourseListEvents,
  freeContent: nostrFreeContentEvents,
  paidContent: nostrPaidContentEvents
}