const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const samplesDir = path.join(__dirname, '..', 'public', 'samples');

if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

// Raw Products and Variants Master Data
const rawProductData = [
  {
    product_id: "",
    brand: "VIMPIX",
    category: "KIDS CLOGS",
    gender: "KIDS",
    article: "MANGO",
    variants: [
      {
        size: "11X1",
        color: "BLACK",
        pair_ctn: 120,
        pkg_type: "LOOSE",
        mrp: 499,
        selling_price: 95,
        current_stock: 5,
        new_stock: 50,
        status: "ACTIVE",
        sole: "EVA",
        upper: "EVA",
        origin: "MADE IN INDIA"
      },
      {
        size: "2X5",
        color: "RED",
        pair_ctn: 96,
        pkg_type: "LOOSE",
        mrp: 599,
        selling_price: 105,
        current_stock: 5,
        new_stock: 30,
        status: "ACTIVE",
        sole: "EVA",
        upper: "EVA",
        origin: "MADE IN INDIA"
      }
    ]
  },
  {
    product_id: "",
    brand: "VIMPIX",
    category: "GENTS CLOGS",
    gender: "GENTS",
    article: "FOOTBALL",
    variants: [
      {
        size: "6X9",
        color: "BLUE",
        pair_ctn: 72,
        pkg_type: "LOOSE",
        mrp: 299,
        selling_price: 100,
        current_stock: 3,
        new_stock: 20,
        status: "INACTIVE",
        sole: "EVA",
        upper: "EVA",
        origin: "MADE IN CHINA"
      },
      {
        size: "7X10",
        color: "GREEN",
        pair_ctn: 60,
        pkg_type: "LOOSE",
        mrp: 399,
        selling_price: 110,
        current_stock: 2,
        new_stock: 15,
        status: "INACTIVE",
        sole: "EVA",
        upper: "EVA",
        origin: "MADE IN CHINA"
      }
    ]
  }
];

// 1. Flat structure for Product Upload
const flatProductRows = [];

rawProductData.forEach((product) => {
  product.variants.forEach((v, index) => {
    flatProductRows.push({
      "PRODUCT ID": "",
      "BRAND": index === 0 ? product.brand : "",
      "CATEGORY": index === 0 ? product.category : "",
      "GENDER": index === 0 ? product.gender : "",
      "ARTICLE": product.article,
      "SIZE": v.size,
      "COLOR": v.color,
      "PAIR/CTN": v.pair_ctn,
      "PKG TYPE": v.pkg_type,
      "MRP": v.mrp,
      "SELLING PRICE": v.selling_price,
      "STOCK": v.current_stock,
      "STATUS": index === 0 ? v.status : "",
      "SOLE": index === 0 ? v.sole : "",
      "UPPER": index === 0 ? v.upper : "",
      "ORIGIN": index === 0 ? v.origin : ""
    });
  });
});

// 2. Flat structure for Stock Update (Same format & headers as Product Upload + CURRENT & NEW STOCK)
const flatStockRows = [];

rawProductData.forEach((product) => {
  product.variants.forEach((v, index) => {
    flatStockRows.push({
      "PRODUCT ID": "",
      "BRAND": index === 0 ? product.brand : "",
      "CATEGORY": index === 0 ? product.category : "",
      "GENDER": index === 0 ? product.gender : "",
      "ARTICLE": product.article,
      "SIZE": v.size,
      "COLOR": v.color,
      "PAIR/CTN": v.pair_ctn,
      "PKG TYPE": v.pkg_type,
      "MRP": v.mrp,
      "SELLING PRICE": v.selling_price,
      "CURRENT STOCK": v.current_stock,
      "NEW STOCK": v.new_stock,
      "STATUS": index === 0 ? v.status : "",
      "SOLE": index === 0 ? v.sole : "",
      "UPPER": index === 0 ? v.upper : "",
      "ORIGIN": index === 0 ? v.origin : ""
    });
  });
});

// Excel Files Creation
const wbProducts = XLSX.utils.book_new();
const wsProducts = XLSX.utils.json_to_sheet(flatProductRows);
XLSX.utils.book_append_sheet(wbProducts, wsProducts, "Product_Bulk_Upload");
XLSX.writeFile(wbProducts, path.join(samplesDir, 'sample_bulk_product_upload.xlsx'));

const wbStock = XLSX.utils.book_new();
const wsStock = XLSX.utils.json_to_sheet(flatStockRows);
XLSX.utils.book_append_sheet(wbStock, wsStock, "Stock_Bulk_Upload");
XLSX.writeFile(wbStock, path.join(samplesDir, 'sample_bulk_stock_upload.xlsx'));

// CSV Files Creation
const csvProducts = XLSX.utils.sheet_to_csv(wsProducts);
fs.writeFileSync(path.join(samplesDir, 'sample_bulk_product_upload.csv'), csvProducts);

const csvStock = XLSX.utils.sheet_to_csv(wsStock);
fs.writeFileSync(path.join(samplesDir, 'sample_bulk_stock_upload.csv'), csvStock);

console.log("Successfully generated Product and Stock sample files with matching full structure!");