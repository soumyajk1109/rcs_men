"use server"

import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { adminCredentials, clearSession, readSession, writeSession } from "@/lib/admin-session"
import { writeContent } from "@/lib/content-store"
import type { StoreContent } from "@/lib/store-content"

function same(left: string, right: string) {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return mismatch === 0
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "")
  const password = String(formData.get("password") ?? "")
  const expected = adminCredentials()
  if (!same(username, expected.username) || !same(password, expected.password)) {
    return { error: "Those credentials are not recognised." }
  }
  await writeSession()
  redirect("/admin")
}

export async function logout() {
  await clearSession()
  redirect("/admin/login")
}

export async function saveStoreContent(input: StoreContent) {
  if (!(await readSession())) return { error: "Sign in again." }
  try {
    const content = await writeContent(input)
    revalidatePath("/", "layout")
    return { content }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save." }
  }
}

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}

export async function uploadAdminImage(formData: FormData) {
  if (!(await readSession())) return { error: "Sign in again." }
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." }
  const extension = imageTypes[file.type]
  if (!extension) return { error: "Use a JPG, PNG, WEBP, or GIF." }
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8 MB." }
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
  const directory = path.join(process.cwd(), "public", "uploads")
  await fs.promises.mkdir(directory, { recursive: true })
  await fs.promises.writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()))
  return { src: `/uploads/${name}` }
}
