import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { connection } from "next/server"

const COOKIE = "rcs-admin"
const TWELVE_HOURS = 60 * 60 * 12

export function adminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "Ranebennur50458",
  }
}

function secret() {
  return process.env.ADMIN_SECRET || "ranebennur-cloth-stores-admin"
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url")
}

function same(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function readSession() {
  await connection()
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return false
  const [exp, signature] = token.split(".")
  if (!exp || !signature || !same(signature, sign(exp))) return false
  return Number(exp) > Date.now()
}

export async function writeSession() {
  const exp = String(Date.now() + TWELVE_HOURS * 1000)
  const jar = await cookies()
  jar.set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: TWELVE_HOURS,
  })
}

export async function clearSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}
