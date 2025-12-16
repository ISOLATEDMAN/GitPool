import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function testLeaderboard() {
  console.log('Testing leaderboard query...');
  
  // This is the exact query from get-dashboard-data.ts
  const leaderboard = await db.execute(sql`
    SELECT 
      u.user_name as username,
      u.avatar_url as avatar,
      u.is_active,
      coalesce(sum(a.points), 0) as points,
      count(distinct a.repository_id) as project_count,
      coalesce(sum(case when a.type = 'PUSH' then 1 else 0 end), 0) as commits,
      coalesce(sum(case when a.type = 'PR_MERGED' then 1 else 0 end), 0) as prs_merged,
      coalesce(sum(case when a.type = 'ISSUE_CLOSED' then 1 else 0 end), 0) as issues_closed
    FROM users u
    LEFT JOIN activities a ON a.user_id = u.id
    WHERE u.is_active = true
    GROUP BY u.id, u.user_name, u.avatar_url, u.is_active
    ORDER BY coalesce(sum(a.points), 0) DESC
  `);
  
  console.log('Leaderboard result:', leaderboard);
  
  await client.end();
  process.exit(0);
}

testLeaderboard();
