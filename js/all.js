const menuBtn = document.querySelector(".menuBtn");
const menu = document.querySelector(".menu");
const links = document.querySelectorAll(".navLinks li:not(:first-child), .menuComponent div");

(function () {
    showHideMenuBtn();
    if (history.scrollRestoration) { history.scrollRestoration = "manual"; }
    window.addEventListener("resize", showHideMenuBtn);
    // window.addEventListener("pageshow", (event) => { event.persisted ? window.location.reload() : "" });
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            cart.classList.add("hide");
            document.body.classList.remove("cartShadow");
        }
    });
    menuBtn.addEventListener("click", showHideMenu);
    links.forEach(link => link.addEventListener("click", goCategoryPage));
})();

function showHideMenuBtn() {
    if (window.innerWidth > 1024) {
        menuBtn.classList.add("hide");
        menu.classList.add("hide");
        document.body.classList.remove("menuShadow");
    } else {
        menuBtn.classList.remove("hide");
    }
}

function showHideMenu() {
    menu.classList.remove("hide");
    document.body.classList.add("menuShadow");

    document.querySelector(".shadow").addEventListener("click", () => {
        menu.classList.add("hide");
        document.body.classList.remove("menuShadow");
    }, { once: true });
}

function setPicSize() {
    let newPicSize;

    if (window.innerWidth > 1024) {
        newPicSize = "desktop";
    } else if (window.innerWidth > 500) {
        newPicSize = "tablet";
    } else {
        newPicSize = "mobile";
    }

    if (newPicSize !== picSize) {
        picSize = newPicSize;
        window.location.pathname.includes("category.html") ? renderProduct(allProducts, picSize) : renderProductDetail(productDetail, picSize);
    }
}

function goCategoryPage(event) {
    let title;
    event.currentTarget.nodeName === "LI" ? title = event.currentTarget : title = event.currentTarget.querySelector("p");
    window.location.href = `./category.html?category=${title.textContent.toLowerCase()}`;
}

function goProductPage(event) {
    let productName = event.target.closest("[data-slug]").dataset.slug.replaceAll("-", "_");
    window.location.href = `./product.html?product=${productName}`;
}

function showPopupMsg(msg) {
    const popup = document.createElement("div");
    document.body.append(popup);
    popup.classList.add("popup");

    popup.insertAdjacentHTML("afterbegin",
        `<p>${msg}</p>
         <div>
           <button class="mainBtn">Close</button>
         </div>`
    );

    popup.style.top = ((window.innerHeight - popup.clientHeight) / 2 + window.scrollY) + "px";
    document.body.classList.add("alertShadow");

    popup.querySelector("button").addEventListener("click", () => {
        document.body.classList.remove("alertShadow");
        popup.remove();
    }, { once: true });
}