const productName = document.querySelector("#product-name");
const productGallery = document.querySelector("#product-gallery");
const productTabs = document.querySelector("#product-tabs");
const productContent = document.querySelector("#product-content");
const productEnquiry = document.querySelector("#product-enquiry");
const productVideo = document.querySelector("#product-video");

if (!productName || !productGallery || !productTabs || !productContent || !productEnquiry) {
    throw new Error("Product detail page is missing required content elements.");
}

productGallery.replaceChildren();
productContent.replaceChildren();

function showMessage(container, message) {
    const paragraph = document.createElement("p");
    paragraph.className = "text-[18px] leading-7";
    paragraph.setAttribute("role", "alert");
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
}

function renderProduct(product, tabNames) {
    productName.textContent = product.name;
    document.title = `${product.name} | Deutsche Power`;

    // Inquiry dropdown option
    const enquiryOption = document.createElement("option");
    enquiryOption.value = product.id;
    enquiryOption.textContent = product.name;
    enquiryOption.selected = true;
    productEnquiry.append(enquiryOption);
    productEnquiry.value = product.id;
    if (window.jQuery && window.jQuery.fn.niceSelect) {
        window.jQuery(productEnquiry).niceSelect("update");
    }

    // Dynamic Video Handler
    if (productVideo) {
        const videoElement = productVideo.querySelector("video");
        const videoSource = videoElement?.querySelector("source");
        if (typeof product.video === "string" && product.video.trim() && videoElement && videoSource) {
            productVideo.style.display = "";
            videoElement.muted = true;
            videoElement.setAttribute("playsinline", "");
            videoSource.src = new URL(product.video.trim(), document.baseURI).href;
            videoElement.load();
            videoElement.play().catch(() => {
                videoElement.controls = true;
            });
        } else {
            videoSource?.removeAttribute("src");
            videoElement?.load();
            productVideo.style.display = "none";
        }
    }

    // Expanding Gallery
    productGallery.replaceChildren(...product.images.map((imagePath, index) => {
        const item = document.createElement("div");
        item.className = `moving-item relative rounded-2xl overflow-hidden md:w-[165px] w-full ${
            index < product.images.length - 1 ? "md:mb-0 mb-2.5" : ""
        } min-h-[630px] transition-[width] duration-500 md:[&.active]:w-[650px]`;
        
        if (index === 0) item.classList.add("active");

        const imageBox = document.createElement("div");
        imageBox.className = "image-box relative block min-h-[630px] md:w-[165px] w-full bg-cover bg-no-repeat md:in-[.active]:w-[650px] in-[.active]:w-full duration-500";
        imageBox.style.backgroundImage = `url("${imagePath}")`;

        const imageLink = document.createElement("a");
        imageLink.className = "lightbox-image absolute left-0 top-0 w-full h-full z-50 cursor-pointer";
        imageLink.href = imagePath;
        imageLink.setAttribute("aria-label", `${product.name} image ${index + 1}`);
        imageLink.setAttribute("data-fancybox", "gallery");
        
        if (window.jQuery && window.jQuery.fn.fancybox) {
            window.jQuery(imageLink).fancybox({
                openEffect: "fade",
                closeEffect: "fade",
                helpers: { media: {} },
            });
        }
        
        imageBox.append(imageLink);
        item.append(imageBox);
        
        item.addEventListener("mouseenter", () => {
            productGallery.querySelectorAll(".moving-item").forEach((galleryItem) => galleryItem.classList.remove("active"));
            item.classList.add("active");
        });
        
        return item;
    }));

    // Tabs
    let selectedIndex = 0;
    const buttons = tabNames.map((tabName, index) => {
        const listItem = document.createElement("li");
        listItem.className = "block";
        listItem.setAttribute("role", "presentation");

        const button = document.createElement("button");
        button.type = "button";
        button.id = `product-tab-${index}`;
        button.className = "relative flex w-full items-center justify-between py-3.5 px-0 hover:px-7 hover:rounded-2xl text-left text-[18px] leading-7 font-semibold font-title-font border-b border-[#e1e1e1] hover:bg-theme-color hover:border-theme-color";
        button.setAttribute("role", "tab");
        button.setAttribute("aria-controls", "product-tab-panel");
        
        const label = document.createElement("span");
        label.className = "text inline-block";
        label.textContent = tabName;
        
        const icon = document.createElement("img");
        icon.src = "assets/images/icons/icon-1.png";
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        
        button.append(label, icon);
        button.addEventListener("click", () => selectTab(index));
        button.addEventListener("keydown", (event) => {
            let nextIndex;
            if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                nextIndex = (index + 1) % buttons.length;
            } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                nextIndex = (index - 1 + buttons.length) % buttons.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = buttons.length - 1;
            } else {
                return;
            }

            event.preventDefault();
            buttons[nextIndex].focus();
            selectTab(nextIndex);
        });

        listItem.append(button);
        productTabs.append(listItem);
        return button;
    });

    const panel = document.createElement("div");
    panel.id = "product-tab-panel";
    panel.className = "relative";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0");
    productContent.replaceChildren(panel);

    function selectTab(index) {
        selectedIndex = index;
        buttons.forEach((button, buttonIndex) => {
            const isSelected = buttonIndex === selectedIndex;
            button.setAttribute("aria-selected", String(isSelected));
            button.tabIndex = isSelected ? 0 : -1;
            button.classList.toggle("bg-theme-color", isSelected);
            button.classList.toggle("border-theme-color", isSelected);
            button.classList.toggle("text-white", isSelected);
            button.classList.toggle("px-7", isSelected);
            button.classList.toggle("px-0", !isSelected);
            button.classList.toggle("rounded-2xl", isSelected);
            button.classList.toggle("hover:px-7", !isSelected);
            button.classList.toggle("hover:rounded-2xl", !isSelected);
            button.classList.toggle("hover:bg-theme-color", !isSelected);
            button.classList.toggle("hover:border-theme-color", !isSelected);
        });

        panel.setAttribute("aria-labelledby", buttons[selectedIndex].id);
        const heading = document.createElement("h2");
        heading.className = "md:text-[55px] md:leading-[60px] text-4xl leading-11 font-bold mb-5";
        heading.textContent = tabNames[selectedIndex];

        const paragraphs = product.tabs[selectedIndex].map((content) => {
            const paragraph = document.createElement("p");
            paragraph.className = "mb-5 text-[18px] leading-8";
            paragraph.textContent = content;
            return paragraph;
        });
        panel.replaceChildren(heading, ...paragraphs);
    }

    selectTab(0);
}

const productId = new URLSearchParams(window.location.search).get("product");

fetch("assets/data/product-data.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Could not load product details (${response.status}).`);
        }
        return response.json();
    })
    .then((data) => {
        if (!Array.isArray(data.tabNames) || data.tabNames.length !== 3 ||
            data.tabNames.some((tabName) => typeof tabName !== "string") || !Array.isArray(data.products)) {
            throw new Error("Product data must provide three tab names and a product list.");
        }

        const product = data.products.find((item) => item.id === productId);
        if (!product) {
            productName.textContent = "Product not found";
            showMessage(productContent, "This product could not be found. Browse the product catalog to choose a product.");
            const catalogLink = document.createElement("a");
            catalogLink.className = "inline-block mt-5 text-theme-color hover:underline";
            catalogLink.href = "product-category.html";
            catalogLink.textContent = "Browse products";
            productContent.firstElementChild.append(catalogLink);
            productGallery.remove();
            productTabs.replaceChildren();
            if (productVideo) productVideo.style.display = "none";
            return;
        }

        if (typeof product.name !== "string" || !Array.isArray(product.images) || product.images.length === 0 ||
            product.images.some((imagePath) => typeof imagePath !== "string" || !imagePath) ||
            !Array.isArray(product.tabs) || product.tabs.length !== data.tabNames.length ||
            product.tabs.some((tabContent) => !Array.isArray(tabContent) || tabContent.length < 2 ||
                tabContent.some((paragraph) => typeof paragraph !== "string"))) {
            throw new Error(`Product "${productId}" must include a name, at least one image, and content for all three tabs.`);
        }

        renderProduct(product, data.tabNames);
    })
    .catch((error) => {
        console.error("Unable to display product details.", error);
        productName.textContent = "Product details unavailable";
        productTabs.replaceChildren();
        productGallery.replaceChildren();
        if (productVideo) productVideo.style.display = "none";
        showMessage(productContent, "Product details could not be loaded. Please refresh the page.");
    });