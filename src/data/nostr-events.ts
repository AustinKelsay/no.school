/**
 * Nostr event mock data
 * Real Nostr events matching content_data_models.md examples
 * NIP-51 course lists (kind 30004), NIP-23 free content (kind 30023), NIP-99 paid content (kind 30402)
 */

import type {
  NostrCourseListEvent,
  NostrFreeContentEvent,
  NostrPaidContentEvent,
} from "./types";

// ============================================================================
// REAL PUBKEYS (matching content_data_models.md examples)
// ============================================================================

export const realPubkeys = {
  austinKelsay:
    "f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741",
  alexJohnson:
    "7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e",
  mariaSantos:
    "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d",
  davidWilson:
    "67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa",
  sarahLee: "82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2",
  mikeTaylor:
    "91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3",
  sarahChen: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  mikeRodriguez:
    "b2c3d4e5f678901234567890123456789012345678901234567890abcdef1234",
  lisaPark: "c3d4e5f6789012345678901234567890123456789012345678901234567890ab",
  davidKim: "d4e5f6789012345678901234567890123456789012345678901234567890abcd",
  emilyWatson:
    "e5f6789012345678901234567890123456789012345678901234567890abcdef",
  jackMorrison:
    "f6789012345678901234567890123456789012345678901234567890abcdef12",
  annaLee: "789012345678901234567890123456789012345678901234567890abcdef1234",
};

// ============================================================================
// NIP-51 COURSE LIST EVENTS (kind 30004) - CORRECTED FROM content_data_models.md
// ============================================================================

export const nostrCourseListEvents: NostrCourseListEvent[] = [
  // PlebDevs Starter Course (real example from content_data_models.md)
  {
    id: "d2797459e3f15491b39225a68146d3ec375f71d01b57cfe3a559179777e20912",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740860353,
    kind: 30004,
    content: "",
    tags: [
      ["d", "f538f5c5-1a72-4804-8eb1-3f05cea64874"],
      ["name", "PlebDevs Starter Course"],
      [
        "about",
        "Welcome to the PlebDevs starter course! I'm Austin, the founder of PlebDevs, and I'm here to guide you through your journey from complete beginner to capable developer. This course is specifically designed for those new to coding, though we have plenty of intermediate and advanced content available on the platform for when you're ready to level up. \n\nIn this starter course we cover: \n1. Setting up your Code Editor, \n2. Git / Github \n3. HTML \n4. CSS \n5. JavaScript. \n\nStarter Course Objectives:\n1. Provide an easy-to-follow overview of the developer journey\n2. Get you comfortable in a development environment\n3. Give you hands-on experience with core programming languages\n4. Get you setup for the PlebDevs Frontend & Backend Courses and the rest of the content on the platform.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/plebdevs-starter.png",
      ],
      ["t", "beginner"],
      ["t", "frontend"],
      ["t", "course"],
      ["published_at", "1740860353"],
      [
        "a",
        "30023:f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741:6d8260b3-c902-46ec-8aed-f3b8c8f1229b",
      ],
      [
        "a",
        "30023:f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741:f93827ed-68ad-4b5e-af33-f7424b37f0d6",
      ],
      [
        "a",
        "30023:f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741:80aac9d4-8bef-4a92-9ee9-dea1c2d66c3a",
      ],
      [
        "a",
        "30023:f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741:6fe3cb4b-2571-4e3b-9159-db78325ee5cc",
      ],
      [
        "a",
        "30023:f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741:e5399c72-9b95-46d6-a594-498e673b6c58",
      ],
      [
        "a",
        "30023:f33c8a9617cb15f705fc70cd461cfd6eaf22f9e24c33eabad981648e5ec6f741:a3083ab5-0187-4b77-83d1-29ae1f644559",
      ],
    ],
    sig: "real_signature_from_content_data_models_example",
  },

  // Bitcoin & Lightning Protocol Development
  {
    id: "bitcoin-lightning-dev-course-event",
    pubkey: realPubkeys.alexJohnson,
    created_at: 1705315200,
    kind: 30004,
    content: "",
    tags: [
      ["d", "bitcoin-lightning-dev"],
      ["name", "Bitcoin & Lightning Protocol Development"],
      [
        "about",
        "Deep dive into Bitcoin protocol development and Lightning Network implementation. Learn how to build on the most secure blockchain network and create instant payment solutions. This comprehensive course covers Bitcoin scripting, transaction construction, Lightning channel management, and protocol-level development.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/bitcoin-dev.png",
      ],
      ["t", "bitcoin"],
      ["t", "lightning"],
      ["t", "development"],
      ["t", "intermediate"],
      ["published_at", "1705315200"],
      [
        "a",
        "30023:7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e:bitcoin-fundamentals",
      ],
      [
        "a",
        "30023:7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e:lightning-basics",
      ],
      [
        "a",
        "30402:7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e:advanced-bitcoin-dev",
      ],
    ],
    sig: "bitcoin_lightning_course_signature",
  },

  // Nostr Protocol Development
  {
    id: "nostr-protocol-dev-course-event",
    pubkey: realPubkeys.mariaSantos,
    created_at: 1704974400,
    kind: 30004,
    content: "",
    tags: [
      ["d", "nostr-protocol-dev"],
      ["name", "Nostr Protocol Development"],
      [
        "about",
        "Build decentralized applications on the Nostr protocol. Learn about relays, clients, and the core concepts of censorship-resistant communication. This course covers NIPs implementation, relay development, client architecture, and building social applications.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/nostr-dev.png",
      ],
      ["t", "nostr"],
      ["t", "development"],
      ["t", "intermediate"],
      ["published_at", "1704974400"],
      [
        "a",
        "30023:3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d:nostr-fundamentals",
      ],
      [
        "a",
        "30023:3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d:nostr-client-building",
      ],
      [
        "a",
        "30402:3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d:advanced-nostr-dev",
      ],
    ],
    sig: "nostr_protocol_course_signature",
  },

  // Frontend Development for Bitcoin Apps (paid course)
  {
    id: "frontend-bitcoin-apps-course-event",
    pubkey: realPubkeys.davidWilson,
    created_at: 1704806400,
    kind: 30004,
    content: "",
    tags: [
      ["d", "frontend-bitcoin-apps"],
      ["name", "Frontend Development for Bitcoin Apps"],
      [
        "about",
        "Learn to build beautiful, responsive frontend applications that interact with Bitcoin and Lightning Network. This course covers modern React patterns, state management, UI/UX best practices, and Bitcoin integration for web applications.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/frontend-bitcoin.png",
      ],
      ["t", "frontend"],
      ["t", "bitcoin"],
      ["t", "react"],
      ["t", "advanced"],
      ["published_at", "1704806400"],
      ["price", "18000", "sats"],
      [
        "a",
        "30402:67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa:react-bitcoin-integration",
      ],
      [
        "a",
        "30402:67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa:lightning-ui-components",
      ],
      [
        "a",
        "30402:67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa:bitcoin-wallet-ui",
      ],
    ],
    sig: "frontend_bitcoin_course_signature",
  },

  // Lightning API Integration (paid course)
  {
    id: "lightning-api-integration-course-event",
    pubkey: realPubkeys.sarahLee,
    created_at: 1704470400,
    kind: 30004,
    content: "",
    tags: [
      ["d", "lightning-api-integration"],
      ["name", "Lightning Network API Integration"],
      [
        "about",
        "Master Lightning Network API integration for payment processing, invoice generation, and channel management. This comprehensive course covers LND REST API, gRPC, webhooks, and building production-ready Lightning applications.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/lightning-api.png",
      ],
      ["t", "lightning"],
      ["t", "api"],
      ["t", "backend"],
      ["t", "advanced"],
      ["published_at", "1704470400"],
      ["price", "22000", "sats"],
      [
        "a",
        "30402:82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2:lightning-api-basics",
      ],
      [
        "a",
        "30402:82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2:payment-processing",
      ],
      [
        "a",
        "30402:82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2:webhook-integration",
      ],
    ],
    sig: "lightning_api_course_signature",
  },

  // Web3 Security Practices (paid course)
  {
    id: "web3-security-practices-course-event",
    pubkey: realPubkeys.mikeTaylor,
    created_at: 1704211200,
    kind: 30004,
    content: "",
    tags: [
      ["d", "web3-security-practices"],
      ["name", "Web3 Security Practices"],
      [
        "about",
        "Comprehensive security practices for blockchain and decentralized applications. Learn about smart contract auditing, key management, secure coding practices, and common vulnerabilities in Web3 applications.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/web3-security.png",
      ],
      ["t", "security"],
      ["t", "web3"],
      ["t", "blockchain"],
      ["t", "advanced"],
      ["published_at", "1704211200"],
      ["price", "28000", "sats"],
      [
        "a",
        "30402:91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3:smart-contract-security",
      ],
      [
        "a",
        "30402:91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3:key-management",
      ],
      [
        "a",
        "30402:91451f9928b7fecde3ca8g2f01bed062cf175bg26c0g55b10a0a3e9d3c9gbh7b3:vulnerability-assessment",
      ],
    ],
    sig: "web3_security_course_signature",
  },
];

// ============================================================================
// NIP-23 FREE CONTENT EVENTS (kind 30023) - Resources
// ============================================================================

export const nostrFreeContentEvents: NostrFreeContentEvent[] = [
  // Real example from content_data_models.md - Setting up Code Editor
  {
    id: "d3ac1f40bf07c045e97c43b6cbdf6f274de464d1c9d5a5c04d04d50fc12156c0",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740871522,
    kind: 30023,
    content: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;"><video style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" controls>
<source src="https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/starter-lesson-1.mp4" type="video/mp4"/>
<source src="https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/starter-lesson-1.webm" type="video/mp4"/>
</video></div>

# Setting Up Your Code Editor

## Introduction
In this lesson, we'll set up the most fundamental tool in your development journey: your code editor. This is where you'll spend most of your time writing, testing, and debugging code, so it's crucial to get comfortable with it from the start.

## What is an IDE?

### Definition
An IDE (Integrated Development Environment) is a software application that provides comprehensive facilities for software development. Think of it as your complete workshop for writing code.

### Key Components
1. **Code Editor**
   - Where you write and edit code
   - Provides syntax highlighting
   - Helps with code formatting
   - Makes code easier to read and write

2. **Compiler/Interpreter**
   - Runs your code
   - Translates your code into executable instructions
   - Helps test your applications

3. **Debugging Tools**
   - Help find and fix errors
   - Provide error messages and suggestions
   - Make problem-solving easier

## Setting Up Visual Studio Code

### Why VS Code?
- Free and open-source
- Lightweight yet powerful
- Excellent community support
- Popular among developers
- Great for beginners and experts alike

### Installation Steps
1. Visit [code.visualstudio.com](https://code.visualstudio.com)
2. Download the version for your operating system
3. Run the installer
4. Follow the installation prompts

### Essential VS Code Features

#### 1. Interface Navigation
- **File Explorer** (Ctrl/Cmd + Shift + E)
  - Browse and manage your files
  - Create new files and folders
  - Navigate your project structure

- **Search** (Ctrl/Cmd + Shift + F)
  - Find text across all files
  - Replace text globally
  - Search with regular expressions

- **Source Control** (Ctrl/Cmd + Shift + G)
  - Track changes in your code
  - Commit and manage versions
  - Integrate with Git

#### 2. Terminal Integration
To open the integrated terminal:
- Use \`\`\` Ctrl + \` \`\`\` (backtick)
- Or View → Terminal from the menu
- Basic terminal commands:
  \`\`\`bash
  ls      # List files (dir on Windows)
  cd      # Change directory
  clear   # Clear terminal
  code .  # Open VS Code in current directory
  \`\`\`

#### 3. Essential Extensions
Install these extensions to enhance your development experience:
1. **ESLint**
   - Helps find and fix code problems
   - Enforces coding standards
   - Improves code quality

2. **Prettier**
   - Automatically formats your code
   - Maintains consistent style
   - Saves time on formatting

3. **Live Server**
   - Runs your web pages locally
   - Auto-refreshes on save
   - Great for web development

### Important Keyboard Shortcuts
\`\`\`
Ctrl/Cmd + S          # Save file
Ctrl/Cmd + C          # Copy
Ctrl/Cmd + V          # Paste
Ctrl/Cmd + Z          # Undo
Ctrl/Cmd + Shift + P  # Command palette
Ctrl/Cmd + P          # Quick file open
\`\`\`

## Writing Your First Code
Let's create and run a simple HTML file:

1. Create a new file (\`index.html\`)
2. Add basic HTML content:
   \`\`\`html
   <h1>Hello World!</h1>
   \`\`\`
3. Save the file (Ctrl/Cmd + S)
4. Open in browser or use Live Server

## Best Practices

### 1. File Organization
- Keep related files together
- Use clear, descriptive names
- Create separate folders for different projects

### 2. Regular Saving
- Save frequently (Ctrl/Cmd + S)
- Watch for the unsaved dot indicator
- Enable auto-save if preferred

### 3. Terminal Usage
- Get comfortable with basic commands
- Use the integrated terminal
- Practice navigation and file operations

## Troubleshooting Common Issues

### 1. Installation Problems
- Ensure you have admin rights
- Check system requirements
- Use official download sources

### 2. Extension Issues
- Keep extensions updated
- Disable conflicting extensions
- Restart VS Code after installation

### 3. Performance
- Don't install too many extensions
- Regular restart of VS Code
- Keep your system updated

## Next Steps

1. **Practice Navigation**
   - Create and manage files
   - Use the integrated terminal
   - Try keyboard shortcuts

2. **Customize Your Editor**
   - Explore themes
   - Adjust font size
   - Configure auto-save

3. **Prepare for Next Lesson**
   - Keep VS Code open
   - Get comfortable with the interface
   - Practice basic operations

## Additional Resources
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Keyboard Shortcuts Reference](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- [VS Code Tips and Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

Remember: Your code editor is your primary tool as a developer. Take time to get comfortable with it, and don't worry about mastering everything at once. Focus on the basics we covered in the video, and you'll naturally learn more features as you need them.

Happy coding! 🚀`,
    tags: [
      ["title", "Setting up your Code Editor"],
      [
        "summary",
        "In this lesson, we'll set up the most fundamental tool in your development journey: your code editor. This is where you'll spend most of your time writing, testing, and debugging code, so it's crucial to get comfortable with it from the start.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/starter-thumbnail-1.png",
      ],
      ["d", "f93827ed-68ad-4b5e-af33-f7424b37f0d6"],
      ["t", "video"],
      ["t", "document"],
      ["t", "beginner"],
      [
        "r",
        "https://docs.google.com/presentation/d/1TC2BcHMa8zHVfAafwgXGEhUS5beTHUp5UsaPwWYty2w/edit?usp=sharing",
      ],
    ],
    sig: "380c060f8536549749f5d81bb052f218491b76f10544eaf3c255be3a21fad5bdeb65d89e9d28290b16d48134fc898008b14f6dc390a92cb23933ccdfb30dcc86",
  },

  // Real example from content_data_models.md - Lightning Workshop Video
  {
    id: "abd1b6682aaccbaf4260b0da05db07caa30977f663e33eb36eacc56d85e62fa7",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1751292222,
    kind: 30023,
    content: `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;"><iframe src="https://www.youtube.com/embed/M_tVo_9OUIs?enablejsapi=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`,
    tags: [
      ["d", "6e138ca7-fa4f-470c-9146-fec270a9688e"],
      ["title", "Build a Lightning Wallet in 20 Minutes"],
      [
        "summary",
        "Build a Lightning Wallet in just about 20 mins leveraging the FREE Voltage MutinyNet Lightning Node's to make it easier than ever to build on Bitcoin & Lightning and make REAL payments on a REAL network.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/build-lightning-wallet-20-mins.png",
      ],
      ["i", "youtube:plebdevs", "V_fvmyJ91m0"],
      ["t", "lightning"],
      ["t", "workshop"],
      ["t", "video"],
      ["published_at", "1751292222"],
      ["r", "https://tinyurl.com/20-min-lightning"],
      ["r", "https://github.com/AustinKelsay/20-min-lightning-workshop"],
    ],
    sig: "6057c73905eb00f8560926367db3126d73ad72efb2439ee5ddb34ae294f64881787194a23bcf2c9a7b8e837f7d1e207138928fd2895315f47c6338ee460a79c9",
  },

  // PlebDevs Starter Course - Git & GitHub Lesson
  {
    id: "git-github-lesson-event-id",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740871600,
    kind: 30023,
    content: `# Git & GitHub Fundamentals

## Introduction
In this lesson, we'll learn the fundamentals of Git version control and GitHub collaboration. These are essential tools for any developer, allowing you to track changes, work with teams, and manage your codebase effectively.

## What is Git?

Git is a distributed version control system that tracks changes in files and coordinates work among multiple developers. It's the most widely used version control system in the world.

### Key Concepts
- **Repository (Repo)**: A directory containing your project files and Git metadata
- **Commit**: A snapshot of your project at a specific point in time
- **Branch**: An independent line of development
- **Merge**: Combining changes from different branches

## Basic Git Commands

### Setting Up
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

### Creating a Repository
\`\`\`bash
git init                 # Initialize a new Git repository
git clone <url>          # Clone an existing repository
\`\`\`

### Basic Workflow
\`\`\`bash
git add .                # Stage all changes
git commit -m "message"  # Commit changes with a message
git status               # Check repository status
git log                  # View commit history
\`\`\`

## What is GitHub?

GitHub is a web-based hosting service for Git repositories. It provides collaboration features, issue tracking, and project management tools.

### Key Features
- **Remote Repositories**: Store your code in the cloud
- **Pull Requests**: Propose and review changes
- **Issues**: Track bugs and feature requests
- **Actions**: Automated workflows and CI/CD

## GitHub Workflow

### Pushing Changes
\`\`\`bash
git remote add origin <url>  # Link to remote repository
git push -u origin main      # Push to remote repository
\`\`\`

### Collaboration
\`\`\`bash
git pull                     # Fetch and merge changes
git fetch                    # Fetch without merging
git merge <branch>           # Merge a branch
\`\`\`

## Best Practices

1. **Write Clear Commit Messages**
   - Use present tense: "Add feature" not "Added feature"
   - Keep first line under 50 characters
   - Provide detailed description if needed

2. **Use Branches**
   - Create feature branches for new work
   - Keep main/master branch stable
   - Delete merged branches

3. **Regular Commits**
   - Commit early and often
   - Make atomic commits (one logical change)
   - Don't commit broken code

## Common Git Commands Cheat Sheet

\`\`\`bash
# Repository Management
git init                    # Initialize repository
git clone <url>             # Clone repository
git remote -v               # View remotes

# Staging and Committing
git add <file>              # Stage specific file
git add .                   # Stage all changes
git commit -m "message"     # Commit with message
git commit --amend          # Modify last commit

# Branching
git branch                  # List branches
git branch <name>           # Create branch
git checkout <name>         # Switch branch
git checkout -b <name>      # Create and switch branch
git merge <branch>          # Merge branch
git branch -d <name>        # Delete branch

# Remote Operations
git push                    # Push to remote
git pull                    # Pull from remote
git fetch                   # Fetch from remote
\`\`\`

## Next Steps

1. **Practice the Basics**
   - Create a repository
   - Make commits
   - Push to GitHub

2. **Explore Advanced Features**
   - Learn about rebasing
   - Understand merge vs rebase
   - Explore GitHub Actions

3. **Collaborative Development**
   - Fork repositories
   - Create pull requests
   - Code review process

Remember: Git and GitHub are tools that become more powerful with practice. Start with the basics and gradually incorporate more advanced features as you become comfortable.`,
    tags: [
      ["d", "6d8260b3-c902-46ec-8aed-f3b8c8f1229b"],
      ["title", "Git & GitHub Fundamentals"],
      [
        "summary",
        "Learn the fundamentals of Git version control and GitHub collaboration. Essential tools for any developer to track changes, work with teams, and manage codebases effectively.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/git-github-tutorial.png",
      ],
      ["t", "git"],
      ["t", "github"],
      ["t", "version-control"],
      ["t", "beginner"],
      ["t", "document"],
      ["published_at", "1740871600"],
      ["r", "https://git-scm.com/docs"],
      ["r", "https://docs.github.com/en/get-started"],
    ],
    sig: "git_github_lesson_signature",
  },

  // PlebDevs Starter Course - Bitcoin Fundamentals
  {
    id: "bitcoin-fundamentals-event-id",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740871700,
    kind: 30023,
    content: `# Bitcoin Fundamentals

## Introduction
Welcome to Bitcoin Fundamentals! This lesson provides a comprehensive overview of Bitcoin, the world's first cryptocurrency and decentralized digital currency system.

## What is Bitcoin?

Bitcoin is a peer-to-peer electronic cash system that allows online payments to be sent directly from one party to another without going through a financial institution.

### Key Properties
- **Decentralized**: No central authority controls Bitcoin
- **Digital**: Exists only in digital form
- **Scarce**: Limited supply of 21 million coins
- **Pseudonymous**: Transactions are public but identities are private

## How Bitcoin Works

### The Blockchain
Bitcoin uses a distributed ledger called the blockchain to record all transactions. Each block contains:
- A list of transactions
- A timestamp
- A reference to the previous block
- A cryptographic hash

### Mining
Mining is the process by which new bitcoins are created and transactions are verified. Miners:
- Collect transactions into blocks
- Solve complex mathematical problems
- Add blocks to the blockchain
- Receive bitcoin rewards

### Wallets and Keys
- **Private Key**: A secret number that allows you to spend bitcoins
- **Public Key**: Derived from private key, used to receive bitcoins
- **Address**: A shortened version of the public key
- **Wallet**: Software that manages your keys and addresses

## Bitcoin Transactions

### Transaction Structure
A Bitcoin transaction contains:
- **Inputs**: References to previous transactions
- **Outputs**: New ownership assignments
- **Signatures**: Cryptographic proofs of ownership

### Example Transaction Flow
1. Alice wants to send 1 BTC to Bob
2. Alice's wallet creates a transaction
3. The transaction is signed with Alice's private key
4. The transaction is broadcast to the network
5. Miners verify and include it in a block
6. Bob receives the bitcoin

## Bitcoin Script

Bitcoin uses a simple scripting language called Script to define spending conditions:
- **Pay-to-Public-Key-Hash (P2PKH)**: Standard transaction type
- **Pay-to-Script-Hash (P2SH)**: More complex spending conditions
- **Multisig**: Requires multiple signatures to spend

## Network and Consensus

### Nodes
Bitcoin nodes maintain the blockchain and validate transactions:
- **Full Nodes**: Store the entire blockchain
- **Light Nodes**: Store only block headers
- **Mining Nodes**: Participate in mining

### Consensus Rules
The network follows consensus rules including:
- Block size limits
- Transaction validity rules
- Mining difficulty adjustments
- Reward schedules

## Bitcoin Economics

### Supply Schedule
- New bitcoins are created every ~10 minutes
- Block rewards halve every 210,000 blocks (~4 years)
- Maximum supply: 21 million bitcoins

### Fees
- Transaction fees incentivize miners
- Fees vary based on network congestion
- Higher fees result in faster confirmation

## Security Model

### Cryptography
Bitcoin uses:
- **SHA-256**: Hash function for proof-of-work
- **ECDSA**: Digital signature algorithm
- **RIPEMD-160**: Address generation

### Assumptions
Bitcoin's security relies on:
- Cryptographic assumptions
- Economic incentives
- Network decentralization
- Majority of miners being honest

## Development and Improvement

### Bitcoin Improvement Proposals (BIPs)
- BIP-1: BIP process itself
- BIP-32: Hierarchical Deterministic Wallets
- BIP-141: Segregated Witness (SegWit)
- BIP-340: Schnorr Signatures

### Soft Forks vs Hard Forks
- **Soft Fork**: Backwards-compatible upgrade
- **Hard Fork**: Backwards-incompatible change

## Getting Started

### Running a Node
\`\`\`bash
# Download Bitcoin Core
wget https://bitcoin.org/bin/bitcoin-core-0.21.0/bitcoin-0.21.0-x86_64-linux-gnu.tar.gz

# Extract and run
tar -xzf bitcoin-0.21.0-x86_64-linux-gnu.tar.gz
./bitcoin-0.21.0/bin/bitcoind
\`\`\`

### Basic Commands
\`\`\`bash
bitcoin-cli getblockchaininfo  # Get blockchain info
bitcoin-cli getwalletinfo      # Get wallet info
bitcoin-cli getnewaddress      # Generate new address
bitcoin-cli sendtoaddress      # Send bitcoin
\`\`\`

## Further Learning

1. **Technical Resources**
   - Bitcoin Whitepaper
   - Mastering Bitcoin book
   - Bitcoin Core documentation

2. **Development**
   - Bitcoin script examples
   - Wallet development
   - Lightning Network

3. **Community**
   - Bitcoin development mailing list
   - Bitcoin Stack Exchange
   - Local Bitcoin meetups

Bitcoin is a revolutionary technology that combines cryptography, economics, and computer science. Understanding these fundamentals is crucial for anyone looking to develop on Bitcoin or simply understand how it works.`,
    tags: [
      ["d", "80aac9d4-8bef-4a92-9ee9-dea1c2d66c3a"],
      ["title", "Bitcoin Fundamentals"],
      [
        "summary",
        "A comprehensive overview of Bitcoin, covering blockchain technology, mining, transactions, and the economic model of the world's first cryptocurrency.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/bitcoin-fundamentals.png",
      ],
      ["t", "bitcoin"],
      ["t", "cryptocurrency"],
      ["t", "blockchain"],
      ["t", "beginner"],
      ["t", "document"],
      ["published_at", "1740871700"],
      ["r", "https://bitcoin.org/bitcoin.pdf"],
      ["r", "https://developer.bitcoin.org/"],
    ],
    sig: "bitcoin_fundamentals_signature",
  },

  // PlebDevs Starter Course - Lightning Network Basics
  {
    id: "lightning-basics-event-id",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740871800,
    kind: 30023,
    content: `# Lightning Network Basics

## Introduction
The Lightning Network is a "layer 2" payment protocol that operates on top of Bitcoin. It enables fast, cheap, and scalable transactions while maintaining the security of the Bitcoin blockchain.

## Why Lightning Network?

### Bitcoin's Limitations
- **Slow**: ~10 minutes for confirmation
- **Expensive**: High transaction fees during congestion
- **Limited Throughput**: ~7 transactions per second

### Lightning Solutions
- **Fast**: Instant payments
- **Cheap**: Minimal fees
- **Scalable**: Millions of transactions per second

## How Lightning Works

### Payment Channels
A payment channel is a 2-of-2 multisig wallet between two parties:
1. **Opening**: Both parties fund the channel
2. **Updating**: They can exchange signed transactions
3. **Closing**: Final state is broadcast to Bitcoin

### Network of Channels
- Channels form a network
- Payments can route through multiple channels
- No need for direct channels to everyone

### Example: Alice pays Charlie through Bob
1. Alice has a channel with Bob
2. Bob has a channel with Charlie
3. Alice can pay Charlie through Bob
4. All without opening new channels

## Channel States

### Channel Lifecycle
1. **Funding**: Create multisig address, fund with Bitcoin
2. **Operating**: Exchange commitment transactions
3. **Closing**: Broadcast final state to Bitcoin

### Commitment Transactions
- Represent current channel state
- Signed by both parties
- Can be broadcast anytime to close channel

## Routing and Pathfinding

### Onion Routing
- Payments are routed through multiple hops
- Each node only knows the previous and next hop
- Provides privacy for payment paths

### Fees and Incentives
- Routing nodes earn fees
- Fees incentivize providing liquidity
- Creates economic incentives for network growth

## Lightning Network Node Types

### Full Nodes
- Maintain channel state
- Route payments
- Provide liquidity

### Light Clients
- Connect to full nodes
- Send and receive payments
- Don't route for others

### Watchtowers
- Monitor channels for fraud
- Provide security for offline users
- Broadcast penalty transactions

## Payment Process

### Step-by-Step Payment
1. **Invoice**: Recipient creates payment request
2. **Pathfinding**: Sender finds route to recipient
3. **HTLC Setup**: Hash Time-Locked Contracts secure payment
4. **Routing**: Payment routed through intermediate nodes
5. **Settlement**: Recipient reveals secret, payment completes

### Hash Time-Locked Contracts (HTLCs)
- Atomic payments across multiple hops
- Use hash locks and time locks
- Ensure payment or refund

## Channel Management

### Liquidity Management
- **Inbound Liquidity**: Ability to receive payments
- **Outbound Liquidity**: Ability to send payments
- **Rebalancing**: Moving liquidity between channels

### Channel Backup
- Static Channel Backup (SCB)
- Enables channel recovery
- Important for fund safety

## Lightning Applications

### Payments
- Instant micropayments
- Streaming payments
- Point-of-sale systems

### Development
- Lightning Service Provider (LSP)
- Lightning Address
- WebLN browser extension

### Use Cases
- Social media tipping
- Content monetization
- Gaming and digital goods

## Getting Started

### Popular Lightning Wallets
- **Mobile**: Phoenix, Breez, Muun
- **Desktop**: Zap, Lightning Labs
- **Web**: Alby, LNbits

### Running a Lightning Node
\`\`\`bash
# Using LND (Lightning Network Daemon)
git clone https://github.com/lightningnetwork/lnd.git
cd lnd
make install

# Start LND
lnd --bitcoin.active --bitcoin.mainnet
\`\`\`

### Basic LND Commands
\`\`\`bash
lncli getinfo              # Get node info
lncli newaddress p2wkh     # Generate address
lncli openchannel          # Open channel
lncli payinvoice           # Pay invoice
lncli addinvoice           # Create invoice
\`\`\`

## Lightning Network Protocols

### BOLTs (Basis of Lightning Technology)
- BOLT-1: Base protocol
- BOLT-2: Peer protocol
- BOLT-3: Bitcoin transaction format
- BOLT-4: Onion routing
- BOLT-7: P2P node discovery

### Key Innovations
- **Revocation**: Prevents publishing old states
- **Onion Routing**: Provides payment privacy
- **Atomic Multipath**: Split payments across routes

## Challenges and Limitations

### Technical Challenges
- **Liquidity**: Channels need sufficient funds
- **Routing**: Finding reliable payment paths
- **Backup**: Channel state backup complexity

### Economic Challenges
- **Centralization**: Tendency toward hub-and-spoke
- **Capital Requirements**: Need Bitcoin to open channels
- **Fee Competition**: Balancing fees vs reliability

## Future Developments

### Protocol Improvements
- **Eltoo**: Simplified channel updates
- **Taproot**: Enhanced privacy and efficiency
- **Trampoline Payments**: Outsourced routing

### Ecosystem Growth
- **Lightning Service Providers**: Managed lightning services
- **Submarine Swaps**: On-chain/off-chain swaps
- **Dual-funded Channels**: Both parties fund channels

## Security Considerations

### Channel Security
- Keep node online for monitoring
- Use watchtowers for added security
- Maintain proper channel backups

### Network Security
- Understand counterparty risk
- Monitor for force closures
- Keep software updated

## Learning Resources

1. **Documentation**
   - Lightning Network specifications
   - LND developer documentation
   - c-lightning documentation

2. **Books and Guides**
   - Mastering the Lightning Network
   - Lightning Network paper
   - Developer guides

3. **Community**
   - Lightning Network developers Slack
   - Bitcoin development IRC
   - Local Lightning meetups

The Lightning Network represents a significant advancement in Bitcoin's scaling capabilities. Understanding its fundamentals is essential for anyone looking to build on Bitcoin's second layer.`,
    tags: [
      ["d", "6fe3cb4b-2571-4e3b-9159-db78325ee5cc"],
      ["title", "Lightning Network Basics"],
      [
        "summary",
        "Learn about the Lightning Network, Bitcoin's layer 2 scaling solution that enables fast, cheap, and scalable transactions while maintaining security.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/lightning-network-basics.png",
      ],
      ["t", "lightning"],
      ["t", "bitcoin"],
      ["t", "layer2"],
      ["t", "payments"],
      ["t", "beginner"],
      ["t", "document"],
      ["published_at", "1740871800"],
      ["r", "https://lightning.network/lightning-network-paper.pdf"],
      ["r", "https://dev.lightning.community/"],
    ],
    sig: "lightning_basics_signature",
  },

  // PlebDevs Starter Course - JavaScript Fundamentals
  {
    id: "javascript-fundamentals-event-id",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740871900,
    kind: 30023,
    content: `# JavaScript Fundamentals

## Introduction
JavaScript is a versatile programming language that powers the modern web. Originally created for browsers, it now runs on servers, mobile apps, and desktop applications.

## Getting Started

### What is JavaScript?
- **High-level**: Abstracts away complex details
- **Interpreted**: Runs without compilation
- **Dynamic**: Types determined at runtime
- **Prototype-based**: Object-oriented via prototypes

### Where JavaScript Runs
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Servers**: Node.js
- **Mobile**: React Native, Cordova
- **Desktop**: Electron

## Basic Syntax

### Variables
\`\`\`javascript
// Modern way - let and const
let name = "Alice";
const age = 25;

// Old way - var (avoid)
var city = "New York";
\`\`\`

### Data Types
\`\`\`javascript
// Primitive types
let number = 42;
let string = "Hello";
let boolean = true;
let undefined = undefined;
let nullValue = null;
let symbol = Symbol("id");

// Object types
let array = [1, 2, 3];
let object = { name: "Bob", age: 30 };
let function = function() { return "Hello"; };
\`\`\`

### Functions
\`\`\`javascript
// Function declaration
function greet(name) {
  return "Hello, " + name;
}

// Function expression
const greet2 = function(name) {
  return "Hello, " + name;
};

// Arrow function (ES6)
const greet3 = (name) => "Hello, " + name;
\`\`\`

## Control Flow

### Conditionals
\`\`\`javascript
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}

// Ternary operator
const status = age >= 18 ? "Adult" : "Minor";
\`\`\`

### Loops
\`\`\`javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// For...of loop (arrays)
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
  console.log(fruit);
}

// For...in loop (objects)
const person = { name: "Alice", age: 25 };
for (const key in person) {
  console.log(key, person[key]);
}
\`\`\`

## Objects and Arrays

### Objects
\`\`\`javascript
// Object literal
const person = {
  name: "Alice",
  age: 25,
  greet() {
    return "Hello, I'm " + this.name;
  }
};

// Accessing properties
console.log(person.name); // Dot notation
console.log(person["age"]); // Bracket notation

// Adding properties
person.city = "New York";
person["country"] = "USA";
\`\`\`

### Arrays
\`\`\`javascript
// Array literal
const numbers = [1, 2, 3, 4, 5];

// Array methods
numbers.push(6); // Add to end
numbers.pop(); // Remove from end
numbers.unshift(0); // Add to beginning
numbers.shift(); // Remove from beginning

// Array iteration
numbers.forEach(num => console.log(num));
const doubled = numbers.map(num => num * 2);
const evens = numbers.filter(num => num % 2 === 0);
\`\`\`

## Modern JavaScript (ES6+)

### Template Literals
\`\`\`javascript
const name = "Alice";
const age = 25;
const message = \`Hello, my name is \${name} and I'm \${age} years old\`;
\`\`\`

### Destructuring
\`\`\`javascript
// Array destructuring
const [first, second] = [1, 2, 3];

// Object destructuring
const {name, age} = {name: "Alice", age: 25, city: "NYC"};
\`\`\`

### Spread Operator
\`\`\`javascript
// Array spread
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spread
const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3}; // {a: 1, b: 2, c: 3}
\`\`\`

### Async/Await
\`\`\`javascript
// Promises
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Data"), 1000);
  });
};

// Async/await
const getData = async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
\`\`\`

## DOM Manipulation

### Selecting Elements
\`\`\`javascript
// By ID
const element = document.getElementById("myId");

// By class
const elements = document.getElementsByClassName("myClass");

// By CSS selector
const element = document.querySelector(".myClass");
const elements = document.querySelectorAll("div.myClass");
\`\`\`

### Modifying Elements
\`\`\`javascript
// Change content
element.textContent = "New text";
element.innerHTML = "<strong>Bold text</strong>";

// Change attributes
element.setAttribute("class", "newClass");
element.style.color = "blue";

// Add event listeners
element.addEventListener("click", function() {
  console.log("Element clicked!");
});
\`\`\`

## Error Handling

### Try/Catch
\`\`\`javascript
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error("Error:", error.message);
} finally {
  console.log("This runs regardless");
}
\`\`\`

### Throwing Errors
\`\`\`javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
\`\`\`

## Best Practices

### Variable Naming
- Use descriptive names: \`userName\` not \`u\`
- Use camelCase: \`firstName\` not \`first_name\`
- Use const for values that don't change

### Function Guidelines
- Keep functions small and focused
- Use pure functions when possible
- Return early to avoid deep nesting

### Code Organization
\`\`\`javascript
// Use modules
export const utils = {
  formatDate: (date) => date.toLocaleDateString(),
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
};

// Import modules
import { utils } from './utils.js';
\`\`\`

## Common Gotchas

### Scope and Hoisting
\`\`\`javascript
// Hoisting with var
console.log(x); // undefined (not error)
var x = 5;

// Block scope with let/const
if (true) {
  let y = 10;
}
console.log(y); // ReferenceError
\`\`\`

### This Binding
\`\`\`javascript
const obj = {
  name: "Alice",
  greet: function() {
    return "Hello, " + this.name;
  },
  greetArrow: () => {
    return "Hello, " + this.name; // 'this' is undefined
  }
};
\`\`\`

### Equality Comparison
\`\`\`javascript
// Loose equality (avoid)
"5" == 5; // true

// Strict equality (prefer)
"5" === 5; // false
\`\`\`

## Next Steps

1. **Practice Projects**
   - Build a calculator
   - Create a to-do list
   - Develop a simple game

2. **Learn Frameworks**
   - React for UI development
   - Node.js for server development
   - Express for web applications

3. **Advanced Topics**
   - Closures and scope
   - Prototypes and inheritance
   - Event loop and concurrency

4. **Development Tools**
   - Browser DevTools
   - Code editors and extensions
   - Package managers (npm, yarn)

JavaScript is the foundation of modern web development. Master these fundamentals, and you'll be well-equipped to build dynamic, interactive applications.`,
    tags: [
      ["d", "e5399c72-9b95-46d6-a594-498e673b6c58"],
      ["title", "JavaScript Fundamentals"],
      [
        "summary",
        "Learn JavaScript from the ground up. Covers syntax, data types, functions, objects, modern ES6+ features, and best practices for web development.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/javascript-fundamentals.png",
      ],
      ["t", "javascript"],
      ["t", "programming"],
      ["t", "web-development"],
      ["t", "beginner"],
      ["t", "document"],
      ["published_at", "1740871900"],
      ["r", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
      ["r", "https://javascript.info/"],
    ],
    sig: "javascript_fundamentals_signature",
  },

  // PlebDevs Starter Course - Nostr Fundamentals
  {
    id: "nostr-fundamentals-event-id",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1740872000,
    kind: 30023,
    content: `# Nostr Fundamentals

## Introduction
Nostr (Notes and Other Stuff Transmitted by Relays) is a decentralized protocol for creating censorship-resistant social networks and applications. Unlike traditional social media, Nostr gives users true ownership of their data and identity.

## What is Nostr?

### Core Principles
- **Decentralized**: No single point of failure
- **Censorship-resistant**: No central authority can block content
- **Portable**: Your identity and data belong to you
- **Interoperable**: Different apps can share the same data

### Key Components
- **Events**: All data is stored as events
- **Relays**: Servers that store and forward events
- **Clients**: Applications that interact with relays
- **Keys**: Cryptographic identity system

## How Nostr Works

### The Event Model
Everything in Nostr is an event:
\`\`\`json
{
  "id": "event-id-hash",
  "pubkey": "author-public-key",
  "created_at": 1234567890,
  "kind": 1,
  "tags": [["tag-name", "tag-value"]],
  "content": "Hello, Nostr!",
  "sig": "cryptographic-signature"
}
\`\`\`

### Event Kinds
- **Kind 0**: User metadata (profile)
- **Kind 1**: Text notes (posts)
- **Kind 3**: Contact lists (follows)
- **Kind 4**: Encrypted direct messages
- **Kind 5**: Event deletions
- **Kind 6**: Reposts
- **Kind 7**: Reactions (likes)

### Identity System
- **Private Key**: Your secret key (never share)
- **Public Key**: Your identity (shareable)
- **Keypair**: Generated cryptographically
- **Signatures**: Prove authenticity

## Relays

### What are Relays?
Relays are servers that:
- Store events
- Forward events to clients
- Filter events based on requests
- Maintain real-time connections

### Relay Communication
- **WebSocket**: Real-time bidirectional communication
- **JSON**: All messages are JSON formatted
- **Subscriptions**: Clients subscribe to event filters
- **Publishing**: Clients publish events to relays

### Message Types
\`\`\`json
// Publishing an event
["EVENT", event_object]

// Subscribing to events
["REQ", subscription_id, filter_object]

// Closing a subscription
["CLOSE", subscription_id]
\`\`\`

## Building on Nostr

### Setting Up Development Environment
\`\`\`bash
# Install nostr-tools
npm install nostr-tools

# Or with yarn
yarn add nostr-tools
\`\`\`

### Basic Client Example
\`\`\`javascript
import { generatePrivateKey, getPublicKey, finishEvent, relayInit } from 'nostr-tools';

// Generate identity
const privateKey = generatePrivateKey();
const publicKey = getPublicKey(privateKey);

// Connect to relay
const relay = relayInit('wss://relay.example.com');
relay.connect();

// Create and publish event
const event = {
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Hello, Nostr!',
  pubkey: publicKey
};

const signedEvent = finishEvent(event, privateKey);
relay.publish(signedEvent);
\`\`\`

### Subscribing to Events
\`\`\`javascript
// Subscribe to recent notes
const sub = relay.sub([
  {
    kinds: [1],
    since: Math.floor(Date.now() / 1000) - 3600, // Last hour
    limit: 50
  }
]);

sub.on('event', (event) => {
  console.log('New event:', event);
});
\`\`\`

## NIPs (Nostr Implementation Possibilities)

### Core NIPs
- **NIP-01**: Basic protocol flow
- **NIP-02**: Contact List and Petnames
- **NIP-04**: Encrypted Direct Messages
- **NIP-05**: DNS-based verification
- **NIP-19**: Bech32-encoded entities

### Extended NIPs
- **NIP-23**: Long-form content
- **NIP-25**: Reactions
- **NIP-28**: Public chat
- **NIP-42**: Authentication
- **NIP-50**: Keywords filter

### Lightning Integration
- **NIP-57**: Lightning Zaps
- **NIP-58**: Badges
- **NIP-78**: Arbitrary custom app data

## Common Use Cases

### Social Media
- Twitter-like microblogging
- Long-form content publishing
- Image and video sharing
- Real-time chat

### Identity and Authentication
- Decentralized identity
- Web3 authentication
- Reputation systems
- Verification badges

### E-commerce and Payments
- Marketplaces
- Lightning payments
- Tipping and zaps
- Subscription services

### Content Creation
- Blogging platforms
- Podcasting
- Live streaming
- Educational content

## Key Advantages

### For Users
- **Ownership**: Your data belongs to you
- **Portability**: Switch clients anytime
- **Censorship Resistance**: No central authority
- **Privacy**: Encrypted communications

### For Developers
- **Simple Protocol**: Easy to implement
- **Interoperability**: Apps work together
- **No API Keys**: Direct protocol access
- **Open Source**: Community-driven

## Challenges and Considerations

### Technical Challenges
- **Relay Discovery**: Finding the right relays
- **Spam Prevention**: Filtering unwanted content
- **Scaling**: Growing number of events
- **Data Storage**: Long-term event persistence

### User Experience
- **Key Management**: Protecting private keys
- **Relay Selection**: Choosing reliable relays
- **Content Discovery**: Finding relevant content
- **Client Compatibility**: Different implementations

## Development Best Practices

### Key Management
\`\`\`javascript
// Store keys securely
const privateKey = localStorage.getItem('nostr-private-key');
if (!privateKey) {
  const newKey = generatePrivateKey();
  localStorage.setItem('nostr-private-key', newKey);
}
\`\`\`

### Relay Management
\`\`\`javascript
// Use multiple relays for redundancy
const relays = [
  'wss://relay1.example.com',
  'wss://relay2.example.com',
  'wss://relay3.example.com'
];

const connections = relays.map(url => {
  const relay = relayInit(url);
  relay.connect();
  return relay;
});
\`\`\`

### Error Handling
\`\`\`javascript
relay.on('error', (error) => {
  console.error('Relay error:', error);
  // Implement retry logic
});

relay.on('disconnect', () => {
  console.log('Relay disconnected');
  // Attempt reconnection
});
\`\`\`

## Popular Nostr Clients

### Web Clients
- **Astral**: Full-featured web client
- **Snort**: Modern, fast interface
- **Iris**: User-friendly design
- **Coracle**: Advanced features

### Mobile Clients
- **Damus**: iOS native client
- **Amethyst**: Android native client
- **Nostros**: Cross-platform mobile

### Desktop Clients
- **Gossip**: Rust-based desktop client
- **More**: Electron-based clients

## Running a Relay

### Simple Relay Setup
\`\`\`bash
# Clone nostr-rs-relay
git clone https://github.com/scsibug/nostr-rs-relay
cd nostr-rs-relay

# Configure and run
cargo run
\`\`\`

### Relay Configuration
\`\`\`toml
[network]
port = 8080
address = "0.0.0.0"

[limits]
max_message_length = 128000
max_subscriptions = 20
max_filters = 100
\`\`\`

## Future Developments

### Protocol Improvements
- **NIP-46**: Remote signing
- **NIP-65**: Relay list metadata
- **NIP-94**: File metadata
- **NIP-96**: HTTP file storage

### Scaling Solutions
- **Relay clustering**: Distributed relay networks
- **Content addressing**: IPFS integration
- **Selective relay**: Specialized relay types

### Privacy Enhancements
- **Onion routing**: Anonymous communication
- **Zero-knowledge proofs**: Private verification
- **Tor integration**: Enhanced privacy

## Learning Resources

1. **Official Documentation**
   - Nostr NIPs repository
   - Protocol specification
   - Implementation guides

2. **Development Tools**
   - nostr-tools (JavaScript)
   - nostr-sdk (Rust)
   - python-nostr (Python)

3. **Community**
   - Nostr developer Telegram
   - GitHub discussions
   - Nostr conferences and meetups

## Getting Started Project

Build a simple Nostr client:
1. Generate a keypair
2. Connect to a relay
3. Publish a note
4. Subscribe to events
5. Display received notes

Nostr represents a paradigm shift toward decentralized, user-owned social media. Understanding its fundamentals opens up possibilities for building the next generation of social applications.`,
    tags: [
      ["d", "a3083ab5-0187-4b77-83d1-29ae1f644559"],
      ["title", "Nostr Fundamentals"],
      [
        "summary",
        "Learn about Nostr, the decentralized protocol for censorship-resistant social networks. Covers events, relays, clients, and building your first Nostr application.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/nostr-fundamentals.png",
      ],
      ["t", "nostr"],
      ["t", "decentralized"],
      ["t", "social-media"],
      ["t", "protocol"],
      ["t", "beginner"],
      ["t", "document"],
      ["published_at", "1740872000"],
      ["r", "https://github.com/nostr-protocol/nips"],
      ["r", "https://nostr.com/"],
    ],
    sig: "nostr_fundamentals_signature",
  },

  // Real example from content_data_models.md - React Setup Document
  {
    id: "758149694299ce464c299f9b97a2c6a3e94536eeeeb939fa981d3b09dbf1cf11",
    pubkey: realPubkeys.austinKelsay,
    created_at: 1731696272,
    kind: 30023,
    content: `# Setting Up a React App from Scratch: A Minimal Guide

## Prerequisites

- Node.js and npm installed on your machine
- A text editor of your choice

## Step 1: Create a New Project Directory

\`\`\`bash
mkdir my-react-app
cd my-react-app
\`\`\`

## Step 2: Initialize the Project

\`\`\`bash
npm init -y
\`\`\`

This creates a package.json file with default values.

## Step 3: Install Dependencies

\`\`\`bash
npm install react react-dom
npm install --save-dev parcel @babel/preset-react
\`\`\`

## Step 4: Create Project Structure

Create the following files and directories:

\`\`\`
my-react-app/
├── src/
    ├── index.html
    └── index.js
└── package.json
\`\`\`

## Step 5: Set Up HTML

In src/index.html, add the following content:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My React App</title>
</head>
<body>
    <div id="root"></div>
    <script src="./index.js"></script>
</body>
</html>
\`\`\`

## Step 6: Create React Entry Point

In src/index.js, add the following content:

\`\`\`javascript
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
    return <h1>Hello, React!</h1>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

## Step 7: Configure Babel

Create a .babelrc file in the project root:

\`\`\`json
{
    "presets": ["@babel/preset-react"]
}
\`\`\`

## Step 8: Update package.json Scripts

Add the following scripts to your package.json:

\`\`\`json
"scripts": {
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
}
\`\`\`

## Step 9: Run the Development Server

\`\`\`bash
npm start
\`\`\`

Your app should now be running at http://localhost:1234.

## Step 10: Build for Production

When you're ready to deploy:

\`\`\`bash
npm run build
\`\`\`

This will create a dist folder with your optimized production build.

---

Congratulations! You've set up a React app from scratch using Parcel. This setup provides a lightweight and modern development environment with minimal overhead.`,
    tags: [
      ["d", "e25f3d3b-f28b-4edd-a325-380564e6db7d"],
      ["title", "Setting Up a React App from Scratch: A Minimal Guide"],
      [
        "summary",
        "This guide will walk you through setting up a React app manually, using Parcel as a bundler for its simplicity and efficiency.",
      ],
      [
        "image",
        "https://miro.medium.com/v2/resize:fit:1200/1*jfpk9Pld9ZGh9f68NMb-Cg.jpeg",
      ],
      ["t", "guide"],
      ["t", "document"],
      ["published_at", "1731696272"],
      ["r", "https://parceljs.org/recipes/react/"],
    ],
    sig: "react_setup_signature",
  },
  {
    id: "react-setup-guide",
    pubkey: realPubkeys.alexJohnson,
    created_at: 1731696272,
    kind: 30023,
    content: `# Setting Up a React App from Scratch: A Minimal Guide

## Step 5: Set Up HTML

In src/index.html, add the following content:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My React App</title>
</head>
<body>
    <div id="root"></div>
    <script src="./index.js"></script>
</body>
</html>
\`\`\`

## Step 6: Create React Entry Point

In src/index.js, add the following content:

\`\`\`javascript
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
    return <h1>Hello, React!</h1>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

## Step 7: Configure Babel

Create a .babelrc file in the project root:

\`\`\`json
{
    "presets": ["@babel/preset-react"]
}
\`\`\`

## Step 8: Update package.json Scripts

Add the following scripts to your package.json:

\`\`\`json
"scripts": {
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
}
\`\`\`

## Step 9: Run the Development Server

\`\`\`bash
npm start
\`\`\`

Your app should now be running at http://localhost:1234.

## Step 10: Build for Production

When you're ready to deploy:

\`\`\`bash
npm run build
\`\`\`

This will create a dist folder with your optimized production build.

---

Congratulations! You've set up a React app from scratch using Parcel. This setup provides a lightweight and modern development environment with minimal overhead.`,
    tags: [
      ["d", "e25f3d3b-f28b-4edd-a325-380564e6db7d"],
      ["title", "Setting Up a React App from Scratch: A Minimal Guide"],
      [
        "summary",
        "This guide will walk you through setting up a React app manually, using Parcel as a bundler for its simplicity and efficiency.",
      ],
      [
        "image",
        "https://miro.medium.com/v2/resize:fit:1200/1*jfpk9Pld9ZGh9f68NMb-Cg.jpeg",
      ],
      ["t", "guide"],
      ["t", "document"],
      ["published_at", "1731696272"],
      ["r", "https://parceljs.org/recipes/react/"],
    ],
    sig: "4389b364746a27a0c650adb14ab043475eb66cfde20ccaa00d029d91c06a9863469e7e1db0627ece0f205122cad5d34efd77bf668fef77e34404b9cb925a8220",
  },
];

// ============================================================================
// NIP-99 PAID CONTENT EVENTS (kind 30402) - Classified listings for premium content
// ============================================================================

export const nostrPaidContentEvents: NostrPaidContentEvent[] = [
  // Advanced Bitcoin Development
  {
    id: "advanced-bitcoin-dev-event",
    pubkey: realPubkeys.alexJohnson,
    created_at: 1705315500,
    kind: 30402,
    content: `# Advanced Bitcoin Development

## Deep Dive into Bitcoin Internals

This advanced course covers the intricate details of Bitcoin's internal workings that every serious Bitcoin developer should understand.

## What You'll Learn

### 1. Transaction Construction
- Advanced script types (P2SH, P2WPKH, P2WSH)
- Multi-signature implementations
- Time-locked transactions
- Custom script development

### 2. Network Protocol
- Peer-to-peer message handling
- Block validation processes
- Mempool management
- Node synchronization

### 3. Consensus Mechanisms
- Proof of Work deep dive
- Difficulty adjustment algorithm
- Fork resolution
- Soft fork activation

### 4. Security Considerations
- Common attack vectors
- Mitigation strategies
- Secure key management
- Hardware security modules

## Advanced Topics

### Script Optimization
\`\`\`bitcoin-script
# Optimized multisig script
OP_2 <pubkey1> <pubkey2> <pubkey3> OP_3 OP_CHECKMULTISIG
\`\`\`

### Custom Transaction Types
- Atomic swaps
- Payment channels
- Commitment transactions
- Penalty transactions

### Mining and Pool Development
- Stratum protocol implementation
- Block template generation
- Mining algorithm optimization
- Pool reward distribution

## Real-World Applications

### Enterprise Integration
- Exchange integration patterns
- Custody solutions
- Compliance frameworks
- Risk management

### Protocol Development
- BIP proposal process
- Core development workflow
- Testing methodologies
- Code review practices

## Tools and Libraries

### Development Environment
- Bitcoin Core compilation
- Custom network setup
- Testing frameworks
- Debugging tools

### Professional Libraries
- libsecp256k1 integration
- Custom wallet implementations
- Protocol message parsing
- Blockchain analysis tools

## Prerequisites

- Completion of Bitcoin Fundamentals
- Strong programming background
- Understanding of cryptography
- Familiarity with C++ or Go

## What's Included

✅ 8 hours of video content
✅ Complete source code examples
✅ Practice assignments
✅ Direct access to instructor
✅ Certificate of completion
✅ Private Discord community

## Investment

This comprehensive course represents 100+ hours of development and real-world experience. The skills you'll gain are immediately applicable to high-paying Bitcoin development roles.

**Price: 25,000 sats**

Perfect for developers ready to take their Bitcoin knowledge to the professional level.`,
    tags: [
      ["d", "advanced-bitcoin-dev"],
      ["title", "Advanced Bitcoin Development"],
      [
        "summary",
        "Deep dive into Bitcoin internals, advanced scripting, network protocols, and professional development practices for serious Bitcoin developers.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/advanced-bitcoin-dev.png",
      ],
      ["price", "25000", "sats"],
      ["t", "bitcoin"],
      ["t", "advanced"],
      ["t", "development"],
      ["t", "professional"],
      ["published_at", "1705315500"],
      ["r", "https://github.com/bitcoin-dev-examples"],
      ["r", "https://discord.gg/bitcoin-dev"],
    ],
    sig: "advanced_bitcoin_dev_signature",
  },

  // Advanced Nostr Patterns
  {
    id: "advanced-nostr-patterns-event",
    pubkey: realPubkeys.mariaSantos,
    created_at: 1704974500,
    kind: 30402,
    content: `# Advanced Nostr Patterns

## Building Production-Ready Nostr Applications

Take your Nostr development to the next level with advanced patterns, optimization techniques, and real-world implementation strategies.

## Advanced Concepts

### 1. Relay Optimization
- Connection pooling strategies
- Subscription management
- Bandwidth optimization
- Offline-first architecture

### 2. Event Processing
- Efficient event validation
- Signature verification optimization
- Event deduplication
- Database indexing strategies

### 3. Scaling Patterns
- Horizontal scaling approaches
- Caching strategies
- CDN integration
- Load balancing

## Advanced NIPs Implementation

### NIP-65: Relay Lists
\`\`\`javascript
// Intelligent relay selection
const selectOptimalRelays = (userRelays, contentType) => {
  return userRelays
    .filter(relay => relay.supports(contentType))
    .sort((a, b) => a.latency - b.latency)
    .slice(0, 3)
}
\`\`\`

### NIP-42: Authentication
- Challenge-response authentication
- Secure session management
- Rate limiting strategies
- Access control patterns

### NIP-50: Search
- Full-text search implementation
- Indexing strategies
- Search result ranking
- Real-time search updates

## Performance Optimization

### Event Streaming
- WebSocket optimization
- Subscription multiplexing
- Backpressure handling
- Memory management

### Database Design
- Efficient schema design
- Query optimization
- Index strategies
- Data archiving

## Security Patterns

### Key Management
- Secure key derivation
- Multi-device synchronization
- Backup strategies
- Recovery mechanisms

### Privacy Protection
- Metadata privacy
- Traffic analysis resistance
- Onion routing integration
- Anonymous publishing

## Production Deployment

### Infrastructure
- Docker containerization
- Kubernetes orchestration
- Monitoring and alerting
- Backup and disaster recovery

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- Relay health monitoring

## Real-World Case Studies

### Social Media Platform
- Feed algorithm design
- Content moderation
- User engagement patterns
- Monetization strategies

### Marketplace Implementation
- Product listing protocols
- Payment integration
- Dispute resolution
- Reputation systems

## Advanced Tools

### Development
- Custom relay implementation
- Testing frameworks
- Performance profiling
- Security auditing

### Operations
- Monitoring dashboards
- Automated deployment
- Scaling strategies
- Incident response

## What You'll Build

🚀 **High-Performance Relay**
- Custom relay implementation
- Advanced filtering
- Scaling optimizations

🚀 **Social Media Client**
- Real-time updates
- Offline support
- Advanced features

🚀 **Marketplace Platform**
- Product listings
- Payment processing
- Reputation system

## Prerequisites

- Solid understanding of Nostr fundamentals
- Experience with JavaScript/TypeScript
- Database design knowledge
- Basic cryptography understanding

## Investment

This advanced course contains insights from building production Nostr applications serving thousands of users. The patterns and techniques taught are battle-tested and immediately applicable.

**Price: 30,000 sats**

For developers ready to build the next generation of decentralized applications.`,
    tags: [
      ["d", "advanced-nostr-patterns"],
      ["title", "Advanced Nostr Patterns"],
      [
        "summary",
        "Production-ready Nostr development patterns, optimization techniques, and real-world implementation strategies for scalable decentralized applications.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/advanced-nostr-patterns.png",
      ],
      ["price", "30000", "sats"],
      ["t", "nostr"],
      ["t", "advanced"],
      ["t", "development"],
      ["t", "patterns"],
      ["t", "scalability"],
      ["published_at", "1704974500"],
      ["r", "https://github.com/nostr-advanced-patterns"],
      ["r", "https://discord.gg/nostr-dev"],
    ],
    sig: "advanced_nostr_patterns_signature",
  },

  // Bitcoin JavaScript Integration
  {
    id: "bitcoin-js-integration-event",
    pubkey: realPubkeys.davidWilson,
    created_at: 1704631300,
    kind: 30402,
    content: `# Bitcoin JavaScript Integration

## Building Bitcoin Applications with JavaScript

Master the art of integrating Bitcoin functionality into modern JavaScript applications using the most popular libraries and frameworks.

## Core Libraries

### bitcoinjs-lib
The most comprehensive Bitcoin library for JavaScript:

\`\`\`javascript
import * as bitcoin from 'bitcoinjs-lib'

// Create a new address
const keyPair = bitcoin.ECPair.makeRandom()
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })

// Build a transaction
const psbt = new bitcoin.Psbt()
psbt.addInput({
  hash: 'previous_tx_hash',
  index: 0,
  witnessUtxo: {
    script: Buffer.from('76a914...88ac', 'hex'),
    value: 100000
  }
})
psbt.addOutput({
  address: 'recipient_address',
  value: 90000
})
psbt.signInput(0, keyPair)
psbt.finalizeAllInputs()

const tx = psbt.extractTransaction()
\`\`\`

### WebLN Integration
\`\`\`javascript
// Connect to WebLN wallet
await webln.enable()

// Send payment
const invoice = 'lnbc...'
const response = await webln.sendPayment(invoice)

// Request payment
const invoice = await webln.makeInvoice({
  amount: 1000,
  defaultMemo: 'Coffee payment'
})
\`\`\`

## Advanced Patterns

### Wallet Management
- HD wallet implementation
- Multi-signature wallets
- Hardware wallet integration
- Seed phrase handling

### Transaction Broadcasting
- Multiple node connection
- Fee estimation
- RBF (Replace-by-Fee)
- CPFP (Child-Pays-for-Parent)

### Real-time Updates
- WebSocket connections
- Event-driven architecture
- State management
- UI synchronization

## React Integration Patterns

### Custom Hooks
\`\`\`javascript
const useBitcoinWallet = () => {
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  
  const sendTransaction = async (to, amount) => {
    // Transaction logic
  }
  
  return { balance, address, sendTransaction }
}
\`\`\`

### Context Providers
\`\`\`javascript
const BitcoinContext = createContext()

export const BitcoinProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null)
  
  return (
    <BitcoinContext.Provider value={{ wallet, setWallet }}>
      {children}
    </BitcoinContext.Provider>
  )
}
\`\`\`

## Security Best Practices

### Private Key Management
- Never expose private keys
- Use secure key derivation
- Implement proper encryption
- Handle recovery scenarios

### API Security
- Secure endpoints
- Rate limiting
- Input validation
- Error handling

### Frontend Security
- XSS prevention
- CSRF protection
- Secure storage
- Content Security Policy

## Testing Strategies

### Unit Testing
\`\`\`javascript
describe('Bitcoin Transaction', () => {
  it('should create valid transaction', () => {
    const tx = createTransaction(inputs, outputs)
    expect(tx.ins.length).toBe(1)
    expect(tx.outs.length).toBe(2)
  })
})
\`\`\`

### Integration Testing
- Testnet integration
- Mock API responses
- End-to-end scenarios
- Error condition testing

## Performance Optimization

### Bundle Optimization
- Tree shaking
- Code splitting
- Lazy loading
- Service workers

### Runtime Performance
- Async operations
- Web Workers
- Caching strategies
- Memory management

## Deployment Strategies

### Production Considerations
- Environment configuration
- Secret management
- Monitoring and logging
- Error tracking

### Scaling Patterns
- Load balancing
- CDN integration
- Database optimization
- Caching layers

## Project Examples

### 1. Bitcoin Wallet Interface
Complete wallet UI with:
- Balance display
- Transaction history
- Send/receive functionality
- Address management

### 2. Payment Gateway
E-commerce integration:
- Invoice generation
- Payment processing
- Webhook handling
- Refund management

### 3. Portfolio Tracker
Investment tracking:
- Price feeds
- Portfolio analytics
- Performance metrics
- Alert systems

## Prerequisites

- Strong JavaScript/TypeScript skills
- React experience
- Understanding of Bitcoin basics
- Familiarity with async programming

## What's Included

✅ 6 hours of video content
✅ Complete source code
✅ 3 full project implementations
✅ Testing suite examples
✅ Deployment guides
✅ 1-on-1 code review session

**Price: 20,000 sats**

Perfect for frontend developers entering the Bitcoin space.`,
    tags: [
      ["d", "bitcoin-js-integration"],
      ["title", "Bitcoin JavaScript Integration"],
      [
        "summary",
        "Master Bitcoin integration in JavaScript applications using modern libraries, React patterns, and production-ready techniques.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/bitcoin-js-integration.png",
      ],
      ["price", "20000", "sats"],
      ["t", "bitcoin"],
      ["t", "javascript"],
      ["t", "react"],
      ["t", "frontend"],
      ["t", "intermediate"],
      ["published_at", "1704631300"],
      ["r", "https://github.com/bitcoin-js-examples"],
      ["r", "https://codesandbox.io/bitcoin-js-demos"],
    ],
    sig: "bitcoin_js_integration_signature",
  },

  // Lightning Payment Flows
  {
    id: "lightning-payment-flows-event",
    pubkey: realPubkeys.sarahLee,
    created_at: 1704372100,
    kind: 30402,
    content: `# Lightning Payment Flows

## Mastering Lightning Network Payment Integration

Build robust payment systems using Lightning Network APIs with proper error handling, retry logic, and user experience optimization.

## Payment Flow Architecture

### 1. Invoice Generation
\`\`\`javascript
// Generate invoice with LND
const invoice = await lnd.addInvoice({
  value: 1000,
  memo: 'Coffee payment',
  expiry: 3600
})

// Enhanced invoice with metadata
const enhancedInvoice = await lnd.addInvoice({
  value: 1000,
  memo: 'Product purchase',
  expiry: 3600,
  private: true,
  route_hints: routeHints
})
\`\`\`

### 2. Payment Processing
\`\`\`javascript
// Send payment with timeout
const paymentResult = await lnd.sendPaymentSync({
  payment_request: invoice,
  timeout_seconds: 30,
  fee_limit: {
    fixed: 100  // Maximum fee in sats
  }
})

// Handle payment result
if (paymentResult.payment_error) {
  throw new Error(\`Payment failed: \${paymentResult.payment_error}\`)
}
\`\`\`

### 3. Payment Tracking
\`\`\`javascript
// Subscribe to payment updates
const paymentStream = lnd.sendPayment({
  payment_request: invoice,
  timeout_seconds: 60
})

paymentStream.on('data', (payment) => {
  switch (payment.status) {
    case 'IN_FLIGHT':
      updateUI('Payment in progress...')
      break
    case 'SUCCEEDED':
      updateUI('Payment successful!')
      break
    case 'FAILED':
      updateUI(\`Payment failed: \${payment.failure_reason}\`)
      break
  }
})
\`\`\`

## Advanced Payment Patterns

### Streaming Payments
\`\`\`javascript
const streamPayment = async (totalAmount, duration) => {
  const interval = 1000 // 1 second intervals
  const paymentAmount = totalAmount / (duration / interval)
  
  const timer = setInterval(async () => {
    try {
      await sendMicropayment(paymentAmount)
    } catch (error) {
      clearInterval(timer)
      handleStreamError(error)
    }
  }, interval)
}
\`\`\`

### Atomic Multi-Path Payments
\`\`\`javascript
const sendAMP = async (invoice, paths) => {
  const promises = paths.map(path => 
    lnd.sendPayment({
      payment_request: invoice,
      route_hints: path.hints,
      max_parts: path.maxParts
    })
  )
  
  return Promise.all(promises)
}
\`\`\`

### Keysend Payments
\`\`\`javascript
const sendKeysend = async (destination, amount, message) => {
  const preimage = crypto.randomBytes(32)
  const hash = crypto.createHash('sha256').update(preimage).digest()
  
  return lnd.sendPayment({
    dest: destination,
    amt: amount,
    payment_hash: hash,
    dest_custom_records: {
      '34349334': Buffer.from(message, 'utf8')
    }
  })
}
\`\`\`

## Error Handling Strategies

### Retry Logic
\`\`\`javascript
const sendPaymentWithRetry = async (invoice, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await lnd.sendPaymentSync({ payment_request: invoice })
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
}
\`\`\`

### Failure Analysis
\`\`\`javascript
const analyzePaymentFailure = (failure) => {
  switch (failure.failure_reason) {
    case 'FAILURE_REASON_TIMEOUT':
      return 'Payment timed out. Try again.'
    case 'FAILURE_REASON_NO_ROUTE':
      return 'No route found. Check recipient connectivity.'
    case 'FAILURE_REASON_INSUFFICIENT_BALANCE':
      return 'Insufficient balance. Please add funds.'
    default:
      return 'Payment failed. Please try again.'
  }
}
\`\`\`

## User Experience Optimization

### Loading States
\`\`\`javascript
const PaymentComponent = () => {
  const [paymentStatus, setPaymentStatus] = useState('idle')
  
  const handlePayment = async (invoice) => {
    setPaymentStatus('processing')
    
    try {
      await sendPayment(invoice)
      setPaymentStatus('success')
    } catch (error) {
      setPaymentStatus('failed')
    }
  }
  
  return (
    <div>
      {paymentStatus === 'processing' && <LoadingSpinner />}
      {paymentStatus === 'success' && <SuccessMessage />}
      {paymentStatus === 'failed' && <ErrorMessage />}
    </div>
  )
}
\`\`\`

### Real-time Feedback
\`\`\`javascript
const usePaymentStatus = (paymentHash) => {
  const [status, setStatus] = useState('pending')
  
  useEffect(() => {
    const subscription = lnd.trackPayment({ payment_hash: paymentHash })
    
    subscription.on('data', (payment) => {
      setStatus(payment.status)
    })
    
    return () => subscription.cancel()
  }, [paymentHash])
  
  return status
}
\`\`\`

## Security Considerations

### Invoice Validation
\`\`\`javascript
const validateInvoice = (invoice) => {
  const decoded = lightningPayReq.decode(invoice)
  
  // Check expiry
  if (decoded.timeExpireDate < Date.now()) {
    throw new Error('Invoice expired')
  }
  
  // Validate amount
  if (decoded.satoshis > MAX_PAYMENT_AMOUNT) {
    throw new Error('Payment amount too large')
  }
  
  return decoded
}
\`\`\`

### Rate Limiting
\`\`\`javascript
const rateLimiter = new Map()

const checkRateLimit = (userId) => {
  const now = Date.now()
  const userLimits = rateLimiter.get(userId) || { count: 0, resetTime: now }
  
  if (now > userLimits.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + 60000 })
    return true
  }
  
  if (userLimits.count >= 10) {
    return false
  }
  
  userLimits.count++
  return true
}
\`\`\`

## Webhook Integration

### Payment Notifications
\`\`\`javascript
app.post('/webhook/payment', (req, res) => {
  const { payment_hash, status, amount } = req.body
  
  if (status === 'settled') {
    // Update database
    updatePaymentStatus(payment_hash, 'completed')
    
    // Send confirmation
    sendConfirmationEmail(payment_hash)
    
    // Trigger fulfillment
    fulfillOrder(payment_hash)
  }
  
  res.status(200).send('OK')
})
\`\`\`

### Webhook Security
\`\`\`javascript
const verifyWebhook = (req, res, next) => {
  const signature = req.headers['x-signature']
  const payload = JSON.stringify(req.body)
  
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Unauthorized')
  }
  
  next()
}
\`\`\`

## Testing Strategies

### Mock Payments
\`\`\`javascript
const mockLND = {
  sendPaymentSync: jest.fn().mockResolvedValue({
    payment_error: '',
    payment_preimage: Buffer.from('preimage'),
    payment_route: mockRoute
  })
}
\`\`\`

### Integration Testing
\`\`\`javascript
describe('Payment Flow', () => {
  it('should handle successful payment', async () => {
    const invoice = await generateTestInvoice()
    const result = await sendPayment(invoice)
    
    expect(result.status).toBe('success')
    expect(result.preimage).toBeDefined()
  })
})
\`\`\`

## Prerequisites

- Understanding of Lightning Network basics
- Experience with Node.js and async programming
- Familiarity with API integration
- Knowledge of payment processing concepts

## What You'll Build

🚀 **Payment Gateway**
- Complete payment processing system
- Webhook integration
- Admin dashboard

🚀 **Streaming Payment App**
- Real-time micropayments
- Content monetization
- Usage tracking

🚀 **Multi-Path Payment System**
- Optimized routing
- Failure recovery
- Performance monitoring

**Price: 22,000 sats**

For developers building Lightning-powered applications.`,
    tags: [
      ["d", "lightning-payment-flows"],
      ["title", "Lightning Payment Flows"],
      [
        "summary",
        "Master Lightning Network payment integration with robust error handling, retry logic, and optimal user experience patterns.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/lightning-payment-flows.png",
      ],
      ["price", "22000", "sats"],
      ["t", "lightning"],
      ["t", "payments"],
      ["t", "api"],
      ["t", "backend"],
      ["t", "intermediate"],
      ["published_at", "1704372100"],
      ["r", "https://github.com/lightning-payment-examples"],
      ["r", "https://lightning-test-environment.com"],
    ],
    sig: "lightning_payment_flows_signature",
  },

  // Bitcoin Script Programming (Paid)
  {
    id: "bitcoin-script-programming-event",
    pubkey: realPubkeys.sarahChen,
    created_at: 1705315900,
    kind: 30402,
    content: `# Bitcoin Script Programming

## Advanced Bitcoin Script Development

Master the art of Bitcoin script programming with this comprehensive course covering custom scripts, security patterns, and advanced use cases.

## What You'll Learn

### 1. Script Types
- Pay-to-Script-Hash (P2SH)
- Pay-to-Witness-Script-Hash (P2WSH)
- Multi-signature scripts
- Time-locked scripts

### 2. Custom Script Development
- Writing secure scripts
- Common script patterns
- Testing and debugging
- Security considerations

### 3. Advanced Use Cases
- Escrow systems
- Atomic swaps
- Payment channels
- Smart contracts

## Prerequisites
- Strong understanding of Bitcoin transactions
- Basic programming experience
- Familiarity with cryptographic concepts

## Course Structure
- 12 comprehensive modules
- Hands-on exercises
- Real-world examples
- Expert mentorship
`,
    tags: [
      ["title", "Bitcoin Script Programming"],
      [
        "summary",
        "Master advanced Bitcoin script development with custom scripts, security patterns, and real-world use cases.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/bitcoin-script.png",
      ],
      ["price", "15000", "sats"],
      ["t", "bitcoin"],
      ["t", "script"],
      ["t", "programming"],
      ["t", "advanced"],
      ["published_at", "1705315900"],
    ],
    sig: "bitcoin_script_programming_signature",
  },

  // Bitcoin API Integration (Paid)
  {
    id: "bitcoin-api-integration-event",
    pubkey: realPubkeys.lisaPark,
    created_at: 1705316000,
    kind: 30402,
    content: `# Bitcoin API Integration

## Building Production Bitcoin Applications

Learn to integrate Bitcoin APIs into your applications with proper error handling, security practices, and scalable architecture.

## Course Content

### 1. API Fundamentals
- Bitcoin Core RPC API
- Block explorers APIs
- Mempool APIs
- Wallet service APIs

### 2. Security Best Practices
- API key management
- Rate limiting
- Input validation
- Error handling

### 3. Production Patterns
- Caching strategies
- Retry logic
- Monitoring and alerting
- Performance optimization

## Practical Projects
- Wallet balance tracker
- Transaction monitor
- Payment processor
- Block explorer interface
`,
    tags: [
      ["title", "Bitcoin API Integration"],
      [
        "summary",
        "Learn to integrate Bitcoin APIs into production applications with proper security and scalability practices.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/bitcoin-api.png",
      ],
      ["price", "8000", "sats"],
      ["t", "bitcoin"],
      ["t", "api"],
      ["t", "integration"],
      ["t", "intermediate"],
      ["published_at", "1705316000"],
    ],
    sig: "bitcoin_api_integration_signature",
  },

  // Lightning Implementation (Paid)
  {
    id: "lightning-implementation-event",
    pubkey: realPubkeys.mariaSantos,
    created_at: 1705316100,
    kind: 30402,
    content: `# Lightning Network Implementation

## Building Lightning Applications

Deep dive into Lightning Network implementation with hands-on experience building channels, routing, and payment systems.

## Advanced Topics

### 1. Channel Management
- Channel opening strategies
- Liquidity management
- Fee optimization
- Channel closing procedures

### 2. Payment Routing
- Pathfinding algorithms
- Route optimization
- Failure handling
- Multi-path payments

### 3. Production Deployment
- Node management
- Monitoring systems
- Backup strategies
- Disaster recovery

## Includes
- Complete codebase
- Production deployment guide
- 1-on-1 mentorship
- Community access
`,
    tags: [
      ["title", "Lightning Network Implementation"],
      [
        "summary",
        "Advanced Lightning Network development with production deployment and real-world implementation patterns.",
      ],
      [
        "image",
        "https://plebdevs-bucket.nyc3.cdn.digitaloceanspaces.com/images/lightning-implementation.png",
      ],
      ["price", "25000", "sats"],
      ["t", "lightning"],
      ["t", "implementation"],
      ["t", "advanced"],
      ["published_at", "1705316100"],
    ],
    sig: "lightning_implementation_signature",
  },
];

// ============================================================================
// EXPORT ALL NOSTR EVENTS
// ============================================================================

export const allNostrEvents = [
  ...nostrCourseListEvents,
  ...nostrFreeContentEvents,
  ...nostrPaidContentEvents,
];
