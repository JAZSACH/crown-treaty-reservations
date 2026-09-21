/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME — Menu
 *  PLACEHOLDER menu content. Replace items, descriptions and
 *  prices with the pub's real menu. Delete or add sections freely.
 * ─────────────────────────────────────────────────────────────
 */

export type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  tags?: ("v" | "vg" | "gf")[];
};

export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

export const MENU_PLACEHOLDER_NOTICE =
  "Sample menu shown for illustration. Our menus change with the seasons — please ask the team for today's menu.";

export const MENU: MenuSection[] = [
  {
    id: "main-menu",
    title: "Main Menu",
    note: "Comforting pub classics, cooked with care.",
    items: [
      { name: "Soup of the Day", description: "Served with warm bread and butter", price: "£—", tags: ["v"] },
      { name: "Beer-Battered Fish & Chips", description: "Mushy peas, tartare sauce, lemon", price: "£—" },
      { name: "Steak & Ale Pie", description: "Buttery pastry, seasonal greens, gravy", price: "£—" },
      { name: "Crown & Treaty Burger", description: "Aged cheddar, smoked bacon, house pickles, fries", price: "£—" },
      { name: "Sausages & Mash", description: "Onion gravy, crispy shallots", price: "£—" },
      { name: "Roasted Vegetable Tart", description: "Rocket salad, balsamic glaze", price: "£—", tags: ["v"] },
    ],
  },
  {
    id: "sunday-lunch",
    title: "Sunday Lunch",
    note: "Served every Sunday from 12pm until the kitchen closes.",
    items: [
      { name: "Roast Beef", description: "Yorkshire pudding, roast potatoes, seasonal vegetables, gravy", price: "£—" },
      { name: "Roast Chicken", description: "Stuffing, roast potatoes, seasonal vegetables, gravy", price: "£—" },
      { name: "Roast Pork", description: "Crackling, apple sauce, roast potatoes, seasonal vegetables", price: "£—" },
      { name: "Nut Roast", description: "Roast potatoes, seasonal vegetables, vegetarian gravy", price: "£—", tags: ["v"] },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { name: "Sticky Toffee Pudding", description: "Toffee sauce, vanilla ice cream", price: "£—", tags: ["v"] },
      { name: "Apple & Blackberry Crumble", description: "Custard or ice cream", price: "£—", tags: ["v"] },
      { name: "Chocolate Brownie", description: "Salted caramel, clotted cream", price: "£—", tags: ["v"] },
      { name: "British Cheese Board", description: "Crackers, chutney, grapes", price: "£—", tags: ["v"] },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    note: "Local ales, craft beers, carefully chosen wines and classic cocktails.",
    items: [
      { name: "Local Cask Ales", description: "Rotating guest ales — ask at the bar" },
      { name: "Craft Beers & Lagers", description: "On draught and by the bottle" },
      { name: "Wine List", description: "Reds, whites, rosé and sparkling by the glass or bottle" },
      { name: "Classic Cocktails", description: "Negroni, Espresso Martini, Old Fashioned and more" },
      { name: "Spirits & Soft Drinks", description: "Premium gins, whiskies, mixers and alcohol-free options" },
    ],
  },
];
