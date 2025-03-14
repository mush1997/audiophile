const quantity = document.getElementById("quantity");
let productData;
let productDetail;
let currentProduct = window.location.search.slice(9).replaceAll("_", "-");
let picSize;

(async function () {
    await fetch("data.json").then(response => response.json()).then(data => productData = data);
    productDetail = productData.find(data => data.slug === currentProduct);
    setPicSize();
    window.addEventListener("resize", setPicSize);
    document.querySelector(".goBack").addEventListener("click", () => window.history.back());
    document.getElementById("plus").addEventListener("click", plusOrMinusQuantity);
    document.getElementById("minus").addEventListener("click", plusOrMinusQuantity);
})();

function renderProductDetail() {
    if (!productDetail) {
        document.querySelectorAll(".overview, .details, .pics, .recommended").forEach(section => section.style.display = "none");
        document.querySelector("aside").previousElementSibling.style.marginTop = "0";
        return;
    }

    document.querySelector(".overview img").src = `${productDetail.image[picSize]}`;
    document.querySelector(".overview img").alt = `${productDetail.name}`;
    document.querySelector(".overview div").dataset.slug = `${productDetail.slug}`;
    document.querySelector(".overview h1").textContent = `${productDetail.name}`;
    document.querySelector(".description").textContent = `${productDetail.description}`;
    document.querySelector(".price").textContent = `$ ${productDetail.price.toLocaleString()}`;

    productDetail.new ? "" : document.querySelector(".specialTitle").style.display = "none";
    document.querySelector(".addToCart button").addEventListener("click", addToCart);

    renderFeaturesAndOthers(productDetail.features, productDetail.includes);
    renderProductPics(productDetail.gallery);
    renderRecommendation(productDetail.others);
}

function renderFeaturesAndOthers(featuresData, othersData) {
    document.querySelector(".feature p").innerHTML = `${featuresData.replaceAll("\n", "<br>")}`;
    document.querySelector(".others ul").textContent = "";

    for (let i = 0; i < othersData.length; i++) {
        document.querySelector(".others ul").insertAdjacentHTML("beforeend",
            `<li><span>${othersData[i].quantity}x</span><span>${othersData[i].item}</span></li>`);
    }
}

function renderProductPics(allPics) {
    let pics = document.querySelectorAll(".pics img");
    pics[0].src = `${allPics.first[picSize]}`;
    pics[1].src = `${allPics.second[picSize]}`;
    pics[2].src = `${allPics.third[picSize]}`;
}

function renderRecommendation(products) {
    document.querySelector(".container").textContent = "";

    for (let i = 0; i < products.length; i++) {
        document.querySelector(".container").insertAdjacentHTML("beforeend",
            `<div data-slug="${products[i].slug}">
               <img src="${products[i].image[picSize]}" alt="${products[i].name}">
               <h4>${products[i].name}</h4>
               <button class="mainBtn">See product</button>
             </div>`);
    }

    document.querySelectorAll(".container button").forEach(btn => btn.addEventListener("click", goProductPage));
}

function plusOrMinusQuantity(event) {
    if (event.target.id === "plus") {
        quantity.textContent = Number(quantity.textContent) + 1;
    } else if (quantity.textContent !== "1") {
        quantity.textContent = Number(quantity.textContent) - 1;
    }
}

function addToCart() {
    let productName = document.querySelector(".overview h1").textContent;
    let productSlug = document.querySelector(".overview div").dataset.slug;
    let productPrice = document.querySelector(".price").textContent;
    let product = { "name": productName, "slug": productSlug, "price": productPrice, "amount": Number(quantity.textContent) };
    let list = JSON.parse(window.localStorage.getItem("cartList"));

    if (!list) {
        window.localStorage.setItem("cartList", JSON.stringify([product]));
    } else {
        let index = list.findIndex(item => item["name"] === productName);
        index < 0 ? list.push(product) : list[index]["amount"] += Number(quantity.textContent);
        window.localStorage.setItem("cartList", JSON.stringify(list));
    }

    showPopupMsg("Added successfully!");
    quantity.textContent = "1";
}