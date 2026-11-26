/**
 * Editable catalog. Prices are INR.
 * Images live in public/images. Point `src` at a new file to replace a photo.
 */
export type SizeStock = {
  label: string
  stock: number
}

export type ProductImage = {
  src: string
  alt: string
}

export type ProductColour = {
  id: string
  name: string
  hex: string
  images: ProductImage[]
  sizes: SizeStock[]
}

export type Product = {
  id: string
  slug: string
  name: string
  category: CategorySlug
  price: number
  description: string
  fabric: string
  care: string[]
  colours: ProductColour[]
  newArrival: boolean
  sortOrder: number
  createdAt: string
}

export type Audience = "men" | "women" | "kids"

export type CategorySlug = string

export type Category = {
  slug: CategorySlug
  name: string
  blurb: string
  image: string
  imageAlt: string
  audience: Audience
}

const labels = ["S", "M", "L", "XL", "XXL"] as const

function sizes(counts: number[]): SizeStock[] {
  return labels.map((label, index) => ({
    label,
    stock: counts[index] ?? 0,
  }))
}

export const sizeLabels = [...labels]

export const categories: Category[] = [
  {
    slug: "oversized-t-shirts",
    name: "Oversized T-shirts",
    blurb: "Dropped shoulders and long hems.",
    image: "/images/tee-charcoal.jpg",
    imageAlt: "Man in a charcoal oversized t-shirt and tan shorts.",
    audience: "men",
  },
  {
    slug: "shirts",
    name: "Shirts",
    blurb: "Checks, camp collars, and overshirts.",
    image: "/images/shirt-brick.jpg",
    imageAlt: "Man in a black, white, and red check shirt against a brick wall.",
    audience: "men",
  },
  {
    slug: "co-ord-sets",
    name: "Co-ord Sets",
    blurb: "Matching tops and bottoms in one cloth.",
    image: "/images/coord-ivory.jpg",
    imageAlt: "Man in an ivory linen shirt and matching shorts.",
    audience: "men",
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    blurb: "Coats, jackets, and a heavier layer.",
    image: "/images/jacket-black.jpg",
    imageAlt: "Man in a black hooded jacket on a city street.",
    audience: "men",
  },
  {
    slug: "jeans",
    name: "Jeans",
    blurb: "Washed denim in a straight and relaxed leg.",
    image: "/images/men-jeans.jpg",
    imageAlt: "Stack of folded blue jeans.",
    audience: "men",
  },
  {
    slug: "ethnic-sets",
    name: "Ethnic sets",
    blurb: "Kurtas paired with a matching bottom.",
    image: "/images/men-ethnic.jpg",
    imageAlt: "Man in a brown kurta and white trousers.",
    audience: "men",
  },
  {
    slug: "formal-shirts",
    name: "Formal shirts",
    blurb: "Crisp shirts for work and evenings.",
    image: "/images/shirt-sky.jpg",
    imageAlt: "Man in a light blue formal shirt with a jacket over his shoulder.",
    audience: "men",
  },
  {
    slug: "street-wear",
    name: "Street wear",
    blurb: "Tees, cargos, and everyday layers.",
    image: "/images/tee-white.jpg",
    imageAlt: "Man in a white graphic t-shirt, olive cargo shorts, and sneakers.",
    audience: "men",
  },
  {
    slug: "dresses",
    name: "Dresses",
    blurb: "Evening and day dresses cut to move.",
    image: "/images/women-gown.jpg",
    imageAlt: "Woman in a blue evening gown and matching coat, walking in a studio.",
    audience: "women",
  },
  {
    slug: "women-shirts",
    name: "Shirts",
    blurb: "Shirt dresses and easy woven tops.",
    image: "/images/women-shirt.jpg",
    imageAlt: "Woman in a blue and white striped shirt dress against a white wall.",
    audience: "women",
  },
  {
    slug: "denim",
    name: "Denim",
    blurb: "Jackets and jeans with a worn-in hand.",
    image: "/images/women-jacket.jpg",
    imageAlt: "Woman in a denim jacket and mustard top against a yellow wall.",
    audience: "women",
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    blurb: "Sweaters, skirts, and layered knits.",
    image: "/images/women-knit.jpg",
    imageAlt: "Woman in a pale knit sweater, checked skirt, and long coat.",
    audience: "women",
  },
  {
    slug: "kurta-sets",
    name: "Kurta sets",
    blurb: "Kurtas with a trouser and dupatta.",
    image: "/images/women-kurta.jpg",
    imageAlt: "Woman seated in a navy kurta set with a grey dupatta.",
    audience: "women",
  },
  {
    slug: "sarees",
    name: "Sarees",
    blurb: "Draped sarees for the day and the evening.",
    image: "/images/women-saree.jpg",
    imageAlt: "Woman in a red saree with her hair over one shoulder.",
    audience: "women",
  },
  {
    slug: "women-jeans",
    name: "Jeans",
    blurb: "Wide-leg and straight denim.",
    image: "/images/hero-jeans-wide.jpg",
    imageAlt: "Woman in wide-leg baggy jeans standing between two payphones.",
    audience: "women",
  },
  {
    slug: "kids-dresses",
    name: "Dresses",
    blurb: "Soft dresses for play and outings.",
    image: "/images/kids-dresses.jpg",
    imageAlt: "Two children in dresses playing with wooden toys.",
    audience: "kids",
  },
  {
    slug: "kids-sets",
    name: "Sets",
    blurb: "Tees, dresses, and matching bottoms.",
    image: "/images/kids-sets.jpg",
    imageAlt: "A girl in a printed dress and a boy in a striped set, standing in a studio.",
    audience: "kids",
  },
]

export function categoriesFor(audience: Audience) {
  return categories.filter((category) => category.audience === audience)
}

const cottonCare = [
  "Machine wash cold with similar colours.",
  "Do not bleach.",
  "Dry in the shade and iron on low.",
]

export const products: Product[] = [
  {
    id: "market-road-tee",
    slug: "market-road-tee",
    name: "Market Road Tee",
    category: "oversized-t-shirts",
    price: 1490,
    description:
      "Heavyweight oversized tee with a dropped shoulder and a straight hem. Long enough to wear with shorts or a relaxed trouser.",
    fabric: "240 gsm cotton jersey.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 1,
    createdAt: "2026-11-10",
    colours: [
      {
        id: "charcoal",
        name: "Charcoal",
        hex: "#4a4744",
        images: [
          {
            src: "/images/tee-charcoal.jpg",
            alt: "Man in a charcoal oversized t-shirt, tan shorts, white socks, and a cap.",
          },
        ],
        sizes: sizes([0, 6, 4, 2, 1]),
      },
      {
        id: "black",
        name: "Black",
        hex: "#1a1a1a",
        images: [
          {
            src: "/images/tee-black.jpg",
            alt: "Man in a plain black oversized t-shirt against a pale studio background.",
          },
        ],
        sizes: sizes([3, 0, 5, 2, 0]),
      },
    ],
  },
  {
    id: "printed-box-tee",
    slug: "printed-box-tee",
    name: "Printed Box Tee",
    category: "oversized-t-shirts",
    price: 1690,
    description:
      "Boxy tee with a chest print. The ecru colour carries a small blue graphic. The white colour carries a larger illustrated print.",
    fabric: "220 gsm cotton jersey.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 5,
    createdAt: "2026-11-12",
    colours: [
      {
        id: "ecru",
        name: "Ecru",
        hex: "#f3efe6",
        images: [
          {
            src: "/images/tee-ecru.jpg",
            alt: "Man seated in an ecru oversized t-shirt with a small blue graphic, against a red wall.",
          },
        ],
        sizes: sizes([2, 4, 4, 1, 0]),
      },
      {
        id: "white",
        name: "White",
        hex: "#f7f7f5",
        images: [
          {
            src: "/images/tee-white.jpg",
            alt: "Man in a white graphic t-shirt, olive cargo shorts, and sneakers.",
          },
        ],
        sizes: sizes([0, 0, 1, 0, 0]),
      },
    ],
  },
  {
    id: "blue-hour-tee",
    slug: "blue-hour-tee",
    name: "Blue Hour Tee",
    category: "oversized-t-shirts",
    price: 1390,
    description:
      "Heavier cotton tee with a ribbed collar. Indigo is a heathered mid blue. Forest is a dark ribbed green and is currently sold out.",
    fabric: "200 gsm cotton jersey.",
    care: cottonCare,
    newArrival: false,
    sortOrder: 9,
    createdAt: "2026-10-02",
    colours: [
      {
        id: "indigo",
        name: "Indigo",
        hex: "#3d4e73",
        images: [
          {
            src: "/images/tee-indigo.jpg",
            alt: "Man in an indigo t-shirt standing against a white brick wall.",
          },
        ],
        sizes: sizes([1, 3, 2, 0, 0]),
      },
      {
        id: "forest",
        name: "Forest",
        hex: "#1e3d34",
        images: [
          {
            src: "/images/tee-forest.jpg",
            alt: "Man in a forest green ribbed t-shirt with his arms crossed.",
          },
        ],
        sizes: sizes([0, 0, 0, 0, 0]),
      },
    ],
  },
  {
    id: "check-shirt",
    slug: "check-shirt",
    name: "Check Shirt",
    category: "shirts",
    price: 2290,
    description:
      "Cotton check shirt with a button front. Sky is a fine blue grid. Brick is a larger black, white, and red check.",
    fabric: "100% cotton shirting.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 4,
    createdAt: "2026-11-14",
    colours: [
      {
        id: "sky",
        name: "Sky",
        hex: "#d5e2ee",
        images: [
          {
            src: "/images/shirt-sky.jpg",
            alt: "Man in a light blue fine-check shirt, holding a dark jacket over his shoulder.",
          },
        ],
        sizes: sizes([2, 5, 3, 1, 0]),
      },
      {
        id: "brick",
        name: "Brick",
        hex: "#6e2a2a",
        images: [
          {
            src: "/images/shirt-brick.jpg",
            alt: "Man in a black, white, and red check shirt leaning on a brick wall.",
          },
        ],
        sizes: sizes([0, 2, 4, 2, 1]),
      },
    ],
  },
  {
    id: "courtyard-camp-shirt",
    slug: "courtyard-camp-shirt",
    name: "Courtyard Camp Shirt",
    category: "shirts",
    price: 2490,
    description:
      "Open camp-collar shirt in a floral print, worn loose over the trouser. One colour in this run.",
    fabric: "Cotton camp shirting.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 8,
    createdAt: "2026-11-06",
    colours: [
      {
        id: "floral",
        name: "Floral",
        hex: "#2a7a72",
        images: [
          {
            src: "/images/shirt-floral.jpg",
            alt: "Man in a teal floral camp shirt and a sand blazer, seated outdoors.",
          },
        ],
        sizes: sizes([1, 3, 2, 1, 0]),
      },
    ],
  },
  {
    id: "timber-overshirt",
    slug: "timber-overshirt",
    name: "Timber Overshirt",
    category: "shirts",
    price: 2590,
    description:
      "Brushed plaid overshirt with a chest pocket and a heavier hand than the shirting. One colour in this run.",
    fabric: "Brushed cotton flannel.",
    care: ["Machine wash cold.", "Reshape while damp.", "Iron on the reverse if needed."],
    newArrival: false,
    sortOrder: 11,
    createdAt: "2026-09-18",
    colours: [
      {
        id: "timber",
        name: "Timber",
        hex: "#6a4632",
        images: [
          {
            src: "/images/shirt-plaid.jpg",
            alt: "Man in a brown plaid overshirt and a dark beanie, standing among trees.",
          },
        ],
        sizes: sizes([0, 2, 3, 2, 1]),
      },
    ],
  },
  {
    id: "courtyard-set",
    slug: "courtyard-set",
    name: "Courtyard Set",
    category: "co-ord-sets",
    price: 3290,
    description:
      "Ivory linen shirt and matching shorts, cut as one set. The shirt has a short button placket.",
    fabric: "Linen blend, shirt and short in the same cloth.",
    care: ["Hand wash cold or use a gentle machine cycle.", "Hang dry.", "Iron while slightly damp."],
    newArrival: true,
    sortOrder: 3,
    createdAt: "2026-11-16",
    colours: [
      {
        id: "ivory",
        name: "Ivory",
        hex: "#f2eee6",
        images: [
          {
            src: "/images/coord-ivory.jpg",
            alt: "Man in an ivory linen shirt and matching shorts against a plain background.",
          },
        ],
        sizes: sizes([2, 3, 2, 1, 0]),
      },
    ],
  },
  {
    id: "stone-road-set",
    slug: "stone-road-set",
    name: "Stone Road Set",
    category: "co-ord-sets",
    price: 3690,
    description:
      "Stone trench and wide trouser in the same cloth. Wear the coat open over a striped shirt, as shown.",
    fabric: "Washed cotton twill.",
    care: ["Dry clean, or sponge clean the coat.", "Steam the trouser rather than pressing hard creases."],
    newArrival: true,
    sortOrder: 6,
    createdAt: "2026-11-20",
    colours: [
      {
        id: "stone",
        name: "Stone",
        hex: "#c6b8a2",
        images: [
          {
            src: "/images/coord-stone.jpg",
            alt: "Man in a stone trench coat and matching wide trousers, leaning in a doorway.",
          },
        ],
        sizes: sizes([0, 2, 2, 1, 0]),
      },
    ],
  },
  {
    id: "wool-coat",
    slug: "wool-coat",
    name: "Wool Coat",
    category: "outerwear",
    price: 4890,
    description:
      "Wool coat for cooler evenings. Brown is a long pile coat. Camel is a shorter tailored overcoat.",
    fabric: "Wool blend outer.",
    care: ["Brush between wears.", "Dry clean only.", "Store on a wide hanger."],
    newArrival: true,
    sortOrder: 2,
    createdAt: "2026-11-18",
    colours: [
      {
        id: "brown",
        name: "Brown",
        hex: "#4a2e24",
        images: [
          {
            src: "/images/coat-brown.jpg",
            alt: "Person in a long brown wool coat, black beanie, and white shoes against a concrete wall.",
          },
        ],
        sizes: sizes([1, 2, 2, 1, 0]),
      },
      {
        id: "camel",
        name: "Camel",
        hex: "#c4a574",
        images: [
          {
            src: "/images/coat-camel.jpg",
            alt: "Man in a camel wool overcoat over a black turtleneck, standing on a sunny street.",
          },
        ],
        sizes: sizes([0, 1, 2, 1, 0]),
      },
    ],
  },
  {
    id: "hooded-jacket",
    slug: "hooded-jacket",
    name: "Hooded Jacket",
    category: "outerwear",
    price: 4290,
    description:
      "Black hooded jacket with a covered placket and flap pockets. Room enough for a shirt underneath.",
    fabric: "Matte nylon shell with a light fill.",
    care: ["Wipe clean with a damp cloth.", "Do not tumble dry.", "Close fastenings before storing."],
    newArrival: true,
    sortOrder: 7,
    createdAt: "2026-11-08",
    colours: [
      {
        id: "black",
        name: "Black",
        hex: "#1a1a1a",
        images: [
          {
            src: "/images/jacket-black.jpg",
            alt: "Man in profile wearing a black hooded jacket on a city street.",
          },
        ],
        sizes: sizes([1, 3, 2, 1, 0]),
      },
    ],
  },
  {
    id: "denim-jacket",
    slug: "denim-jacket",
    name: "Denim Jacket",
    category: "outerwear",
    price: 3690,
    description:
      "Washed indigo denim jacket with a standard collar. Wear it open over a tee.",
    fabric: "12 oz cotton denim.",
    care: ["Wash inside out, cold.", "Skip the dryer to keep the shape.", "Line dry."],
    newArrival: false,
    sortOrder: 10,
    createdAt: "2026-08-22",
    colours: [
      {
        id: "denim",
        name: "Denim",
        hex: "#6d8ea8",
        images: [
          {
            src: "/images/jacket-denim.jpg",
            alt: "Man wearing an indigo denim jacket open over a white t-shirt.",
          },
        ],
        sizes: sizes([2, 2, 1, 0, 0]),
      },
    ],
  },
  {
    id: "market-hoodie",
    slug: "market-hoodie",
    name: "Market Hoodie",
    category: "outerwear",
    price: 2790,
    description:
      "Mustard fleece hoodie with a kangaroo pocket and a set-in hood. One colour in this run.",
    fabric: "320 gsm cotton fleece.",
    care: cottonCare,
    newArrival: false,
    sortOrder: 12,
    createdAt: "2026-09-01",
    colours: [
      {
        id: "mustard",
        name: "Mustard",
        hex: "#d4a017",
        images: [
          {
            src: "/images/hoodie-mustard.jpg",
            alt: "Man in a mustard hoodie standing in front of a glass building.",
          },
        ],
        sizes: sizes([3, 4, 2, 1, 0]),
      },
    ],
  },
  {
    id: "studio-gown",
    slug: "studio-gown",
    name: "Studio Gown",
    category: "dresses",
    price: 4590,
    description: "Pleated evening gown with a soft coat in the same blue.",
    fabric: "Chiffon with a lined bodice.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 13,
    createdAt: "2026-11-18",
    colours: [
      {
        id: "blue",
        name: "Blue",
        hex: "#6e86c9",
        images: [
          {
            src: "/images/women-gown.jpg",
            alt: "Woman in a blue evening gown and matching coat, walking in a studio.",
          },
        ],
        sizes: sizes([1, 3, 2, 1, 0]),
      },
    ],
  },
  {
    id: "stripe-shirt-dress",
    slug: "stripe-shirt-dress",
    name: "Stripe Shirt Dress",
    category: "women-shirts",
    price: 2290,
    description: "Belted shirt dress in a blue and white stripe.",
    fabric: "Cotton poplin.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 14,
    createdAt: "2026-11-16",
    colours: [
      {
        id: "stripe",
        name: "Stripe",
        hex: "#8eb4d4",
        images: [
          {
            src: "/images/women-shirt.jpg",
            alt: "Woman in a blue and white striped shirt dress against a white wall.",
          },
        ],
        sizes: sizes([2, 4, 3, 1, 0]),
      },
    ],
  },
  {
    id: "navy-kurta-set",
    slug: "navy-kurta-set",
    name: "Navy Kurta Set",
    category: "kurta-sets",
    price: 3490,
    description: "Navy kurta with a straight trouser and a grey dupatta.",
    fabric: "Cotton silk.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 15,
    createdAt: "2026-11-20",
    colours: [
      {
        id: "navy",
        name: "Navy",
        hex: "#1d2a56",
        images: [
          {
            src: "/images/women-kurta.jpg",
            alt: "Woman seated in a navy kurta set with a grey dupatta.",
          },
        ],
        sizes: sizes([1, 3, 3, 2, 0]),
      },
    ],
  },
  {
    id: "anchor-set",
    slug: "anchor-set",
    name: "Anchor Set",
    category: "kids-sets",
    price: 1690,
    description: "Printed dress and a striped tee with joggers, cut for children.",
    fabric: "Cotton jersey.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 16,
    createdAt: "2026-11-14",
    colours: [
      {
        id: "navy",
        name: "Navy",
        hex: "#1c2740",
        images: [
          {
            src: "/images/kids-sets.jpg",
            alt: "A girl in a printed dress and a boy in a striped set, standing in a studio.",
          },
        ],
        sizes: sizes([2, 4, 3, 1, 0]),
      },
    ],
  },
  {
    id: "play-dress",
    slug: "play-dress",
    name: "Play Dress",
    category: "kids-dresses",
    price: 1490,
    description: "Soft day dresses with room to move.",
    fabric: "Cotton.",
    care: cottonCare,
    newArrival: true,
    sortOrder: 17,
    createdAt: "2026-11-15",
    colours: [
      {
        id: "berry",
        name: "Berry",
        hex: "#8d3040",
        images: [
          {
            src: "/images/kids-dresses.jpg",
            alt: "Two children in dresses playing with wooden toys.",
          },
        ],
        sizes: sizes([2, 3, 2, 1, 0]),
      },
    ],
  },
]

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

export function productsInCategory(slug: string | null) {
  if (!slug) return products
  return products.filter((product) => product.category === slug)
}

export function getRelated(product: Product, limit = 4) {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit)
}

export function isProductSoldOut(product: Product) {
  return product.colours.every((colour) => colour.sizes.every((size) => size.stock < 1))
}

export function colourById(product: Product, colourId: string) {
  return product.colours.find((colour) => colour.id === colourId) ?? product.colours[0]
}
