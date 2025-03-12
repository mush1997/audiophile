let cart;
let itemNum;
let cartDefaultText;
let itemDetails;
let cartTotalSum;
let totalNum;
document.querySelector(".cartBtn").addEventListener("click", showHideCart);

function showHideCart() {
    if (!document.getElementById("cart")) {
        createCart();
    } else {
        updateCart();
        cart.classList.remove("hide");
        document.body.classList.add("cartShadow");
    }

    document.addEventListener("keydown", prohibitTab);

    document.querySelector(".shadow").addEventListener("click", () => {
        cart.classList.add("hide");
        document.body.classList.remove("cartShadow");
        document.removeEventListener("keydown", prohibitTab);
    }, { once: true });
}

function createCart() {
    cart = document.createElement("section");
    document.body.append(cart);
    cart.id = "cart";

    cart.insertAdjacentHTML("afterbegin",
        `<div class="cartTitle">
           <p>Cart (<span id="itemNum"></span>)</p>
           <p>Remove All</p>
         </div>
         <div class="defaultText">
           <p>Your cart is empty.</p>
         </div>
         <div class="itemDetails"></div>
         <div class="totalSum">
           <p><span>Total</span><span class="totalNum"></span></p>
           <button class="mainBtn">Checkout</button>
         </div>`);

    cart.querySelector(".cartTitle p:last-child").addEventListener("click", removeAll);
    cart.querySelector("button").addEventListener("click", () => window.location.href = "./checkout.html");
    document.body.classList.add("cartShadow");

    itemNum = cart.querySelector("#itemNum");
    cartDefaultText = cart.querySelector(".defaultText");
    itemDetails = cart.querySelector(".itemDetails");
    cartTotalSum = cart.querySelector(".totalSum");
    totalNum = cart.querySelector(".totalNum");
    updateCart();
}

function updateCart() {
    let list = JSON.parse(window.localStorage.getItem("cartList"));
    itemDetails.textContent = "";

    if (!list || list.length === 0) {
        itemNum.textContent = "0";
        cartDefaultText.classList.remove("hide");
        cartTotalSum.classList.add("hide");
        return;
    }

    for (let item of list) {
        itemDetails.insertAdjacentHTML("beforeend",
            `<div class="single">
               <div>
                 <img src="./assets/cart/image-${item.slug}.jpg" alt="${item.name}">
                 <div>
                   <p>${item.name}</p>
                   <p>${item.price}</p>
                 </div>
               </div>
               <p class="cartQuantity">
                 <span class="minus">-</span><span class="quantity">${item.amount}</span><span class="plus">+</span>
               </p>
             </div>`);
    }

    itemNum.textContent = list.length;
    cartDefaultText.classList.add("hide");
    cartTotalSum.classList.remove("hide");
    document.querySelectorAll(".plus, .minus").forEach(operator => operator.addEventListener("click", editQuantityInCart));
    calculateTotal(list);
    window.location.pathname.includes("checkout.html") ? updateSummary() : "";
}

function editQuantityInCart(event) {
    let list = JSON.parse(window.localStorage.getItem("cartList"));
    let itemName = event.target.closest(".single").querySelector("div p").textContent;
    let quantity;

    if (event.target.classList.contains("plus")) {
        quantity = event.target.previousElementSibling.textContent;
        list.find(item => item["name"] === itemName)["amount"] = Number(quantity) + 1;
    } else {
        quantity = event.target.nextElementSibling.textContent;

        if (quantity === "1") {
            let index = list.findIndex(item => item["name"] === itemName);
            list.splice(index, 1);
        } else {
            list.find(item => item["name"] === itemName)["amount"] = Number(quantity) - 1;
        }
    }

    window.localStorage.setItem("cartList", JSON.stringify(list));
    updateCart();

    if (list.length === 0) {
        window.location.pathname.includes("checkout.html") ? updateSummary() : "";
        showPopupMsg("Your cart will be empty.");
    }
}

function calculateTotal(list) {
    let sum = list.map(item => item.price.slice(2).replaceAll(",", "") * item.amount).reduce((pre, next) => pre + next);
    totalNum.textContent = `$ ${sum.toLocaleString()}`;
}

function removeAll() {
    if (itemNum.textContent === "0") { return; }

    itemNum.textContent = "0";
    itemDetails.textContent = "";
    cartDefaultText.classList.remove("hide");
    cartTotalSum.classList.add("hide");

    window.localStorage.removeItem("cartList");
    window.location.pathname.includes("checkout.html") ? updateSummary() : "";
    showPopupMsg("Your cart will be empty.");
}