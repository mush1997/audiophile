let list;
const allTextInputs = document.querySelectorAll("input[type='text']");
const radioLabels = document.querySelectorAll(".options label");
const thankModal = document.querySelector(".thankModal");

(function () {
    updateSummary();
    document.querySelector(".goBack").addEventListener("click", () => {
        window.history.back();
        window.location.reload();
    });

    allTextInputs.forEach(input => input.addEventListener("keyup", checkEmpty));
    allTextInputs.forEach(input => input.addEventListener("keyup", checkFormat));
    radioLabels.forEach(label => label.addEventListener("click", selectPayment));
    document.querySelector("input[name='cardNumber']").addEventListener("input", formatCardNumber);
    document.querySelector(".summary button").addEventListener("click", showThankModal);
})();

function updateSummary() {
    list = JSON.parse(window.localStorage.getItem("cartList"));
    const checkoutList = document.querySelector(".checkoutList");
    checkoutList.textContent = "";

    if (!list || list.length === 0) {
        let num = document.querySelector("footer").clientHeight + document.querySelector("header").clientHeight;
        document.querySelector(".checkout").style.display = "none";
        document.querySelector(".summary").classList.add("empty");
        document.querySelector("main").style.minHeight = `calc(100vh - ${num}px)`;
        return;
    }

    for (let item of list) {
        checkoutList.insertAdjacentHTML("beforeend",
            `<div class="line">
               <div>
                 <img src="./assets/cart/image-${item.slug}.jpg" alt="${item.name}">
                 <div>
                   <p>${item.name}</p>
                   <p>${item.price}</p>
                 </div>
               </div>
               <p class="quantityNum">x${item.amount}</p>
             </div>`);
    }

    let sum = list.map(item => Number(item.price.slice(2).replaceAll(",", "")) * item.amount).reduce((pre, next) => pre + next);
    document.querySelector(".finalTotal").textContent = `$ ${sum.toLocaleString()}`;
    document.querySelector(".vat").textContent = `$ ${Math.round(sum * 0.2).toLocaleString()}`;
    document.querySelector(".grandTotal").textContent = `$ ${Math.round(sum * 1.2 + 50).toLocaleString()}`;
}

function checkEmpty(event) {
    if (event.target.value === "") {
        event.target.parentElement.querySelector(".wrong").classList.remove("alert");
        event.target.parentElement.querySelector(".warning").classList.add("alert");
        event.target.parentElement.classList.add("error");
    } else {
        event.target.parentElement.querySelector(".warning").classList.remove("alert");
        event.target.parentElement.classList.remove("error");
    }
}

function checkFormat(event) {
    let answer = event.target.value;
    let field = event.target.name;
    let correct;
    const regexStr = /^[a-zA-Z]+([a-zA-Z-\s]{0,})+[a-zA-Z]$/;
    const regexEmail = /^([a-zA-Z0-9]{1,})+[a-zA-Z0-9._-]+@([a-zA-Z0-9]{1,})+([a-zA-Z0-9.-]{0,})+(\.[a-zA-Z]{2,})$/;
    const regexPhoneNumber = /^[0-9]{7,}$/;
    const regexAddress = /^[a-zA-Z0-9]+([a-zA-Z0-9-\s]{0,})+[a-zA-Z0-9]$/;
    const regexZIPcode = /^[0-9]{3,}$/;
    const regexCardNumber = /^[0-9\s]{19}$/;
    const regexCVC = /^[0-9]{3}$/;

    if (field === "Name" || field === "City" || field === "Country") {
        correct = regexStr.test(answer);
    } else if (field === "Email") {
        correct = regexEmail.test(answer);
    } else if (field === "phoneNumber") {
        correct = regexPhoneNumber.test(answer);
    } else if (field === "Address") {
        correct = regexAddress.test(answer);
    } else if (field === "ZIPcode") {
        correct = regexZIPcode.test(answer);
    } else if (field === "cardNumber") {
        correct = regexCardNumber.test(answer);
    } else if (field === "CVC") {
        correct = regexCVC.test(answer);
    }

    correct ? hideFormatAlert(event.target) : showFormatAlert(event.target);
}

function showFormatAlert(element) {
    if (element.value === "") { return; }
    element.parentElement.querySelector(".wrong").classList.add("alert");
    element.parentElement.classList.add("error");
}

function hideFormatAlert(element) {
    element.parentElement.querySelector(".wrong").classList.remove("alert");
    element.parentElement.classList.remove("error");
}

function formatCardNumber(event) {
    let plainText = event.target.value.trim().replaceAll(" ", "");
    let formattedText = "";

    for (let i = 0; i < plainText.length; i++) {
        if (i > 0 && i % 4 == 0) { formattedText += " "; }
        formattedText += plainText[i];
    }
    event.target.value = formattedText;
}

function selectPayment(event) {
    const reminderText = document.querySelector(".reminder");
    const creditCardBlanks = document.querySelector(".creditCard");
    radioLabels.forEach(label => label.classList.remove("selected"));
    event.currentTarget.classList.add("selected");

    if (event.currentTarget.querySelector("input").value === "credit card") {
        reminderText.classList.add("hide");
        creditCardBlanks.classList.remove("hide");
    } else {
        reminderText.classList.remove("hide");
        creditCardBlanks.classList.add("hide");
    }
}

function showThankModal(event) {
    const inputs = Array.from(allTextInputs);
    event.preventDefault();

    for (let input of inputs) {
        if ((input.value.length === 0 || input.parentElement.classList.contains("error")) &&
            !input.closest(".fieldSet").classList.contains("hide")) {
            showPopupMsg("Please make sure that you fill in all the blanks in the correct format.");

            let emptyBlanks = inputs.filter(input => input.value.length === 0 && !input.closest(".fieldSet").classList.contains("hide"));
            emptyBlanks.forEach(blank => {
                blank.parentElement.querySelector(".warning").classList.add("alert");
                blank.parentElement.classList.add("error");
            });
            return;
        }
    }

    updateThankModal();
    document.body.classList.add("modalShadow");
    thankModal.classList.add("show");
    thankModal.style.top = (window.scrollY + 40) + "px";
}

function updateThankModal() {
    const content = document.querySelector(".checkoutList").cloneNode(true);
    document.querySelector(".leftPart").insertAdjacentHTML("afterbegin", content.innerHTML);
    document.querySelector(".dropdown span").textContent = list.length - 1;
    document.querySelector(".grandTotalNum").textContent = document.querySelector(".grandTotal").textContent;
    document.querySelector(".thankModal button").addEventListener("click", resetForm, { once: true });

    if (list.length === 1) {
        document.querySelector(".dropdown").style.display = "none";
        document.querySelector(".leftPart").classList.add("centered");
    } else {
        document.querySelectorAll(".dropdown p").forEach(p => p.addEventListener("click", showHideDropdown));
    }
}

function showHideDropdown(event) {
    event.currentTarget.style.display = "none";

    if (event.currentTarget.textContent === "View less") {
        event.currentTarget.previousElementSibling.style.display = "inline-block";
        document.querySelectorAll(".line:not(:first-of-type)").forEach(line => line.classList.remove("show"));
    } else {
        event.currentTarget.nextElementSibling.style.display = "inline-block";
        document.querySelectorAll(".line:not(:first-of-type)").forEach(line => line.classList.add("show"));
    }
}

function resetForm() {
    document.querySelector("form").reset();
    thankModal.classList.remove("show");
    window.localStorage.removeItem("cartList");

    setInterval(() => {
        window.location.href = "./index.html";
        document.body.classList.remove("modalShadow");
    }, 600);
}