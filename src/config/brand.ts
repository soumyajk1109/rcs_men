/**
 * Brand settings for the storefront.
 * Swap the wordmark, campaign, and logo here.
 * Set logo.showImage to true after replacing public/brand/mark.svg.
 */
export const brand = {
  name: "Ranebennur Cloth Stores",
  shortName: "Ranebennur Cloth Stores",
  wordmark: "Ranebennur Cloth Stores",
  description:
    "Streetwear from Ranebennur Cloth Stores: oversized tees, shirts, co-ord sets, and outerwear, priced in INR.",
  logo: {
    src: "/brand/mark.svg",
    alt: "Ranebennur Cloth Stores",
    showImage: false as boolean,
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  slides: [
    {
      eyebrow: "Season 01",
      title: "Oversized",
      text: "A boxy tee with a dropped shoulder, cut to hang loose.",
      cta: "Shop oversized t-shirts",
      href: "/collections/oversized-t-shirts",
      image: "/images/hero-tee-wide.jpg",
      imageAlt:
        "Man in a black t-shirt and light blue jeans standing in a wide studio frame.",
    },
    {
      eyebrow: "Season 01",
      title: "Baggy denim",
      text: "Wide-leg jeans with a full break over the shoe.",
      cta: "Shop the edit",
      href: "/collections",
      image: "/images/hero-jeans-wide.jpg",
      imageAlt:
        "Woman in wide-leg baggy jeans standing between two payphones on a city street.",
    },
  ],
  storageKeys: {
    cart: "ranebennur-cart",
    wishlist: "ranebennur-wishlist",
    currency: "ranebennur-currency",
  },
} as const

export type Brand = typeof brand
