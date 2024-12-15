document.getElementById('foodInput').addEventListener('input', async function () {
    const query = this.value.trim();
    const autoComplete = document.getElementById('foodSuggestions');
    const loadingElement = document.getElementById('loading');

    autoComplete.innerHTML = '';
    
    if (query.length < 2) {
        return;
    }
    loadingElement.style.display = 'block';

    try {
        console.log('Query:', query);
        
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        console.log('API Response:', data); 
        const suggestions = data.products || [];

        suggestions.slice(0, 10).forEach(product => {
            const option = document.createElement('option');
            option.value = product.product_name || 'Unknown product';
            autoComplete.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    } finally {
        loadingElement.style.display = 'none';
    }
});

document.getElementById('searchButton').addEventListener('click', async function () {
    const foodName = document.getElementById('foodInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const loadingElement = document.getElementById('loading');

    if (!foodName) {
        resultsDiv.innerHTML = '<p>Please enter a food name to search.</p>';
        return;
    }

    resultsDiv.innerHTML = `<p>Searching for details about: ${foodName}...</p>`;
    loadingElement.style.display = 'block';

    try {
        console.log('Food Name:', foodName);
        
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error('Failed to fetch product details');
        }

        const data = await response.json();
        console.log('Detailed API Response:', data);
        const product = data.products.find(p => p.product_name?.toLowerCase() === foodName.toLowerCase());

        if (product) {
            resultsDiv.innerHTML = `
                <div class="product">
                    <h2>${product.product_name || 'No name available'}</h2>
                    <p><strong>Calories:</strong> ${product.nutriments['energy-kcal'] || 'N/A'} kcal</p>
                    <p><strong>Proteins:</strong> ${product.nutriments.proteins || 'N/A'} g</p>
                    <p><strong>Carbohydrates:</strong> ${product.nutriments.carbohydrates || 'N/A'} g</p>
                    <p><strong>Fats:</strong> ${product.nutriments.fat || 'N/A'} g</p>
                    <p><strong>Nutri-Score:</strong> ${product.nutriscore_grade ? product.nutriscore_grade.toUpperCase() : 'N/A'}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = '<p>No details available for the selected product. Please try another.</p>';
        }
    } catch (error) {
        console.error('Error fetching details:', error);
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    } finally {
        loadingElement.style.display = 'none';
    }
});

