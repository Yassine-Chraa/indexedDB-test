const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}
const init = () => {
  const openRequest = indexedDB.open("store", 2);
  openRequest.onupgradeneeded = function (event) {
    console.log("upgrade needed");
    const db = event.target.result;

    if (!db.objectStoreNames.contains("products")) {
      db.createObjectStore("products", { keyPath: "id", autoIncrement: true }); // create it
    }
  };

  openRequest.onerror = function () {
    console.error("Error", openRequest.error);
  };

  openRequest.onsuccess = function () {
    const db = openRequest.result;

    const transaction = db.transaction("products", "readwrite");
    const products = transaction.objectStore("products");
    const requestAll = products.getAll();
    requestAll.onsuccess = (event) => {
      const allProducts = event.target.result;
      updateTable(allProducts);

      console.log("All records using getAll:", allProducts);
    };
  };
};

const updateTable = (products) => {
  const tbody = document.getElementById("tableBody");

  products.forEach((product) => {
    const { id,name, price, stock } = product;
    const tr = `
    <tr>
        <th>${id}</th>
        <td>${name}</td>
        <td>${price} DH</td>
        <td>${stock}</td>
    </tr>
    `;
    tbody.innerHTML += tr;
  });
};
