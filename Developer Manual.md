# Nutrivue's Developer Manual
## 1. Installing the Application and All Dependencies
Clone the Repository:
git clone https://github.com/omodara-ux/INST377-Final-Project-
cd https://github.com/omodara-ux/INST377-Final-Project-
Install Node.js:
Check if you are using Node.js or not. You can get it from Node .js
Install Dependencies:
npm install
Set Up Environment Variables:
Make a .env file in the root directory.
Add the following variables:
Your Supabase Database URL and pass to Supabase here:
DATABASE_URL=<Your Supabase Database URL>
Your Open Food Facts API Key : API_KEY=<Your Open Food Facts API Key>
PORT=3306

## 2. Running Application on Server

Start the Development Server:
npm run dev
The server will run at http://localhost:3306.


Production Deployment:
It’s deployed on Vercel. From GitHub, push changes to the main branch, and Vercel will redeploy the most recent version, automatically.
## 3. How to Run Tests

Run Unit Tests: npm test
Run Integration Tests: Tests/integration is where we store our integration tests. Run them using: npm run test:integration

## 4. API Documentation
READ operations do not require authentication. WRITE operations require authentication. Make all API requests to the staging environment. This API enforces rate-limits. The following limits apply:
- 100 req/min for all read product queries (GET /api/v*/product requests or product page). There is no limit on product write queries.
- 10 req/min for all search queries (GET /api/v*/search or GET /cgi/search.pl requests)
- 2 req/min for facet queries (such as /categories, /label/organic, /ingredient/salt/category/breads,...)

### To add an exisisting product with missing information:
no_nutrition_data=on (indicates if the nutrition facts are not indicated on the food label)

### To add nutrition facts values, units and base:
nutrition_data_per=100g
OR
nutrition_data_per=serving
serving_size=38g

### To add values to field that is alerady filled, use the prefix "add" before the varible name. Here is an example:
add_categories

### To search for products. The search parameter has 2 possible values that need to be seperated by a comma
get /api/v2/search

### To get a product's nutriscore (no authentication required) 

GET request to the Get A Product By Barcode endpoint

https://world.openfoodfacts.net/api/v2/product/{barcode}

#### Example for Nutella Ferreor

https://world.openfoodfacts.net/api/v2/product/3017624010701

Response (all the nutrition data associated with Nutella Ferrero:

{
	"code": "3017624010701",
	"product": {
		"_id": "3017624010701",
		"_keywords": [
			"and",
			"breakfast",
			"chocolate",
			"cocoa",
			"ferrero",
			"gluten",
			"hazelnut",
			"no",
			"nutella",
			"pate",
			"spread",
			"sweet",
			"tartiner"
		],
		"added_countries_tags": [],...

To limit the response by the get request, use these query parameters to specify the product fields to be returned.

Example: https://world.openfoodfacts.net/api/v2/product/3017624010701?fields=product_name,nutriscore_data

Response:
{
    "code": "3017624010701",
    "product": {
        "nutrition_grades": "e",
        "product_name": "Nutella"
    },
    "status": 1,
    "status_verbose": "product found"
}

### How to know how a nutriscore is calculated
GET: 

https://world.openfoodfacts.net/api/v2/product/3017624010701?fields=product_name,nutriscore_data,nutriments,nutrition_grade

Response:
{
    "code": "3017624010701",
    "product": {
        "nutriments": {
            "carbohydrates": 57.5,
            "carbohydrates_100g": 57.5,
            "carbohydrates_unit": "g",
            "carbohydrates_value": 57.5,
            "energy": 2255,
            "energy-kcal": 539,
            "energy-kcal_100g": 539,
            "energy-kcal_unit": "kcal",
            ...,
            ...,
            "sugars": 56.3,
            "sugars_100g": 56.3,
            "sugars_unit": "g",
            "sugars_value": 56.3
        },
        "nutriscore_data": {
            "energy": 2255,
            "energy_points": 6,
            "energy_value": 2255,
            ...,
            ...,
            "sugars_points": 10,
            "sugars_value": 56.3
        },
        "nutrition_grades": "e",
        "product_name": "Nutella"
    },
    "status": 1,
    "status_verbose": "product found"
}

### Products without a Nutri-Score

GET: 

https://world.openfoodfacts.net/api/v2/product/0180411000803/100-real-orange-juice?fields=misc_tags

Response:
{
    "code": "0180411000803",
    "product": {
        "misc_tags": [
            "en:nutriscore-not-computed",
            "en:nutriscore-missing-category",
            "en:nutrition-not-enough-data-to-compute-nutrition-score",
            "en:nutriscore-missing-nutrition-data",
            "en:nutriscore-missing-nutrition-data-sodium",
            "en:ecoscore-extended-data-not-computed",
            "en:ecoscore-not-computed",
            "en:main-countries-new-product"
        ]
    },
    "status": 1,
    "status_verbose": "product found"
}

### Add nutrition information to product (authetication required)

Need a valid user_id and password to write the missing nutriment data to 100% Real Orange Juice.
To write data to a product, make a POST request to the Add or Edit A Product endpoint.

https://world.openfoodfacts.net/cgi/product_jqm2.pl

Required: 
user_id, password, barcode, user_id, and password
Include other product data to be added in the request body.

Response (sucessful):
{
    "status_verbose": "fields saved",
    "status": 1
}

### Read newly computed Nutri-Score

GET: https://world.openfoodfacts.net/api/v2/product/0180411000803?fields=product_name,nutriscore_data,nutriments,nutrition_grades

{
    "code": "0180411000803",
    "product": {
        "nutriments": {
            "carbohydrates": 11.864406779661,
            .
            .
            .
            "sugars_unit": "g",
            "sugars_value": 11.864406779661
        },
        "nutriscore_data": {
            "energy": 195,
            "energy_points": 7,
            "energy_value": 195,
            .
            .
            .
            "sugars_value": 11.86
        },
        "nutrition_grades": "c",
        "product_name": "100% Real Orange Juice"
    },
    "status": 1,
    "status_verbose": "product found"
}

### Search for a Product by Nutri-score

Make a GET request to the Search for Products endpoint.

https://world.openfoodfacts.org/api/v2/search
Add the search criteria used to filter the products as query parameters. For Orange Juice with a nutrition_grade of c, add query parameters categories_tags_en to filter Orange Juice while nutrition_grades_tags to filter c. 

https://world.openfoodfacts.net/api/v2/search?categories_tags_en=Orange Juice&nutrit

To limit response:

Add fields to the query parameters to specify which fields to be return. 

Response: 
{
    "count": 1629,
    "page": 1,
    "page_count": 24,
    "page_size": 24,
    "products": [
        {
            "categories_tags_en": [
                "Plant-based foods and beverages",
                "Beverages",
                "Plant-based beverages",
                "Fruit-based beverages",
                "Juices and nectars",
                "Fruit juices",
                "Concentrated fruit juices",
                "Orange juices",
                "Concentrated orange juices"
            ],
            "code": "3123340008288",
            "nutrition_grades": "c"
        },
        .
        .
        .
        {
            "categories_tags_en": [
                "Plant-based foods and beverages",
                "Beverages",
                "Plant-based beverages",
                "Fruit-based beverages",
                "Juices and nectars",
                "Fruit juices",
                "Non-Alcoholic beverages",
                "Orange juices",
                "Squeezed juices",
                "Squeezed orange juices"
            ],
            "code": "3608580844136",
            "nutrition_grades": "c"
        }
    ],
    "skip": 0
}

Known errors
404 Not Found: requested product does not exist.
400 Bad Request: missing required data or invalid request body .
500 Internal Server Error: error on the server side.


## 5. Known Bugs
Issue: Nutritional Info may return incomplete nutritional data as some ingredients may not be found in the external API.
Workaround: Show data only when available, otherwise show a fallback message.

Other Known Bugs:
Issues with CSS layout in the older versions of Safari.
Open Food Facts API slow response times for large datasets.

## 6. Future Development Roadmap
These features could be added in the future.
Saving custom smoothie recipes: add user authentication.
To add dietary filters (vegan, low carb, gluten free).
We add sorting options by NutriScore or Eco Score.


Performance Enhancements:
Caching frequently queried items on the server, for example, is a perfect use case for the API call optimization.
Smoothie data should be implemented lazy loading to improve UI performance.

UI Improvements:
Help with mobile responsiveness.
We can add animations for better transitions and better UX.

## 7. Documentation Location
This README.md file is located in the top level of the project.
Docs for some of specific sections like API usage and database schema can be found in docs/ folder.

