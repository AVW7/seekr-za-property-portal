
export const navConfig = {
  primaryNav: [
    {
      id: "buy",
      label: "Buy",
      href: "/search",
      type: "dropdown",
      items: [
        { label: "All homes", href: "/search" },
        { label: "New developments", href: "/search?type=development" },
        { label: "On show", href: "/search?filter=on-show" },
        { label: "Bank assisted & repos", href: "/search?filter=bank-assisted" },
        { label: "FSBO (verified owners)", href: "/search?filter=owner-listed" },
      ],
    },
    {
      id: "rent",
      label: "Rent",
      href: "/search?intent=rent",
      type: "dropdown",
      items: [
        { label: "All rentals", href: "/search?intent=rent" },
        { label: "Long‑term", href: "/search?intent=rent&type=long-term" },
        { label: "Sectional title", href: "/search?intent=rent&type=sectional-title" },
        { label: "Pet‑friendly", href: "/search?intent=rent&filter=pet-friendly" },
      ],
    },
    {
      id: "suburbs",
      label: "Suburbs",
      href: "/suburbs",
      type: "mega",
      columns: [
        {
          title: "Western Cape",
          links: [
            { label: "Cape Town", href: "/suburbs/western-cape/cape-town" },
            {
              label: "Somerset West",
              href: "/suburbs/western-cape/somerset-west",
            },
            {
              label: "Stellenbosch",
              href: "/suburbs/western-cape/stellenbosch",
            },
          ],
        },
        {
          title: "Gauteng",
          links: [
            { label: "Sandton", href: "/suburbs/gauteng/sandton" },
            { label: "Fourways", href: "/suburbs/gauteng/fourways" },
            { label: "Centurion", href: "/suburbs/gauteng/centurion" },
          ],
        },
        {
          title: "KwaZulu‑Natal",
          links: [
            { label: "Durban North", href: "/suburbs/kzn/durban-north" },
            { label: "Umhlanga", href: "/suburbs/kzn/umhlanga" },
            { label: "Ballito", href: "/suburbs/kzn/ballito" },
          ],
        },
      ],
    },
    {
      id: "buyability",
      label: "BuyAbility",
      href: "/buyability",
      type: "inline",
      badge: { text: "ZA", variant: "brand" },
      tooltip: "SA-specific affordability incl. transfer duty, levies & rates",
    },
    {
      id: "market",
      label: "Market",
      href: "/insights",
      type: "dropdown",
      items: [
        { label: "Market Insights", href: "/insights" },
        { label: "Sold prices", href: "/market/sold-prices" },
        { label: "Price trends", href: "/market/trends" },
        { label: "Comparables", href: "/market/comps" },
      ],
    },
    {
      id: "agents",
      label: "For Agents",
      href: "/agents",
      type: "dropdown",
      items: [
        { label: "List with SeekrZA", href: "/agents/onboard" },
        { label: "Agent login", href: "/agents/login" },
        { label: "Feed specs", href: "/agents/feeds" },
        { label: "Pricing", href: "/agents/pricing" },
      ],
    },
  ],
  mobile: {
    sheetMenu: {
      sections: [
        {
          title: "Browse",
          links: [
            { label: "Buy", href: "/search" },
            { label: "Rent", href: "/search?intent=rent" },
            { label: "Suburbs", href: "/suburbs" },
            { label: "Market Insights", href: "/insights" },
          ],
        },
        {
          title: "Tools",
          links: [
            { label: "BuyAbility", href: "/buyability" },
            { label: "Alerts", href: "/alerts" },
            { label: "Saved", href: "/saved" },
          ],
        },
        {
          title: "Agents",
          links: [
            { label: "List with SeekrZA", href: "/agents/onboard" },
            { label: "Agent login", href: "/agents/login" },
          ],
        },
      ],
    },
  },
};
