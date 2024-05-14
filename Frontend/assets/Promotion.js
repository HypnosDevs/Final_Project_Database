const emptyPage = (text) => {
    // Remove the #cart-add section
    const banner3Section = document.getElementById('banner3');
    if (banner3Section && banner3Section.parentNode) banner3Section.parentNode.removeChild(banner3Section);

    // Remove the #cart section
    const smBannerSection = document.getElementById('sm-banner');
    if (smBannerSection && smBannerSection.parentNode) smBannerSection.parentNode.removeChild(smBannerSection);

    // Create an h1 element with the text "No products found" and class "no-product"
    const h1Element = document.createElement('h1');
    h1Element.textContent = `${text}`;
    h1Element.classList.add('no-product');

    // Get the reference node after which the h1 will be inserted
    const pageHeaderSection = document.getElementById('page-header');
    const referenceNode = pageHeaderSection.nextElementSibling;

    // Insert the h1 element after the page-header section
    pageHeaderSection.parentNode.insertBefore(h1Element, referenceNode);
}

const renderDiscount1 = (discount, categoryText) => {
    const div = document.querySelector('#sm-banner .banner-box');
    div.innerHTML = `
    <h1>Crazy Deals</h1>
    <h2>${discount.discount}% Off Max ฿${discount.max_discount}</h2>
        <span>Category: ${categoryText}</span>  
        <button class="pink" onclick="window.location.href='/shop';">Shop Now</button>
    `;
}

const renderDiscount2 = (discount, categoryText) => {
    const div = document.querySelector('#sm-banner .banner-box2');
    div.innerHTML = `
    <h1>Crazy Deals</h1>
    <h2>${discount.discount}% Off Max ฿${discount.max_discount}</h2>
        <span>Category: ${categoryText}</span>  
        <button class="green" onclick="window.location.href='/shop';">Shop Now</button>
    `;
}

const renderDiscount3 = (discount, categoryText) => {
    const div = document.querySelector('#banner3 .banner-box');
    div.innerHTML = `
    <h3>Category: ${categoryText}</h3>  
    <h3>Minimum ฿${discount.min_price}</h3>
    <button class="blue" onclick="window.location.href='/shop';">Shop Now</button>  
    `;
}

const renderDiscount4 = (discount, categoryText) => {
    const div = document.querySelector('#banner3 .banner-box2');
    div.innerHTML = `
        <h2>${discount.discount}% Off Max ฿${discount.max_discount}</h2>
        <h3>Minimum ฿${discount.min_price}</h3>
        <h3>Category: ${categoryText}</h3>  
        <button class="brown" onclick="window.location.href='/shop';">Shop Now</button>    
    `;
}

const renderDiscount5 = (discount, categoryText) => {
    const div = document.querySelector('#banner3 .banner-box3');
    div.innerHTML = `
        <h2>${discount.discount}% Off Max ฿${discount.max_discount}</h2>
        <h3>Minimum ฿${discount.min_price}</h3>
        <h3>Category: ${categoryText}</h3> 
        <button class="yellow" onclick="window.location.href='/shop';">Shop Now</button> 
    `;
}

const getDiscount = async () => {
    const discounts = await axios.get(`http://localhost:8080/api/Discount/getDiscount`);
    console.log('discounts', discounts)

    if (discounts.data && discounts.data.length > 0) {
        for (let i = 0; i < 5; i++) {
            let categoryText = '';

            if (discounts.data[i] === undefined) {
                discounts.data[i] = discounts.data[i - 1];
            }

            for (discountcategory of discounts.data[i].discountcategory) {
                const category = await axios.get(`http://localhost:8080/api/Category/getCategoryFromDiscountCategoryId/${discountcategory}`);
                console.log(discountcategory, category)
                if (categoryText === '') {
                    categoryText += category.data.name;
                } else {
                    categoryText += ' and ' + category.data.name;
                }
            }

            if (i === 0) {
                renderDiscount1(discounts.data[i], categoryText);
            } else if (i === 1) {
                renderDiscount2(discounts.data[i], categoryText);
            } else if (i === 2) {
                renderDiscount3(discounts.data[i], categoryText);
            } else if (i === 3) {
                renderDiscount4(discounts.data[i], categoryText);
            } else if (i === 4) {
                renderDiscount5(discounts.data[i], categoryText);
            }

        }
    } else {
        emptyPage("At the moment, there are no promotions available.");
    }


}

getDiscount();