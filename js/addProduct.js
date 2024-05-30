const nameInput = document.getElementById("productNameInput");
const priceInput = document.getElementById("productPriceInput");
const stockInput = document.getElementById("productStockInput");
document.getElementById("addProductBtn").onclick = () => {
  addProduct({
    name: nameInput.value,
    price: priceInput.value,
    stock: stockInput.value,
  });
};

const addProduct = (product) => {
  const openRequest = indexedDB.open("store", 2);
  openRequest.onupgradeneeded = function (event) {
    console.log("upgrade needed");
    const db = event.target.result;

    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
    }
  };

  openRequest.onerror = function () {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = function (event) {
    const db = event.target.result;
    console.log(db);

    const transaction = db.transaction("products", "readwrite");
    const products = transaction.objectStore("products");
    const request = products.add(product);

    request.onsuccess = function () {
      nameInput.value = "";
      priceInput.value = "";
      stockInput.value = "";
      console.log("Product added to the store", request.result);
    };
  };
};
