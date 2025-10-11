export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { prisma } from "@/lib/prisma"

type ParsedKey = { key: string; namespace: string; entityId?: string | null; path?: string | null }

function parseTotalKey(key: string): ParsedKey | null {
  // formats:
  // - views:content:<id>
  // - views:lesson:<id>
  // - views:path:/content/abc
  if (!key.startsWith("views:")) return null
  const rest = key.slice("views:".length)
  if (rest.startsWith("path:")) {
    return { key, namespace: "path", entityId: null, path: rest.slice("path:".length) || "/" }
  }
  const idx = rest.indexOf(":")
  if (idx === -1) return null
  const ns = rest.slice(0, idx)
  const id = rest.slice(idx + 1)
  return { key, namespace: ns, entityId: id || null, path: null }
}

function parseDailyKey(dayKey: string): { dayISO: string; inner: ParsedKey } | null {
  // format: views:daily:YYYY-MM-DD:views:content:<id>
  if (!dayKey.startsWith("views:daily:")) return null
  const afterDaily = dayKey.slice("views:daily:".length)
  const day = afterDaily.slice(0, 10)
  const inner = afterDaily.slice(11)
  const parsed = parseTotalKey(inner)
  if (!parsed) return null
  return { dayISO: day, inner: parsed }
}

async function flushTotals(): Promise<number> {
  const keys = (await kv.smembers<string>("views:dirty")) || []
  if (!keys.length) return 0

  // Fetch counts in parallel
  const pairs = await Promise.all(
    keys.map(async (k) => [k, (await kv.get<number>(k)) ?? 0] as const)
  )

  // Upsert into DB
  for (const [k, count] of pairs) {
    const parsed = parseTotalKey(k)
    if (!parsed) continue
    await prisma.viewCounterTotal.upsert({
      where: { key: parsed.key },
      create: {
        key: parsed.key,
        namespace: parsed.namespace,
        entityId: parsed.entityId ?? null,
        path: parsed.path ?? null,
        total: Number(count) || 0,
      },
      update: {
        namespace: parsed.namespace,
        entityId: parsed.entityId ?? null,
        path: parsed.path ?? null,
        total: Number(count) || 0,
      },
    })
  }

  // Remove from dirty set after successful upsert
  await kv.srem("views:dirty", ...keys)
  return keys.length
}

async function flushDaily(): Promise<number> {
  const days = (await kv.smembers<string>("views:dirty:daily-index")) || []
  let processed = 0
  for (const day of days) {
    const setKey = `views:dirty:daily:${day}`
    const dayKeys = (await kv.smembers<string>(setKey)) || []
    if (!dayKeys.length) {
      // clean the index entry and continue
      await kv.srem("views:dirty:daily-index", day)
      continue
    }
    const pairs = await Promise.all(
      dayKeys.map(async (k) => [k, (await kv.get<number>(k)) ?? 0] as const)
    )
    for (const [dk, count] of pairs) {
      const parsed = parseDailyKey(dk)
      if (!parsed) continue
      const dayDate = new Date(`${parsed.dayISO}T00:00:00.000Z`)
      await prisma.viewCounterDaily.upsert({
        where: { key_day: { key: parsed.inner.key, day: dayDate } },
        create: {
          key: parsed.inner.key,
          day: dayDate,
          count: Number(count) || 0,
        },
        update: {
          count: Number(count) || 0,
        },
      })
    }
    await kv.srem(setKey, ...dayKeys)
    await kv.srem("views:dirty:daily-index", day)
    processed += dayKeys.length
  }
  return processed
}

function isAuthorized(req: NextRequest): boolean {
  // Allow Vercel Cron (automatic header) or token query param
  const hasCronHeader = Boolean(req.headers.get("x-vercel-cron"))
  const token = req.nextUrl.searchParams.get("token")
  const expected = process.env.VIEWS_CRON_SECRET
  return hasCronHeader || (!!expected && token === expected)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const totals = await flushTotals()
  const daily = await flushDaily()
  return NextResponse.json({ flushedTotals: totals, flushedDaily: daily })
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const totals = await flushTotals()
  const daily = await flushDaily()
  return NextResponse.json({ flushedTotals: totals, flushedDaily: daily })
}

