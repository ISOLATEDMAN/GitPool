import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities, users, repositories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const eventType = req.headers.get("x-github-event");
    const body = await req.json();


    const repoData = body.repository;
    const senderData = body.sender;


    if (!repoData || !senderData) {
        return NextResponse.json({ message: "Ignored" }, { status: 200 });
    }

    console.log(`🔔 Event: ${eventType} | Action: ${body.action || 'N/A'}`);


    let [repo] = await db.select().from(repositories).where(eq(repositories.githubId, repoData.id));
    if (!repo) {
      [repo] = await db.insert(repositories).values({
        githubId: repoData.id,
        name: repoData.name,
        orgName: repoData.organization?.login || senderData.login,
      }).returning();
    }

    let [user] = await db.select().from(users).where(eq(users.githubId, senderData.id));
    if (!user) {
      [user] = await db.insert(users).values({
        githubId: senderData.id,
        username: senderData.login,
        avatarUrl: senderData.avatar_url,
      }).returning();
    }

    if (eventType === "push") {
      const commits = body.commits || [];
      for (const commit of commits) {
        await db.insert(activities).values({
          userId: user.id,
          repositoryId: repo.id,
          type: 'PUSH',
          title: commit.message,
          refId: commit.id,
          points: 1, 
        });
      }
    }


    if (eventType === "pull_request") {
        const pr = body.pull_request;
        
        if (body.action === "opened") {
            await db.insert(activities).values({
                userId: user.id,
                repositoryId: repo.id,
                type: 'PR_OPENED',
                title: pr.title,
                refId: String(pr.number),
                points: 10,
                additions: pr.additions, 
                deletions: pr.deletions, 
            });
        }

        if (body.action === "closed" && pr.merged === true) {
            console.log(`PR got Merged! +${pr.additions} -${pr.deletions} lines`);
            
            await db.insert(activities).values({
                userId: user.id,
                repositoryId: repo.id,
                type: 'PR_MERGED',
                title: pr.title,
                refId: String(pr.number),
                points: 50,
                

                additions: pr.additions,
                deletions: pr.deletions,
            });
        }
    }


    if (eventType === "issues") {
        const issue = body.issue;


        if (body.action === "closed") {
            await db.insert(activities).values({
                userId: user.id,
                repositoryId: repo.id,
                type: 'ISSUE_CLOSED',
                title: issue.title,
                refId: String(issue.number),
                points: 20, 
            });
        }
    }

    if (eventType === "pull_request_review" && body.action === "submitted") {
        await db.insert(activities).values({
            userId: user.id,
            repositoryId: repo.id,
            type: 'CODE_REVIEW',
            title: `Reviewed PR #${body.pull_request.number}`,
            refId: String(body.review.id),
            points: 15, 
        });
    }

    return NextResponse.json({ message: "Processed" }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}