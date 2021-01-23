const rules = [
    {
        name: "Amazon",
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
        name: "Best Buy",
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
        name: "EB Games",
        url: "https://www.ebgames.ca/PS5/Games/877522",
        rules: [
            {
                selector: "#btnAddToCart",
                rule: (node) => {
                    return node.style.display === 'none';
                }
            }
        ]
    },
    {
        name: "Newegg",
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
    // {
    //     name: "Walmart",
    //     url: "https://www.walmart.ca/en/ip/playstation5-console/6000202198562",
    //     rules: [
    //         {
    //             selector: '[data-automation="cta-button"]',
    //             rule: (node) => {
    //                 return node.textContent === 'Add to cart'
    //             }
    //         }
    //     ]
    // },
];

module.exports = rules;