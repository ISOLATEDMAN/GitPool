# 🏆 GitPool

**Gamified Developer Leaderboard for GitHub Organizations**

GitPool transforms your GitHub organization's activity into a competitive leaderboard. Track commits, PRs, code reviews, and issues - all visualized in a beautiful, real-time dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)

---

## ✨ Features

- **Real-time Leaderboard** - Live updates via GitHub webhooks
- **Points System** - Gamified scoring for all contributions
- **Tier Rankings** - S/A/B/C/D tiers based on performance
- **Activity Feed** - See what your team is shipping
- **Analytics Dashboard** - Commits, PRs, reviews, lines of code
- **Beautiful UI** - Clean, modern design with shadcn/ui

---

## 🎮 Points System

| Activity | Points | Description |
|----------|--------|-------------|
| **Commit (Push)** | `1 pt` | Each commit pushed to any repo |
| **PR Opened** | `10 pts` | Opening a new pull request |
| **PR Merged** | `50 pts` | Successfully merging a PR |
| **Issue Closed** | `20 pts` | Closing/resolving an issue |
| **Code Review** | `15 pts` | Submitting a PR review |

### Tier System

Tiers are calculated relative to the **top contributor's score**:

| Tier | Score Range | Label |
|------|-------------|-------|
| 🥇 **S** | 90-100% of leader | Elite |
| 🥈 **A** | 70-89% of leader | High Performer |
| 🥉 **B** | 50-69% of leader | Above Average |
| ⭐ **C** | 25-49% of leader | Average |
| 📈 **D** | <25% of leader | Rising |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | UI components |
| **Drizzle ORM** | Database queries |
| **PostgreSQL** | Database (Neon/Supabase/Local) |
| **Recharts** | Data visualization |
| **Lucide React** | Icons |

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gitpool.git
cd gitpool
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database (PostgreSQL) - REQUIRED
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Optional: GitHub Webhook Secret (for signature verification)
GITHUB_WEBHOOK_SECRET="your-webhook-secret"
```

#### Database Provider Examples:

| Provider | Example URL |
|----------|-------------|
| **Neon** | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require` |
| **Supabase** | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres` |
| **Railway** | `postgresql://postgres:pass@containers-xxx.railway.app:5432/railway` |
| **Local** | `postgresql://postgres:password@localhost:5432/gitpool` |

### 4. Set up the database

```bash
# Generate migrations from schema
pnpm drizzle-kit generate

# Push schema to database
pnpm drizzle-kit push

# (Optional) Open Drizzle Studio to view/edit data
pnpm drizzle-kit studio
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 🔗 GitHub Webhook Setup

GitPool receives real-time updates through GitHub webhooks. This is how your activity data flows into the leaderboard.

### Step 1: Expose your local server (Development)

Use **ngrok** to create a public URL:

```bash
# Install ngrok (if not installed)
brew install ngrok  # macOS
# or download from https://ngrok.com

# Start tunnel
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 2: Create the webhook in GitHub

1. Go to your **GitHub Organization** → **Settings** → **Webhooks**
   - Or for a single repo: **Repo** → **Settings** → **Webhooks**
2. Click **Add webhook**
3. Configure:

| Field | Value |
|-------|-------|
| **Payload URL** | `https://your-ngrok-url.ngrok.io/api/webhook/github` |
| **Content type** | `application/json` |
| **Secret** | *(optional)* Set a secret and add to `.env` as `GITHUB_WEBHOOK_SECRET` |
| **SSL verification** | Enable |
| **Events** | Select individual events (see below) |

### Step 3: Select these events

Check the following events to track:

- [x] **Pushes** - Track commits
- [x] **Pull requests** - Track PR opened/merged
- [x] **Pull request reviews** - Track code reviews
- [x] **Issues** - Track issue closures

Click **Add webhook** to save.

### Step 4: Test the webhook

Make a commit or open a PR, then check:
1. GitHub webhook **Recent Deliveries** tab for success/failure
2. Your terminal for webhook logs
3. The dashboard for new activity

---

## 📁 Project Structure

```
gitpool/
├── app/
│   ├── page.tsx                    # Main dashboard UI
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles + animations
│   ├── actions/
│   │   └── get-dashboard-data.ts   # Server action - fetches & aggregates data
│   └── api/
│       └── webhook/
│           └── github/
│               └── route.ts        # Webhook endpoint - receives GitHub events
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── scroll-area.tsx
│   │   └── ...
│   └── tier-chart.tsx              # Tier distribution bar chart
├── db/
│   ├── index.ts                    # Drizzle client initialization
│   └── schema.ts                   # Database table definitions
├── drizzle/                        # Auto-generated migration files
├── lib/
│   └── utils.ts                    # Utility functions (cn, etc.)
├── drizzle.config.ts               # Drizzle Kit configuration
├── .env                            # Environment variables (create this!)
├── .env.example                    # Example env file
├── package.json
└── README.md
```

---

## 🗄 Database Schema

### `users` table
Stores GitHub users who have contributed.

```typescript
{
  id: serial,              // Primary key
  githubId: integer,       // GitHub user ID (unique)
  username: text,          // GitHub username
  avatarUrl: text          // Profile picture URL
}
```

### `repositories` table
Stores repositories being tracked.

```typescript
{
  id: serial,              // Primary key
  githubId: integer,       // GitHub repo ID (unique)
  name: text,              // Repository name
  orgName: text            // Organization/owner name
}
```

### `activities` table
Stores all tracked activities (the core data).

```typescript
{
  id: serial,              // Primary key
  userId: integer,         // FK → users.id
  repositoryId: integer,   // FK → repositories.id
  type: text,              // 'PUSH' | 'PR_OPENED' | 'PR_MERGED' | 'CODE_REVIEW' | 'ISSUE_CLOSED'
  title: text,             // Commit message / PR title / etc.
  refId: text,             // Unique ID (commit SHA, PR number, etc.)
  points: integer,         // Points awarded for this activity
  additions: integer,      // Lines added (for PRs)
  deletions: integer,      // Lines deleted (for PRs)
  createdAt: timestamp     // When the activity occurred
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   ```
   DATABASE_URL=your-production-database-url
   GITHUB_WEBHOOK_SECRET=your-secret (optional)
   ```
4. Deploy!

### Update your webhook URL

After deployment, update your GitHub webhook to:
```
https://your-app-name.vercel.app/api/webhook/github
```

### Other Platforms

Works on any platform that supports Next.js:
- **Railway** - One-click deploy
- **Render** - Free tier available
- **Fly.io** - Edge deployment
- **AWS/GCP/Azure** - Container deployment

---

## 🔧 Drizzle ORM Commands

```bash
# Generate migration files from schema changes
pnpm drizzle-kit generate

# Push schema directly to database (development)
pnpm drizzle-kit push

# Apply migrations (production)
pnpm drizzle-kit migrate

# Open Drizzle Studio (database GUI)
pnpm drizzle-kit studio

# Drop all tables (careful!)
pnpm drizzle-kit drop
```

---

## ⚙️ Configuration

### Customizing Point Values

Edit `app/api/webhook/github/route.ts`:

```typescript
// Push/Commit
points: 1,

// PR Opened  
points: 10,

// PR Merged (the big one!)
points: 50,

// Issue Closed
points: 20,

// Code Review
points: 15,
```

### Customizing Tier Thresholds

Edit `app/actions/get-dashboard-data.ts`:

```typescript
function assignTierByScore(score: number, maxScore: number) {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return { tier: 'S' };  // Top 10%
  if (percentage >= 70) return { tier: 'A' };  // 70-89%
  if (percentage >= 50) return { tier: 'B' };  // 50-69%
  if (percentage >= 25) return { tier: 'C' };  // 25-49%
  return { tier: 'D' };                         // <25%
}
```

### Adding New Activity Types

1. Add the webhook event handler in `route.ts`
2. Create a new activity type (e.g., `'DISCUSSION_CREATED'`)
3. Assign appropriate points
4. Update the UI to display the new type

---

## 🔒 Security

### Webhook Signature Verification (Optional but Recommended)

To verify that webhooks are actually from GitHub:

1. Set a secret when creating the webhook in GitHub
2. Add to your `.env`:
   ```
   GITHUB_WEBHOOK_SECRET=your-secret-here
   ```
3. Add verification in `route.ts`:
   ```typescript
   import crypto from 'crypto';
   
   const signature = req.headers.get('x-hub-signature-256');
   const body = await req.text();
   const hash = 'sha256=' + crypto
     .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET!)
     .update(body)
     .digest('hex');
   
   if (signature !== hash) {
     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
   }
   ```

---

## 🐛 Troubleshooting

### Webhook not receiving events
- Check the webhook URL is correct (include `/api/webhook/github`)
- Verify ngrok is running (for local dev)
- Check GitHub webhook "Recent Deliveries" for errors

### Database connection issues
- Verify `DATABASE_URL` is correct
- Check if SSL is required (`?sslmode=require`)
- Ensure database allows connections from your IP

### Activities not showing
- Check server logs for errors
- Verify the event types are selected in GitHub webhook settings
- Run `pnpm drizzle-kit studio` to inspect the database

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - use it for your team, hack it, make it yours!

---

## 🙏 Built With

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [Recharts](https://recharts.org/) - Charts

---

**Built with ❤️ for developers who ship**
