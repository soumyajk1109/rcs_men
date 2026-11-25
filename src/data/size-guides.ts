export type SizeGuide = {
  note: string
  columns: string[]
  rows: { size: string; values: string[] }[]
}

const sizes = ["S", "M", "L", "XL", "XXL"]

function guide(
  note: string,
  headers: string[],
  measurements: string[][],
): SizeGuide {
  return {
    note,
    columns: headers,
    rows: sizes.map((size, index) => ({
      size,
      values: measurements[index] ?? [],
    })),
  }
}

export const sizeGuides: Record<string, SizeGuide> = {
  "oversized-t-shirts": guide(
    "Garment measurements in centimetres, taken flat. This tee is cut long with a dropped shoulder.",
    ["Chest", "Length", "Shoulder"],
    [
      ["56", "70", "52"],
      ["58", "72", "54"],
      ["61", "74", "56"],
      ["64", "76", "58"],
      ["67", "78", "60"],
    ],
  ),
  shirts: guide(
    "Garment measurements in centimetres, taken flat. The shirt is meant to sit easy through the body.",
    ["Chest", "Length", "Sleeve"],
    [
      ["54", "74", "62"],
      ["56", "75", "63"],
      ["59", "77", "64"],
      ["62", "78", "65"],
      ["65", "80", "66"],
    ],
  ),
  "co-ord-sets": guide(
    "Top measurements in centimetres. The trouser uses the same letter size, with a relaxed thigh.",
    ["Chest", "Top length", "Waist"],
    [
      ["54", "72", "76"],
      ["56", "73", "80"],
      ["59", "75", "84"],
      ["62", "76", "88"],
      ["65", "78", "92"],
    ],
  ),
  outerwear: guide(
    "Garment measurements in centimetres. Leave room to wear a shirt underneath.",
    ["Chest", "Length", "Shoulder"],
    [
      ["58", "72", "48"],
      ["60", "74", "50"],
      ["63", "76", "52"],
      ["66", "78", "54"],
      ["69", "80", "56"],
    ],
  ),
}

export function getSizeGuide(category: string) {
  return sizeGuides[category] ?? sizeGuides.shirts
}
