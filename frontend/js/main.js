document.addEventListener('DOMContentLoaded', () => {
    
    /* ========================================= */
    /* 1. MENU RESPONSIVO E FAQ */
    /* ========================================= */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        const overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        body.appendChild(overlay);

        function toggleMenu() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        }

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.getComputedStyle(hamburger).display !== 'none') toggleMenu();
            });
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                if (!isOpen) item.classList.add('active');
            });
        });
    }

    /* ========================================= */
    /* 2. INTEGRAÇÃO COM O BACKEND (VITRINE E HOME) */
    /* ========================================= */
    const grid = document.getElementById('dynamic-product-grid');
    const homeGrid = document.getElementById('home-featured-products');
    
    if (grid) {
        loadCatalogFromAPI();
    }

    if (homeGrid) {
        loadHomeFeaturedProducts();
    }

    async function loadCatalogFromAPI() {
        try {
            const response = await fetch('/api/produtos');
            const produtosDoBanco = await response.json();

            let htmlHTML = '';
            produtosDoBanco.forEach(p => {
                const priceFormatted = p.price.toFixed(2).replace('.', ',');
                const oldPriceHTML = p.old_price ? `<p class="old-price">R$ ${p.old_price.toFixed(2).replace('.', ',')}</p>` : '';
                const promoTagHTML = p.is_on_sale ? `<span class="discount-tag">Oferta</span>` : '';
                const imgSrc = p.image_url ? p.image_url : 'https://via.placeholder.com/300x400?text=Sem+Foto';
                
                const descricaoSegura = p.description ? p.description.replace(/"/g, '&quot;') : 'Nenhuma descrição detalhada para esta peça.';

                htmlHTML += `
                    <article class="compact-card" data-category="${p.category}" data-size="${p.size}">
                        <div class="img-container">
                            ${promoTagHTML}
                            <img src="${imgSrc}" alt="${p.name}" class="product-image modal-trigger" style="cursor: pointer; width: 100%; height: 250px; object-fit: cover; border-radius: 4px;"
                                data-id="${p.id}"
                                data-name="${p.name}"
                                data-price="${p.price}"
                                data-size="${p.size}"
                                data-category="${p.category}"
                                data-image="${imgSrc}"
                                data-description="${descricaoSegura}">
                        </div>
                        <div class="card-body">
                            <span class="brand-label">Tam: ${p.size}</span>
                            <h4>${p.name}</h4>
                            ${oldPriceHTML}
                            <p class="price">R$ ${priceFormatted}</p>
                        </div>
                        <button class="add-to-cart-btn" 
                            data-id="${p.id}" 
                            data-name="${p.name}" 
                            data-price="${p.price}" 
                            data-size="${p.size}"
                            data-image="${imgSrc}">
                            Comprar
                        </button>
                    </article>
                `;
            });

            grid.innerHTML = htmlHTML;
            initializeStoreLogic();

        } catch (error) {
            console.error("Erro ao buscar produtos da API:", error);
            grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Erro ao carregar o catálogo.</p>";
        }
    }

    async function loadHomeFeaturedProducts() {
        try {
            const response = await fetch('/api/produtos');
            let produtosDoBanco = await response.json();

            const ultimosProdutos = produtosDoBanco.slice(-4).reverse();

            let htmlHTML = '';
            ultimosProdutos.forEach(p => {
                const priceFormatted = p.price.toFixed(2).replace('.', ',');
                const oldPriceHTML = p.old_price ? `<p class="old-price" style="text-decoration: line-through; color: #999; font-size: 0.9em;">R$ ${p.old_price.toFixed(2).replace('.', ',')}</p>` : '';
                const promoTagHTML = p.is_on_sale ? `<span class="discount-tag" style="position: absolute; top: 10px; right: 10px; background: #ff4d4d; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; z-index: 10;">Oferta</span>` : '';
                const imgSrc = p.image_url ? p.image_url : 'https://via.placeholder.com/300x400?text=Sem+Foto';
                
                const descricaoSegura = p.description ? p.description.replace(/"/g, '&quot;') : 'Nenhuma descrição detalhada para esta peça.';

                htmlHTML += `
                    <article class="product-card" style="position: relative; border: 1px solid var(--color-card-border); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
                        <div class="product-image-wrapper" style="position: relative; width: 100%; overflow: hidden;">
                            ${promoTagHTML}
                            <img src="${imgSrc}" alt="${p.name}" class="product-image modal-trigger" style="cursor: pointer; width: 100%; height: 350px; object-fit: cover; transition: transform 0.3s;"
                                data-id="${p.id}"
                                data-name="${p.name}"
                                data-price="${p.price}"
                                data-size="${p.size}"
                                data-category="${p.category}"
                                data-image="${imgSrc}"
                                data-description="${descricaoSegura}">
                        </div>
                        <div class="product-info" style="padding: 15px; text-align: center; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
                            <h3 style="font-size: 1.1rem; color: var(--color-text-main); margin-bottom: 5px;">${p.name}</h3>
                            <div class="price-box" style="margin-bottom: 15px;">
                                ${oldPriceHTML}
                                <span class="current-price" style="font-size: 1.2rem; font-weight: bold; color: var(--color-text-main);">R$ ${priceFormatted}</span>
                            </div>
                            <button class="action-btn add-to-cart-btn" style="width: 100%; padding: 10px; background-color: var(--color-text-main); color: white; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s;"
                                data-id="${p.id}" 
                                data-name="${p.name}" 
                                data-price="${p.price}" 
                                data-size="${p.size}"
                                data-image="${imgSrc}">
                                Adicionar
                            </button>
                        </div>
                    </article>
                `;
            });

            homeGrid.innerHTML = htmlHTML;

        } catch (error) {
            console.error("Erro ao carregar lançamentos:", error);
            homeGrid.innerHTML = "<p style='text-align:center; width: 100%; color: #888;'>Nenhum lançamento encontrado no momento.</p>";
        }
    }

    /* ========================================= */
    /* 3. LÓGICA DO MODAL DE DETALHES DO PRODUTO */
    /* ========================================= */
    const modalOverlay = document.getElementById('product-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

    function openModal(data) {
        document.getElementById('modal-img').src = data.image;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-title').textContent = data.name;
        document.getElementById('modal-price').textContent = `R$ ${parseFloat(data.price).toFixed(2).replace('.', ',')}`;
        document.getElementById('modal-desc').textContent = data.description;
        document.getElementById('modal-size').textContent = data.size;

        modalAddToCartBtn.setAttribute('data-id', data.id);
        modalAddToCartBtn.setAttribute('data-name', data.name);
        modalAddToCartBtn.setAttribute('data-price', data.price);
        modalAddToCartBtn.setAttribute('data-size', data.size);
        modalAddToCartBtn.setAttribute('data-image', data.image);

        modalOverlay.classList.remove('hidden');
        body.style.overflow = 'hidden'; 
    }

    function closeModal() {
        if(modalOverlay) {
            modalOverlay.classList.add('hidden');
            body.style.overflow = 'auto';
        }
    }

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-trigger')) {
            const data = {
                id: e.target.getAttribute('data-id'),
                name: e.target.getAttribute('data-name'),
                price: e.target.getAttribute('data-price'),
                size: e.target.getAttribute('data-size'),
                category: e.target.getAttribute('data-category'),
                image: e.target.getAttribute('data-image'),
                description: e.target.getAttribute('data-description')
            };
            openModal(data);
        }
    });

    /* ========================================= */
    /* 4. MOTOR DE FILTROS E PAGINAÇÃO */
    /* ========================================= */
    function initializeStoreLogic() {
        const allProducts = document.querySelectorAll('.compact-card');
        const totalCountElement = document.getElementById('total-count');
        const categoryCheckboxes = document.querySelectorAll('.advanced-filters input[type="checkbox"]:not(#promo-filter)');
        const promoCheckbox = document.getElementById('promo-filter');
        const priceRadios = document.querySelectorAll('.advanced-filters input[type="radio"][name="price"]');
        const sortSelect = document.querySelector('.sort-select');
        const sizeBtns = document.querySelectorAll('.size-btn');
        const paginationElement = document.querySelector('.pagination');

        if(allProducts.length === 0) return;

        let productsArray = Array.from(allProducts);
        const ITEMS_PER_PAGE = 20; 
        let currentPage = 1;
        let filteredProducts = [];

        function getProductPrice(productElement) {
            const priceText = productElement.querySelector('.price').textContent;
            return parseFloat(priceText.replace('R$', '').replace('.', '').replace(',', '.').trim());
        }

        function updateCategoryCounts(priceFilter, sizeFilter, isPromo) {
            let counts = { 'tudo': 0, 'pijama': 0, 'lingerie': 0, 'macacao': 0 };
            productsArray.forEach(product => {
                const category = product.getAttribute('data-category');
                const size = product.getAttribute('data-size');
                const price = getProductPrice(product);
                const hasDiscount = product.querySelector('.discount-tag') !== null;
                let showForCount = true;

                if (priceFilter !== 'Todos') {
                    if (priceFilter.includes('Até R$ 99') && price > 99) showForCount = false;
                    if (priceFilter.includes('R$ 100 - R$ 199') && (price < 100 || price > 199)) showForCount = false;
                    if (priceFilter.includes('Acima de R$ 200') && price <= 200) showForCount = false;
                }
                if (sizeFilter !== 'Todos' && size !== sizeFilter) showForCount = false;
                if (isPromo && !hasDiscount) showForCount = false;

                if (showForCount) {
                    counts['tudo']++;
                    if (counts[category] !== undefined) counts[category]++;
                }
            });

            if (document.getElementById('count-tudo')) document.getElementById('count-tudo').textContent = counts['tudo'];
            if (document.getElementById('count-pijama')) document.getElementById('count-pijama').textContent = counts['pijama'];
            if (document.getElementById('count-lingerie')) document.getElementById('count-lingerie').textContent = counts['lingerie'];
            if (document.getElementById('count-macacao')) document.getElementById('count-macacao').textContent = counts['macacao'];
        }

        function applyAllFilters() {
            const selectedCategories = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
            const isTudoSelected = selectedCategories.includes('tudo');
            const selectedPriceRadio = document.querySelector('.advanced-filters input[type="radio"][name="price"]:checked');
            let priceFilter = selectedPriceRadio ? selectedPriceRadio.nextSibling.textContent.trim() : 'Todos';
            const activeSizeBtn = document.querySelector('.size-btn.active');
            const sizeFilter = activeSizeBtn ? activeSizeBtn.textContent.trim() : 'Todos';
            const isPromoActive = promoCheckbox && promoCheckbox.checked;

            updateCategoryCounts(priceFilter, sizeFilter, isPromoActive);
            filteredProducts = [];

            productsArray.forEach(product => {
                const category = product.getAttribute('data-category');
                const size = product.getAttribute('data-size');
                const price = getProductPrice(product);
                const hasDiscount = product.querySelector('.discount-tag') !== null; 
                let show = true;

                if (!isTudoSelected && selectedCategories.length > 0 && !selectedCategories.includes(category)) show = false;
                if (show && priceFilter !== 'Todos') {
                    if (priceFilter.includes('Até R$ 99') && price > 99) show = false;
                    if (priceFilter.includes('R$ 100 - R$ 199') && (price < 100 || price > 199)) show = false;
                    if (priceFilter.includes('Acima de R$ 200') && price <= 200) show = false;
                }
                if (show && sizeFilter !== 'Todos' && size !== sizeFilter) show = false;
                if (show && isPromoActive && !hasDiscount) show = false;

                if (show) filteredProducts.push(product);
                else product.style.display = 'none';
            });

            if (totalCountElement) totalCountElement.textContent = filteredProducts.length;
            currentPage = 1; 
            renderPagination();
        }

        function renderPagination() {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

            filteredProducts.forEach((product, index) => {
                product.style.display = (index >= startIndex && index < endIndex) ? 'flex' : 'none';
            });

            if (paginationElement) {
                if (totalPages <= 1) {
                    paginationElement.style.display = 'none'; 
                } else {
                    paginationElement.style.display = 'flex';
                    paginationElement.innerHTML = ''; 
                    for (let i = 1; i <= totalPages; i++) {
                        const btn = document.createElement('button');
                        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                        btn.textContent = i;
                        btn.addEventListener('click', () => {
                            currentPage = i;
                            renderPagination();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        });
                        paginationElement.appendChild(btn);
                    }
                    if (currentPage < totalPages) {
                        const nextBtn = document.createElement('button');
                        nextBtn.className = 'page-btn next';
                        nextBtn.innerHTML = 'Próxima &gt;';
                        nextBtn.addEventListener('click', () => {
                            currentPage++;
                            renderPagination();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        });
                        paginationElement.appendChild(nextBtn);
                    }
                }
            }
        }

        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.value === 'tudo' && e.target.checked) {
                    categoryCheckboxes.forEach(cb => { if (cb.value !== 'tudo') cb.checked = false; });
                } 
                else if (e.target.value !== 'tudo' && e.target.checked) {
                    const cbTudo = Array.from(categoryCheckboxes).find(cb => cb.value === 'tudo');
                    if (cbTudo) cbTudo.checked = false;
                }
                const anyChecked = Array.from(categoryCheckboxes).some(cb => cb.checked);
                if (!anyChecked) {
                    const cbTudo = Array.from(categoryCheckboxes).find(cb => cb.value === 'tudo');
                    if (cbTudo) cbTudo.checked = true;
                }
                applyAllFilters();
            });
        });

        priceRadios.forEach(radio => radio.addEventListener('change', applyAllFilters));

        sizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) btn.classList.remove('active');
                else {
                    sizeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
                applyAllFilters(); 
            });
        });

        if (promoCheckbox) promoCheckbox.addEventListener('change', applyAllFilters);

        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const sortValue = sortSelect.value;
                if (sortValue === 'Menor Preço' || sortValue === 'Maior Preço') {
                    productsArray.sort((a, b) => {
                        return sortValue === 'Menor Preço' ? getProductPrice(a) - getProductPrice(b) : getProductPrice(b) - getProductPrice(a);
                    });
                    grid.innerHTML = '';
                    productsArray.forEach(product => grid.appendChild(product));
                    applyAllFilters(); 
                }
            });
        }

        sizeBtns.forEach(btn => btn.classList.remove('active')); 
        applyAllFilters();      
    }

    /* ========================================= */
    /* 5. LÓGICA DO CARRINHO DE COMPRAS */
    /* ========================================= */
    let cart = JSON.parse(localStorage.getItem('shop_cart')) || [];
    
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    function saveCart() {
        localStorage.setItem('shop_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
        body.style.overflow = 'hidden'; 
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        body.style.overflow = 'auto';
    }

    if(cartIcon) cartIcon.addEventListener('click', openCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart);

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartIcon) cartIcon.textContent = `🛒 Carrinho (${totalItems})`;

        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Seu carrinho está vazio.</p>';
            if(cartTotalPrice) cartTotalPrice.textContent = 'R$ 0,00';
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" class="cart-item-img" style="object-fit: cover; border-radius: 4px;" alt="Foto">
                    <div class="cart-item-details">
                        <div>
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-size">Tam: ${item.size}</div>
                        </div>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn minus" data-index="${index}">-</button>
                                <span class="qty-value">${item.qty}</span>
                                <button class="qty-btn plus" data-index="${index}">+</button>
                            </div>
                            <button class="remove-item-btn" data-index="${index}">Remover</button>
                        </div>
                    </div>
                </div>
            `;
        });

        if(cartTotalPrice) cartTotalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function addItemToCart(btnElement) {
        const id = btnElement.getAttribute('data-id');
        const name = btnElement.getAttribute('data-name');
        const price = parseFloat(btnElement.getAttribute('data-price'));
        const size = btnElement.getAttribute('data-size');
        const image = btnElement.getAttribute('data-image');

        const existingItem = cart.find(item => item.id === id && item.size === size);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price, size, image, qty: 1 });
        }

        saveCart();
        openCart();
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            addItemToCart(e.target);
            if (e.target.id === 'modal-add-to-cart') {
                closeModal(); 
            }
        }
    });

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('plus')) {
                const index = e.target.getAttribute('data-index');
                cart[index].qty += 1;
                saveCart();
            }
            if (e.target.classList.contains('minus')) {
                const index = e.target.getAttribute('data-index');
                if (cart[index].qty > 1) cart[index].qty -= 1;
                else cart.splice(index, 1); 
                saveCart();
            }
            if (e.target.classList.contains('remove-item-btn')) {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1); 
                saveCart();
            }
        });
    }

    updateCartUI();

    /* ========================================= */
    /* 6. CHECKOUT VIA WHATSAPP */
    /* ========================================= */
    const checkoutBtn = document.getElementById('checkout-whatsapp-btn');
    const numeroWhatsApp = "5500000000000"; 

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Seu carrinho está vazio! Adicione algumas peças antes de finalizar.");
                return;
            }

            let mensagem = "Olá! Gostaria de finalizar o seguinte pedido:\n\n";
            let totalPedido = 0;

            cart.forEach(item => {
                const subtotal = item.price * item.qty;
                totalPedido += subtotal;
                
                mensagem += `🛍️ *${item.qty}x ${item.name}*\n`;
                mensagem += `   Tamanho: ${item.size}\n`;
                mensagem += `   Preço: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
            });

            mensagem += `*Total do Pedido: R$ ${totalPedido.toFixed(2).replace('.', ',')}*\n\n`;
            mensagem += "Como podemos seguir com o pagamento e a entrega?";

            const mensagemCodificada = encodeURIComponent(mensagem);
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

            cart = [];
            saveCart();
            updateCartUI();
            closeCart();

            window.open(linkWhatsApp, '_blank');
        });
    }
});