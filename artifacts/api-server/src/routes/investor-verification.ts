import { Router } from "express";
import { db, investorsTable, holdingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const ADMIN_PASSWORD = "$10$10$10";

const router = Router();

function checkAdminAuth(req: any, res: any): boolean {
  const pw = req.headers["x-admin-password"];
  if (pw !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized." });
    return false;
  }
  return true;
}

// GET /api/investors/pending — list all pending investors
router.get("/pending", async (req, res) => {
  try {
    const pendingInvestors = await db
      .select()
      .from(investorsTable)
      .where(eq(investorsTable.status, "pending"))
      .orderBy(desc(investorsTable.createdAt));

    const holdings = await db.select().from(holdingsTable);
    const holdingMap = new Map(holdings.map((h) => [h.investorId, h]));

    res.json(
      pendingInvestors.map((inv) => {
        const h = holdingMap.get(inv.id);
        return {
          id: inv.id,
          fullName: inv.fullName,
          email: inv.email,
          status: inv.status,
          createdAt: inv.createdAt.toISOString(),
          shares: h?.shares ?? "0",
          avgCost: h?.avgCost ?? "0",
        };
      })
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list pending investors");
    res.status(500).json({ error: "Something went wrong." });
  }
});

// POST /api/investors/batch-approve — approve multiple investors
router.post("/batch-approve", async (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  const parsed = z
    .object({ investorIds: z.array(z.number().int().positive()) })
    .safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input. Provide investorIds array." });
    return;
  }

  try {
    const updated = await db
      .update(investorsTable)
      .set({ status: "approved" })
      .where(
        eq(investorsTable.status, "pending") // Only update pending investors
      )
      .returning();

    // Filter to only the requested IDs
    const approvedInvestors = updated.filter((inv) =>
      parsed.data.investorIds.includes(inv.id)
    );

    res.json({
      message: `${approvedInvestors.length} investors approved`,
      approved: approvedInvestors.map((inv) => ({
        id: inv.id,
        email: inv.email,
        fullName: inv.fullName,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to batch approve investors");
    res.status(500).json({ error: "Something went wrong." });
  }
});

// GET /api/investors/search — search investors by email or name
router.get("/search", async (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  const query = req.query.q as string;
  if (!query || query.length < 2) {
    res.status(400).json({ error: "Search query must be at least 2 characters" });
    return;
  }

  try {
    const searchTerm = `%${query.toLowerCase()}%`;
    const results = await db
      .select()
      .from(investorsTable)
      .where(
        // Simple LIKE search - in production use full-text search
        eq(investorsTable.status, "pending")
      )
      .orderBy(desc(investorsTable.createdAt));

    // Filter in memory for demo
    const filtered = results.filter(
      (inv) =>
        inv.email.toLowerCase().includes(query.toLowerCase()) ||
        inv.fullName.toLowerCase().includes(query.toLowerCase())
    );

    const holdings = await db.select().from(holdingsTable);
    const holdingMap = new Map(holdings.map((h) => [h.investorId, h]));

    res.json(
      filtered.map((inv) => {
        const h = holdingMap.get(inv.id);
        return {
          id: inv.id,
          fullName: inv.fullName,
          email: inv.email,
          status: inv.status,
          createdAt: inv.createdAt.toISOString(),
          shares: h?.shares ?? "0",
          avgCost: h?.avgCost ?? "0",
        };
      })
    );
  } catch (err) {
    req.log.error({ err }, "Failed to search investors");
    res.status(500).json({ error: "Something went wrong." });
  }
});

// GET /api/investors/stats — get investor statistics
router.get("/stats", async (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  try {
    const investors = await db.select().from(investorsTable);

    const stats = {
      total: investors.length,
      pending: investors.filter((i) => i.status === "pending").length,
      approved: investors.filter((i) => i.status === "approved").length,
      rejected: investors.filter((i) => i.status === "rejected").length,
      approvalRate:
        investors.length > 0
          ? (
              (investors.filter((i) => i.status === "approved").length /
                investors.length) *
              100
            ).toFixed(2)
          : "0",
    };

    res.json(stats);
  } catch (err) {
    req.log.error({ err }, "Failed to get investor statistics");
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
