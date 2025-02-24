let productData;
let allProducts;
let currentCategory = window.location.search.slice(10);
let picSize;
const main = document.querySelector("main");
const categoryTitle = document.querySelector(".categoryTitle h1");

(async function () {
    await fetch("data.json").then(response => response.json()).then(data => productData = data);
    allProducts = productData.filter((data) => data.category === currentCategory).reverse();
    setPicSize();
    window.addEventListener("resize", setPicSize);
})();

function renderProduct(allProducts, picSize) {
    main.textContent = "";

    if (allProducts.length === 0) {
        categoryTitle.parentElement.style.display = "none";
        main.nextElementSibling.style.marginTop = "0";
        return;
    }

    categoryTitle.textContent = currentCategory;

    for (let product of allProducts) {
        main.insertAdjacentHTML("beforeend",
            `<section class="product" id="p${product.id}" data-slug="${product.slug}">
               <img src="${product.categoryImage[picSize]}" alt="${product.name}">
               <div>
                 <p class="specialTitle">New product</p>
                 <h2>${product.name}</h2>
                 <p>${product.description}</p>
                 <button class="mainBtn">See product</button>
               </div>
             </section>`);

        product.new ? "" : document.querySelector(`#p${product.id} .specialTitle`).style.display = "none";
    }

    document.querySelectorAll("button").forEach(btn => btn.addEventListener("click", goProductPage));
}