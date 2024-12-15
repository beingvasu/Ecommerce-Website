const mongoose = require('mongoose')

const Product = require('./models/Product')

let products = [
    {
        name: "Loose Fit Sweatshirt",
        img: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F40%2F10%2F40104f9e8c63dbebb8d1168cd7baf5c0060c48ac.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
        price: 799,
        desc: "Top in lightweight sweatshirt fabric made from a cotton blend with a soft brushed inside. Round, rib-trimmed neckline, dropped shoulders, long sleeves and wide ribbing at the cuffs and hem. Loose fit for a generous but not oversized silhouette."
    },
    {
        name: "Relaxed Jeans",
        img: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F59%2F86%2F5986ca739b03829d73ad4abad1706eba09ec8d25.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
        price: 2299,
        desc: "5-pocket jeans in rigid cotton denim with a straight leg and a relaxed fit from the seat to the hem with extra room from the thigh down. Regular waist and a button fly. Designed for everyday wear."
        
    },
    {
        name: "Regular Fit Collared bomber jacket",
        img: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F91%2F0d%2F910d53dd1e89c435686b5c0ddd30ac3e9d481188.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]",
        price: 3999,
        desc: "Jacket in a soft weave with a detachable collar in soft teddy. Zip down the front, vertical seam down the back and flap front pockets with a concealed press-stud. Two inner pockets with a press-stud. Elasticated ribbing at the cuffs and hem. Regular fit for comfortable wear and a classic silhouette. Lined."
    },
    {
        name: "Polarised sunglasses",
        img: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F18%2F39%2F1839e87234ed66ab20d9eed0eba0173bb1aa10af.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BENVIRONMENT%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]",
        price: 1999,
        desc: "Sunglasses with frames and sidepieces in plastic and metallic, and UV-protective, polarised lenses. Polarised lenses convey colours more clearly and provide stronger contrasts while preventing glare.",
    },
]

async function seedDB(){
    await Product.insertMany(products)
    console.log("Data has been seeded successfully :)");
}

module.exports = seedDB;

