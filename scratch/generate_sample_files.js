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

// 1. Flat structure for Product Upload (PRODUCT ID blank, ARTICLE only on 1st row of each product)
const flatProductRows = [];

rawProductData.forEach((product) => {
  product.variants.forEach((v, index) => {
    flatProductRows.push({
      "PRODUCT ID": "",
      "BRAND": index === 0 ? product.brand : "",
      "CATEGORY": index === 0 ? product.category : "",
      "GENDER": index === 0 ? product.gender : "",
      "ARTICLE": index === 0 ? product.article : "",

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

// 2. Flat structure for Stock Update (PRODUCT ID 1, 2 present, ARTICLE only on 1st row of each product)
const flatStockRows = [];

rawProductData.forEach((product, productIndex) => {
  product.variants.forEach((v, index) => {
    flatStockRows.push({
      "PRODUCT ID": index === 0 ? productIndex + 1 : "",
      "BRAND": index === 0 ? product.brand : "",
      "CATEGORY": index === 0 ? product.category : "",
      "GENDER": index === 0 ? product.gender : "",
      "ARTICLE": index === 0 ? product.article : "",
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
// NOTE: wbProducts will be written to disk AFTER the Filters sheet is appended (see fetchFilters callback below)

const wbStock = XLSX.utils.book_new();
const wsStock = XLSX.utils.json_to_sheet(flatStockRows);
XLSX.utils.book_append_sheet(wbStock, wsStock, "Stock_Bulk_Upload");
XLSX.writeFile(wbStock, path.join(samplesDir, 'sample_bulk_stock_upload.xlsx'));

const https = require('https');

// Function to fetch filter data from API
function fetchFilters(callback) {
  https.get('https://namami-infotech.com/Stepkaro/src/product/get_product_filters_new.php', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        callback(null, json.data || {});
      } catch (e) {
        callback(e);
      }
    });
  }).on('error', (err) => {
    callback(err);
  });
}

// Fetch filters and add as a second sheet inside sample_bulk_product_upload.xlsx
fetchFilters((err, filters) => {
  if (err) {
    console.error('Failed to fetch filters, writing product file without Filters sheet:', err);
    XLSX.writeFile(wbProducts, path.join(samplesDir, 'sample_bulk_product_upload.xlsx'));
    return;
  }

  const keys = [
    'brands',
    'categories',
    'gender',
    'color',
    'material',
    'upper_material',
    'packing_type',
    'variant',
  ];

  // Build one column per filter key — each column header = key name, values listed below
  const maxLen = Math.max(...keys.map(k => (filters[k] || []).length));
  const filterSheetData = [];

  // Header row
  const headerRow = {};
  keys.forEach(k => { headerRow[k] = k.toUpperCase().replace('_', ' '); });
  filterSheetData.push(headerRow);

  // Data rows
  for (let i = 0; i < maxLen; i++) {
    const row = {};
    keys.forEach(k => {
      const vals = filters[k] || [];
      row[k] = vals[i] !== undefined ? vals[i] : '';
    });
    filterSheetData.push(row);
  }

  const wsFilters = XLSX.utils.json_to_sheet(filterSheetData, { skipHeader: true });
  XLSX.utils.book_append_sheet(wbProducts, wsFilters, 'Filters');

  // Now write the product file with both sheets
  XLSX.writeFile(wbProducts, path.join(samplesDir, 'sample_bulk_product_upload.xlsx'));
  console.log('Filters sheet added to sample_bulk_product_upload.xlsx');
});

// CSV Files Creation
const csvProducts = XLSX.utils.sheet_to_csv(wsProducts);
fs.writeFileSync(path.join(samplesDir, 'sample_bulk_product_upload.csv'), csvProducts);

const csvStock = XLSX.utils.sheet_to_csv(wsStock);
fs.writeFileSync(path.join(samplesDir, 'sample_bulk_stock_upload.csv'), csvStock);

console.log("Sample files generated! Product upload Excel will include a 'Filters' sheet once fetch completes.");