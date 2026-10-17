const catalogSection = document.querySelector(".news-section");
const catalogContainer = catalogSection?.querySelector(".container-layout");

if (!catalogContainer) {
    throw new Error("Product catalog container was not found.");
}

const tabList = document.createElement("ul");
tabList.className = "tags text-center pb-10";
tabList.setAttribute("role", "tablist");
tabList.setAttribute("aria-label", "Product categories");

const productGrid = document.createElement("div");
productGrid.className = "grid  lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-[30px] mb-[30px]";
productGrid.setAttribute("role", "tabpanel");
productGrid.setAttribute("aria-live", "polite");
productGrid.textContent = "Loading products...";

catalogContainer.replaceChildren(tabList, productGrid);

function createProductCard(product, category) {
    const card = document.createElement("a");
    card.className = "service-block group relative block pt-[296px] pb-5 px-5 rounded-3xl overflow-hidden";
    card.href = `product-detail.html?product=${encodeURIComponent(product.id)}`;
    card.setAttribute("aria-label", `View ${product.name}`);

    const imageMask = document.createElement("div");
    imageMask.className = "mask-shape-4";

    const image = document.createElement("img");
    image.className = "absolute left-0 top-0 w-full h-full object-cover duration-500 group-hover:scale-110";
    image.src = category.image;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    imageMask.append(image);

    const name = document.createElement("h3");
    name.className = "relative inline-block text-[22px] leading-7 font-medium bg-white dark:bg-[rgba(0,0,0,0.80)] px-[30px] py-3.5 rounded-4xl";
    name.textContent = product.name;

    card.append(imageMask, name);
    return card;
}

function selectCategory(categories, selectedIndex, tabs) {
    const category = categories[selectedIndex];
    const activeTab = tabs[selectedIndex];

    tabs.forEach((tab, index) => {
        const isSelected = index === selectedIndex;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        tab.classList.toggle("bg-theme-color", isSelected);
        tab.classList.toggle("text-white", isSelected);
        tab.classList.toggle("border-theme-color", isSelected);
    });

    productGrid.setAttribute("aria-labelledby", activeTab.id);
    productGrid.replaceChildren(...category.products.map((product) => createProductCard(product, category)));
}

fetch("assets/data/products.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Could not load products (${response.status}).`);
        }
        return response.json();
    })
    .then((data) => {
        if (!Array.isArray(data.categories) || data.categories.length === 0) {
            throw new Error("Product data must contain at least one category.");
        }

        const tabs = data.categories.map((category, index) => {
            const listItem = document.createElement("li");
            listItem.className = "relative inline-block mb-2 mx-1.5";
            listItem.setAttribute("role", "presentation");

            const tab = document.createElement("button");
            tab.type = "button";
            tab.id = `product-category-${category.id}`;
            tab.className = "sub-title py-3.5 px-8 border border-[#515151] rounded-4xl hover:text-white hover:border-theme-color hover:bg-theme-color";
            tab.setAttribute("role", "tab");
            tab.setAttribute("aria-controls", "product-grid");
            tab.textContent = category.name;
            tab.addEventListener("click", () => selectCategory(data.categories, index, tabs));
            tab.addEventListener("keydown", (event) => {
                let nextIndex;
                if (event.key === "ArrowRight") {
                    nextIndex = (index + 1) % tabs.length;
                } else if (event.key === "ArrowLeft") {
                    nextIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (event.key === "Home") {
                    nextIndex = 0;
                } else if (event.key === "End") {
                    nextIndex = tabs.length - 1;
                } else {
                    return;
                }

                event.preventDefault();
                tabs[nextIndex].focus();
                selectCategory(data.categories, nextIndex, tabs);
            });

            listItem.append(tab);
            tabList.append(listItem);
            return tab;
        });

        productGrid.id = "product-grid";
        selectCategory(data.categories, 0, tabs);
    })
    .catch((error) => {
        console.error("Unable to display the product catalog.", error);
        productGrid.setAttribute("role", "alert");
        productGrid.textContent = "Products could not be loaded. Please refresh the page.";
    });
