const rules = [
  {
    id: 'amazon_remote',
    store: "Amazon",
    product: "Media Remote",
    url: "https://www.amazon.ca/Media-Remote-PlayStation-5/dp/B08GSHQJ78",
    rules: [
      {
        selector: "#availability span",
        rule: (node) => {
          return (node.textContent || '').includes('In Stock');
        }
      }
    ]
  },
  {
    id: 'amazon_charging_station',
    store: "Amazon",
    product: "Charging Station",
    url: "https://www.amazon.ca/DualSense-Charging-Station/dp/B08FC6Y4VG",
    rules: [
      {
        selector: "#availability span",
        rule: (node) => {
          return (node.textContent || '').includes('In Stock');
        }
      }
    ]
  },
  /*
  {
    id: "amazon_ps5",
    store: "Amazon",
    product: "PS5",
    url: "https://www.amazon.ca/PlayStation-5-Console/dp/B08GSC5D9G",
    rules: [
      {
        selector: "#availability span",
        rule: (node) => {
          return !((node.textContent || '').includes('Currently unavailable'));
        }
      }
    ]
  },
  {
    id: "best_buy_ps5",
    store: "Best Buy",
    product: "PS5",
    url: "https://www.bestbuy.ca/en-ca/product/playstation-5-console-online-only/14962185",
    rules: [
      {
        selector: ".addToCartButton_1op0t",
        rule: (node) => {
          return !node.disabled
        }
      },
    ]
  },
  {
    id: "eb_games_ps5",
    store: "EB Games",
    product: "PS5",
    url: "https://www.ebgames.ca/PS5/Games/877522",
    rules: [
      {
        selector: "#btnAddToCart",
        rule: (node) => {
          return node.style.display !== 'none';
        }
      }
    ]
  },
  {
    id: "newegg_ps5",
    store: "Newegg",
    product: "PS5",
    url: "https://www.newegg.ca/p/N82E16868110294",
    rules: [
      {
        selector: ".btn-wide",
        rule: (node) => {
          return node.textContent !== 'Out of Stock '; // the trailing space is important
        }
      }
    ]
  },
  {
    name: "Walmart",
    url: "https://www.walmart.ca/en/ip/playstation5-console/6000202198562",
    rules: [
      {
        selector: '[data-automation="cta-button"]',
        rule: (node) => {
          return node.textContent === 'Add to cart'
        }
      }
    ]
  },
  */
];

module.exports = rules;