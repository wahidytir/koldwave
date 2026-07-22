/* KOLDWAVE.dz — catalog & content data shared by all pages */
var KW = {
  products: [
    {id:1,slug:"chrome-reflective-hoodie",name:"Chrome Reflective Hoodie",cat:"hoodies",price:6900,badge:"new",g1:"#5FE4FF",g2:"#8B7BFF",art:"hoodie",
     rating:4.9,rc:214,sizes:["XS","S","M","L","XL"],
     desc:"Heavyweight 420-gsm brushed fleece with a full 3M-style reflective chrome print that lights up under flash. Boxy oversized fit, ribbed cuffs and a double-lined hood built to survive the cold-wave winter.",
     details:["420 gsm heavyweight brushed fleece","Full reflective chrome print — glows under light","Boxy oversized fit with drop shoulders","Double-lined hood, ribbed cuffs and hem"]},
    {id:2,slug:"frostbite-cargo-pants",name:"Frostbite Cargo Pants",cat:"pants",price:6500,badge:"hot",g1:"#22C7F5",g2:"#0B6F97",art:"cargo",
     rating:4.8,rc:96,sizes:["XS","S","M","L","XL"],
     desc:"Six-pocket cargos cut wide and straight in a water-repellent ripstop. Adjustable drawcord hems and triple-stitched seams — built to carry everything and survive anything.",
     details:["6 utility pockets with flap snaps","Water-repellent ripstop shell","Adjustable drawcord hems","Relaxed wide-straight fit"]},
    {id:3,slug:"static-y2k-baby-tee",name:"Static Y2K Baby Tee",cat:"tees",price:2900,badge:"",g1:"#FF2D8B",g2:"#8B7BFF",art:"tee",
     rating:4.7,rc:58,sizes:["XS","S","M","L","XL"],
     desc:"Shrunken boxy baby tee in heavy 240-gsm cotton with a chrome static-noise graphic straight off a 2003 screensaver. Cropped, snug and loud.",
     details:["240 gsm combed cotton","Shrunken cropped Y2K fit","Chrome static-noise front print","Ribbed collar that keeps its shape"]},
    {id:4,slug:"subzero-windbreaker",name:"Subzero Windbreaker",cat:"jackets",price:7900,old:9300,badge:"sale",g1:"#5FE4FF",g2:"#22C7F5",art:"jacket",
     rating:4.8,rc:121,sizes:["XS","S","M","L","XL"],
     desc:"Half-zip shell with a chrome storm flap and a packable hood. Wind-blocking, water-shedding, and it folds into its own chest pocket for the road.",
     details:["Packs into its own chest pocket","Half-zip with chrome storm flap","Stowable hood with toggles","Windproof water-shedding ripstop"]},
    {id:5,slug:"glacier-baggy-denim",name:"Glacier Baggy Denim",cat:"pants",price:6900,badge:"",g1:"#9AA6B4",g2:"#5FE4FF",art:"denim",
     rating:4.9,rc:87,sizes:["XS","S","M","L","XL"],
     desc:"Super-wide straight-leg denim in an ice-blue glacier wash. Heavy 14-oz cotton that stacks hard over any sneaker — zero stretch, all attitude.",
     details:["14 oz rigid non-stretch denim","Glacier ice-blue wash","Super-wide straight leg","Stacks clean over any sneaker"]},
    {id:6,slug:"cryo-techwear-vest",name:"Cryo Techwear Vest",cat:"jackets",price:8500,badge:"new",g1:"#8B7BFF",g2:"#22C7F5",art:"vest",
     rating:4.8,rc:64,sizes:["XS","S","M","L","XL"],
     desc:"Modular utility vest with six zip pockets, mesh lining and chrome hardware. Layer it over a hoodie or a baby tee — instant function, instant silhouette.",
     details:["6 zip cargo pockets","Breathable mesh lining","Chrome zips and hardware","Adjustable side straps"]},
    {id:7,slug:"iced-chrome-beanie",name:"Iced Chrome Beanie",cat:"accessories",price:1900,badge:"",g1:"#CCFF00",g2:"#5FE4FF",art:"beanie",
     rating:4.9,rc:143,sizes:["One size"],
     desc:"Tight-ribbed knit beanie topped with the chrome K patch. Fold it, slouch it, live in it — the finishing touch on every KOLDWAVE fit.",
     details:["Dense rib-knit acrylic blend","Embroidered chrome K patch","One size, unisex","Fold or slouch wear"]},
    {id:8,slug:"deep-freeze-cargo-shorts",name:"Deep Freeze Cargo Shorts",cat:"pants",price:4500,badge:"hot",g1:"#FF2D8B",g2:"#FF7A1A",art:"shorts",
     rating:4.7,rc:49,sizes:["XS","S","M","L","XL"],
     desc:"Knee-length cargo shorts in washed heavyweight twill with deep snap pockets. Summer heat, kold energy.",
     details:["Heavyweight washed twill","Deep snap cargo pockets","Knee-length relaxed cut","Drawcord waist"]}
  ],
  cats: [["all","All"],["hoodies","Hoodies"],["pants","Bottoms"],["tees","Tees"],["jackets","Techwear"],["accessories","Accessories"]],
  badgeText: {new:"New",hot:"Hot",sale:"-15%"},
  /* Stylized line-art per product type, drawn to match the site's stroke aesthetic */
  art: {
    hoodie:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 21c0-12 18-12 18 0"/><path d="M27 21c0-7 10-7 10 0"/><path d="M23 21 12 27v13l7 3"/><path d="M41 21l11 6v13l-7 3"/><path d="M19 30v24h26V30"/><path d="M25 54v-8h14v8"/><path d="M30 25v7M34 25v7"/></svg>',
    cargo:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8h20v6H22z"/><path d="M22 14 20 56h9l3-26 3 26h9L42 14"/><path d="M22 24h7v9h-7z"/><path d="M35 24h7v9h-7z"/></svg>',
    tee:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 14 16l4 8 4-3v29h20V21l4 3 4-8-8-6c-4 4-16 4-20 0Z"/><path d="M26 32h12M26 36h12M26 40h8"/></svg>',
    jacket:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 14c2-4 10-4 12 0"/><path d="M26 14 14 20v34h36V20L38 14"/><path d="M32 14v40"/><path d="M14 34h11M39 34h11"/><path d="M22 44h6v6h-6z"/></svg>',
    denim:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8h24v6H20z"/><path d="M20 14 14 56h14l4-24 4 24h14L44 14"/><path d="M24 20c0 10-2 22-4 30" stroke-dasharray="3 3"/><path d="M40 20c0 10 2 22 4 30" stroke-dasharray="3 3"/></svg>',
    vest:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 12c2-4 14-4 16 0"/><path d="M24 12 18 18v34h28V18l-6-6"/><path d="M32 14v38"/><path d="M22 38h7v8h-7z"/><path d="M35 38h7v8h-7z"/><path d="M18 26c4 2 8 2 10 0M46 26c-4 2-8 2-10 0"/></svg>',
    beanie:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 38c0-24 36-24 36 0"/><path d="M14 38h36v10H14z"/><path d="M20 38v10M26 38v10M32 38v10M38 38v10M44 38v10"/><path d="M28 26h8v6h-8z"/></svg>',
    shorts:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 14h28v6H18z"/><path d="M18 20 15 46h15l2-16 2 16h15L46 20"/><path d="M20 26h8v9h-8z"/><path d="M36 26h8v9h-8z"/></svg>'
  },
  looks: [
    {t:"Chrome Winter",s:"Hoodie / cargo",g1:"#5FE4FF",g2:"#8B7BFF",r:"5/6"},
    {t:"After Dark",s:"Reflective shell",g1:"#22C7F5",g2:"#0B6F97",r:"3/4"},
    {t:"Baby Blue",s:"Y2K baby tee",g1:"#FF2D8B",g2:"#8B7BFF",r:"1/1"},
    {t:"Sub-Zero",s:"Techwear vest",g1:"#8B7BFF",g2:"#22C7F5",r:"4/5"},
    {t:"Acid Rain",s:"Denim fit",g1:"#CCFF00",g2:"#22C7F5",r:"3/4"},
    {t:"Heatwave",s:"Cargo shorts",g1:"#FF2D8B",g2:"#FF7A1A",r:"1/1"}
  ],
  reviews: [
    {n:"Amine B.",c:"Algiers",t:"The chrome hoodie is insane in person — reflects like crazy under flash. Delivery to Algiers took 2 days, COD as promised.",g1:"#5FE4FF",g2:"#8B7BFF"},
    {n:"Yasmine K.",c:"Oran",t:"Finally a DZ brand that gets Y2K right. The baby tee fit is perfect and the quality is way above the price.",g1:"#FF2D8B",g2:"#8B7BFF"},
    {n:"Riad M.",c:"Constantine",t:"Ordered the cargo pants and techwear vest. Stitching is clean, sizing accurate. Already waiting on the next drop.",g1:"#22C7F5",g2:"#0B6F97"}
  ],
  /* Yalidine Express (Guepex) grid, ship-from Ras El Oued, Bordj Bou Arreridj.
     Per wilaya: [home delivery DA, stop desk DA]; null entry = not deliverable, null desk = no agency.
     Based on a published Yalidine tariff sheet (checked July 2026) — align with your own contract before going live. */
  SHIPPING: {
    '01':[1300,900],'02':[900,500],'03':[1000,600],'04':[900,500],'05':[900,500],'06':[900,500],'07':[1000,600],'08':[1300,900],
    '09':[700,400],'10':[900,500],'11':[1700,1300],'12':[1000,500],'13':[900,500],'14':[900,500],'15':[900,500],'16':[500,400],
    '17':[950,500],'18':[900,500],'19':[600,350],'20':[900,500],'21':[900,500],'22':[900,500],'23':[900,500],'24':[900,500],
    '25':[800,450],'26':[900,500],'27':[900,500],'28':[750,450],'29':[900,500],'30':[1000,600],'31':[900,500],'32':[1200,800],
    '33':[1600,1300],'34':[450,300],'35':[700,400],'36':[900,500],'37':[1600,1200],'38':[900,500],'39':[1000,600],'40':[900,500],
    '41':[900,500],'42':[700,400],'43':[800,450],'44':[900,500],'45':[1200,900],'46':[900,500],'47':[1000,600],'48':[900,500],
    '49':[1300,900],'50':null,'51':[1000,600],'52':[1600,null],'53':[1700,1300],'54':null,'55':[1000,600],'56':[2000,null],
    '57':[900,null],'58':[1300,600]
  }
};
