/* KOLDWAVE.dz — catalog & content data shared by all pages */
var KW = {
  products: [
    {id:1,name:"Chrome Reflective Hoodie",cat:"hoodies",price:6900,badge:"new",g1:"#5FE4FF",g2:"#8B7BFF"},
    {id:2,name:"Frostbite Cargo Pants",cat:"pants",price:6500,badge:"hot",g1:"#22C7F5",g2:"#0B6F97"},
    {id:3,name:"Static Y2K Baby Tee",cat:"tees",price:2900,badge:"",g1:"#FF2D8B",g2:"#8B7BFF"},
    {id:4,name:"Subzero Windbreaker",cat:"jackets",price:7900,old:9300,badge:"sale",g1:"#5FE4FF",g2:"#22C7F5"},
    {id:5,name:"Glacier Baggy Denim",cat:"pants",price:6900,badge:"",g1:"#9AA6B4",g2:"#5FE4FF"},
    {id:6,name:"Cryo Techwear Vest",cat:"jackets",price:8500,badge:"new",g1:"#8B7BFF",g2:"#22C7F5"},
    {id:7,name:"Iced Chrome Beanie",cat:"accessories",price:1900,badge:"",g1:"#CCFF00",g2:"#5FE4FF"},
    {id:8,name:"Deep Freeze Cargo Shorts",cat:"pants",price:4500,badge:"hot",g1:"#FF2D8B",g2:"#FF7A1A"}
  ],
  cats: [["all","All"],["hoodies","Hoodies"],["pants","Bottoms"],["tees","Tees"],["jackets","Techwear"],["accessories","Accessories"]],
  badgeText: {new:"New",hot:"Hot",sale:"-15%"},
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
