import fs from "fs"
import path from "path"
import { connection } from "next/server"
import { assertContent, seedContent, type StoreContent } from "@/lib/store-content"

const file = path.join(process.cwd(), "data", "content.json")

export async function getContent(): Promise<StoreContent> {
  await connection()
  try {
    const raw = await fs.promises.readFile(file, "utf8")
    return assertContent(JSON.parse(raw))
  } catch {
    return seedContent()
  }
}

export async function writeContent(input: unknown) {
  const content = assertContent(input)
  await fs.promises.mkdir(path.dirname(file), { recursive: true })
  await fs.promises.writeFile(file, JSON.stringify(content, null, 2), "utf8")
  return content
}
