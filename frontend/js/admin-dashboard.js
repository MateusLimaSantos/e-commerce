document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('shop_admin_token');
    if (!token) {
        window.location.href = 'admin-login.html';
        return; 
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('shop_admin_token'); 
        window.location.href = 'admin-login.html';
    });

    const tbody = document.getElementById('inventory-tbody');
    const totalInventory = document.getElementById('total-inventory');
    const searchInput = document.getElementById('search-inventory');
    let globalInventory = [];

    function renderTable(produtosParaMostrar) {
        tbody.innerHTML = ''; 
        totalInventory.textContent = produtosParaMostrar.length;

        if (produtosParaMostrar.length === 0) return;

        produtosParaMostrar.forEach(p => {
            const promoBadge = p.is_on_sale ? '<span class="badge-sale">OFERTA</span>' : '-';
            const miniatura = p.image_url ? `<img src="${p.image_url}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` : 'Sem foto';

            tbody.innerHTML += `
                <tr>
                    <td>#${p.id}</td>
                    <td>${miniatura}</td>
                    <td><strong>${p.name}</strong></td>
                    <td style="text-transform: capitalize;">${p.category}</td>
                    <td>${p.size}</td>
                    <td>R$ ${p.price.toFixed(2).replace('.', ',')}</td>
                    <td>${promoBadge}</td>
                    <td>
                        <button class="logout-btn" style="padding: 4px 10px; font-size: 12px;" onclick="deletarProduto(${p.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }

    async function loadInventory() {
        try {
            const response = await fetch('/api/produtos');
            globalInventory = await response.json();
            renderTable(globalInventory);
        } catch (error) {
            console.error("Erro ao carregar o estoque:", error);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termoDigitado = e.target.value.toLowerCase();
            const produtosFiltrados = globalInventory.filter(p => 
                p.name.toLowerCase().includes(termoDigitado) || 
                p.id.toString().includes(termoDigitado)
            );
            renderTable(produtosFiltrados);
        });
    }

    loadInventory();

    const addForm = document.getElementById('add-product-form');
    const msgBox = document.getElementById('form-msg');
    const saveBtn = document.getElementById('save-product-btn');

    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        msgBox.className = 'msg-box hidden'; 
        saveBtn.disabled = true;
        
        try {
            let uploadedImageUrl = null;
            const fileInput = document.getElementById('prod-image-file');

            if (fileInput.files.length > 0) {
                saveBtn.textContent = 'Enviando imagem... ⏳';
                
                const fileData = new FormData();
                fileData.append('file', fileInput.files[0]);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: fileData
                });

                if (!uploadRes.ok) throw new Error("Falha ao enviar a imagem para o servidor.");
                const uploadJson = await uploadRes.json();
                
                uploadedImageUrl = uploadJson.image_url; 
            }

            saveBtn.textContent = 'Gravando no Banco de Dados... ⏳';
            
            const newProduct = {
                name: document.getElementById('prod-name').value,
                category: document.getElementById('prod-category').value,
                size: document.getElementById('prod-size').value,
                price: parseFloat(document.getElementById('prod-price').value),
                old_price: document.getElementById('prod-old-price').value ? parseFloat(document.getElementById('prod-old-price').value) : null,
                is_on_sale: document.getElementById('prod-sale').checked,
                image_url: uploadedImageUrl,
                description: document.getElementById('prod-description').value || null
            };

            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProduct)
            });

            if (!response.ok) throw new Error("Erro ao salvar o produto.");

            msgBox.textContent = "✅ Produto e imagem salvos com sucesso!";
            msgBox.classList.add('success');
            msgBox.classList.remove('hidden');
            
            addForm.reset(); 
            loadInventory(); 

        } catch (error) {
            msgBox.textContent = "❌ " + error.message;
            msgBox.classList.add('error');
            msgBox.classList.remove('hidden');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Salvar Produto no Banco de Dados';
            setTimeout(() => { msgBox.classList.add('hidden'); }, 4000); 
        }
    });

    window.deletarProduto = async function(id) {
        if (!confirm(`Tem certeza que deseja apagar a peça #${id}?`)) return;

        try {
            const response = await fetch(`/api/produtos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Não foi possível excluir.");
            loadInventory();

        } catch (error) {
            alert("Erro ao excluir: " + error.message);
        }
    };
});