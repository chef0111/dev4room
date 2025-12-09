<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=31648C" alt="postgresql" />
    <img src="https://img.shields.io/badge/-ShadCN_UI-black?style=for-the-badge&logoColor=white&logo=shadcnui&color=000000" alt="shadcnui" />
    <img src="https://img.shields.io/badge/-Open_AI-black?style=for-the-badge&logoColor=white&logo=openai&color=412991" alt="openai" />
  </div>

  <h3 align="center">Dev4Room</h3>

   <div align="center">
     Build a community-driven platform for developers to ask questions, post answers, and get help from other developers.
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🔗 [Assets](#links)

## <a name="introduction">🤖 Introduction</a>

Dev4Room is a community-driven Q&A platform for developers, inspired by StackOverflow but enhanced with modern features like AI-powered answers, semantic search, and gamification. Built with Next.js 16, this full-stack application demonstrates production-ready patterns using the latest App Router features, Server Components, and type-safe APIs.

The platform enables developers to ask questions, post answers, leverage AI for answer generation and enhancement, vote on content, organize saved questions, and discover content through semantic search. Users can build their reputation through contributions, earn badges for achievements, and engage with a gamified system that rewards active participation.

The project uses PostgreSQL with Neon for the database layer, Better-Auth for flexible authentication (Email/Password, GitHub, Google OAuth), and pgvector for AI-powered semantic search. The codebase is organized with a clean separation of concerns—server procedures handle business logic, components manage UI, and services encapsulate complex operations like vector embeddings and indexing. Type safety is maintained throughout with oRPC for end-to-end type-safe API calls, Zod for validation, and TypeScript for compile-time safety.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- Better-Auth
- oRPC
- Arcjet
- PostgreSQL
- Neon
- Zod
- OpenAI
- ShadCN UI
- TypeScript
- TailwindCSS

## <a name="features">🔋 Features</a>

### 🔐 Authentication & User Management

- **Email/Password Authentication** - Secure registration and login with email verification
- **OAuth Integration** - Sign in with Google or GitHub
- **Password Management** - Forgot password and reset functionality with OTP verification
- **User Profiles** - Customizable profiles with name, username, portfolio link, location, and bio
- **User Statistics** - Track questions, answers, reputation points, and badges

### ❓ Questions

- **Create Questions** - Post questions with markdown support and tag association
- **Edit & Delete** - Full CRUD operations for questions
- **Question Details** - View detailed question pages with answers, author info, and metrics
- **Pagination & Filtering** - Browse questions with pagination and search filters
- **Top Questions** - Discover trending questions sorted by views and upvotes
- **View Tracking** - Automatic view count tracking for questions

### 💬 Answers

- **Post Answers** - Answer questions with rich markdown formatting
- **Edit & Delete** - Manage your answers with full editing capabilities
- **AI-Powered Answers** - Generate and enhance answers using OpenAI
- **Answer Validation** - AI validates answer relevance before enhancement
- **Pagination** - Navigate through answers with pagination support

### 🏷️ Tags

- **Tag System** - Categorize questions with tags
- **Tag Pages** - Browse questions by specific tags
- **Popular Tags** - Discover trending tags in the community
- **Tag Filtering** - Filter questions by tags

### 👍 Voting System

- **Upvote/Downvote** - Vote on questions and answers
- **Vote Status** - Check your voting status on any content
- **Reputation Impact** - Votes contribute to user reputation

### ⭐ Collections (Bookmarks)

- **Save Questions** - Bookmark questions for later reference
- **Collection Management** - View and manage your saved questions
- **Toggle Save** - Easily add or remove questions from collections

### 🔍 Search

- **Semantic Search** - AI-powered semantic search using pgvector and OpenAI embeddings
- **Global Command Menu** - Quick search with `Cmd+K` (Mac) or `Ctrl+K` (Windows)
- **Multi-Entity Search** - Search across questions, answers, tags, and users
- **Similarity-Based Results** - Results ranked by semantic similarity
- **Real-time Search** - Debounced search with instant results

### 🤖 AI Features

- **AI Answer Generation** - Generate answers using OpenAI
- **Answer Enhancement** - Improve and format your answers with AI assistance
- **Relevance Validation** - AI validates that answers are related to questions
- **Markdown Formatting** - AI-generated answers include proper markdown formatting

### 🏆 Reputation & Badges

- **Reputation Points** - Earn reputation through questions, answers, and votes
- **Badge System** - Unlock Gold, Silver, and Bronze badges based on:
  - Question count
  - Answer count
  - Question upvotes
  - Answer upvotes
  - Total views

### 🎨 User Interface

- **Responsive Design** - Fully responsive layout for all devices
- **Dark Mode** - Seamless dark/light theme switching
- **Command Menu** - Quick navigation and search with keyboard shortcuts
- **Markdown Editor** - Rich markdown editor for questions and answers
- **Code Highlighting** - Syntax highlighting for code blocks
- **Loading States** - Smooth loading indicators throughout the app
- **Error Handling** - Comprehensive error handling with user-friendly messages

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/chef0111/dev4room.git
cd dev4room
```

**Installation**

Install the project dependencies using pnpm:

```bash
npm i -g pnpm # Run this if you don't have pnpm installed
pnpm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_APP_URL=

# Better-Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Database
DATABASE_URL=

# Arcjet
ARCJET_KEY=

# OpenAPI
OPENAI_API_KEY=

EMBEDDING_MODEL=
EMBEDDING_DIMENSIONS=
```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up on the respective websites

**Running the Project**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="links">🔗 Assets</a>

Assets used in the project can be found [here](https://drive.google.com/file/d/18Lx36LFiQrAhuhmcQYDzG3FgQMCjwXdX/view?usp=sharing)
