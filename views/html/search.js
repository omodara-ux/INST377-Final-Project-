// Initial empty availableKeywords array, to be populated by API data
let availableKeywords = [];

// Get references to necessary elements
const resultsBox = document.querySelector(".result-box"),
    inputBox = document.getElementById("foodInput"),
    searchButton = document.getElementById("searchButton"),
    autoComplete = document.getElementById("foodSuggestions"),
    resultsDiv = document.getElementById('results'); // For detailed product results

// Handle the input in the search box and update availableKeywords dynamically
inputBox.addEventListener('input', async function () {
    const query = this.value.trim();
    autoComplete.innerHTML = ''; 

    if (query.length < 2) {
        return; 
    }

    try {
        console.log('Query:', query);
        
        // Fetch suggestions from OpenFoodFacts API
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`);
        
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        console.log('API Response:', data);
        const suggestions = data.products || [];

        // Update availableKeywords dynamically with the fetched suggestions
        availableKeywords = suggestions.map(product => product.product_name || 'Unknown product');
        console.log('Updated availableKeywords:', availableKeywords);

        // Populate the datalist with the suggestions
        suggestions.slice(0, 10).forEach(product => {
            const option = document.createElement('option');
            option.value = product.product_name || 'Unknown product';
            autoComplete.appendChild(option);
        });

        // Perform autocomplete filtering
        filterResults(query);
        
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});

// Handle the click event for the suggestions
function selectInput(list) {
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = ''; 
    search(); 
}

// Autocomplete function to filter results from availableKeywords
function filterResults(query) {
    let result = availableKeywords.filter(keyword => {
        return keyword.toLowerCase().includes(query.toLowerCase());
    });

    display(result);
}

// Search function to perform the search when a suggestion is selected
function search() {
    const foodName = inputBox.value.trim();
    if (foodName.length === 0) return;

    console.log('Searching for:', foodName);
    document.getElementById('nutritionBox').style.display = 'block';
    fetchProductDetails(foodName);
}

// Function to fetch detailed product data from the OpenFoodFacts API
async function fetchProductDetails(foodName) {
    resultsDiv.innerHTML = `<p>Searching for details about: ${foodName}...</p>`;

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
                    <h1>${product.product_name || 'No name available'}</h1>
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
    }
}

// This displays the autocomplete suggestions dynamically
function display(result) {
    const content = result.map((list) => {
        return "<li onclick=selectInput(this)>" + list + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

searchButton.addEventListener('click', search);