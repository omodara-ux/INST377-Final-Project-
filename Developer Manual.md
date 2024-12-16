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
This API does not require authentication. When testing the application, make all API requests to the staging environment. This API enforces rate-limits. The following limits apply:
100 req/min for all read product queries (GET /api/v*/product requests or product page). There is no limit on product write queries.
10 req/min for all search queries (GET /api/v*/search or GET /cgi/search.pl requests)
2 req/min for facet queries (such as /categories, /label/organic, /ingredient/salt/category/breads,...)

To add an exisisting product with missing information:
no_nutrition_data=on (indicates if the nutrition facts are not indicated on the food label)

To add nutrition facts values, units and base:
nutrition_data_per=100g
OR
nutrition_data_per=serving
serving_size=38g

To add values to field that is alerady filled, use the prefix "add" before the varible name. Here is an example:
add_categories

To search for products. The search parameter has 2 possible values that need to be seperated by a comma.:
get /api/v2/search

### Patch Endpoint:
This API has only 1 Patch endpoint. This endpoint updates the information of an exisisting product in the database using its barcode.
PATCH /api/v2/products/{barcode}. 
Example: PATCH /api/v2/products/{4575859990}

### Get Endpoints
This api has 13 GET endpoints
1. This endpoint gets statistics for from the Open Food Facts database. 
GET /api/v2/statistics
Example: GET /api/v2/statistics

2. This endpoint retreives list the labels for all products. Labels include organic, gluten free, etc.
GET /api/v2/labels
example: GET /api/v2/labels
To get labels for a single product, place products?search_terms before v2/.search terms= name of product =produc_name. Product name with spaces should be seperated by +. Labels will be the last arguement.
example: GET /api/v2/products?search_terms=Motts+for+Tots+Applesauce&fields=product_name,labels

3. This endpoint gets information about a product based on its barcode. 
GET /api/v2/products/{barcode}.json
example: GET /api/v2/products/927263739403.json


4. This endpoint gets products that fit a filtering criteria.
GET /api/v2/products
example: GET /api/v2/products?categories=chocolate&labels=vegan


5. This endpoint gets the list of brands in the database. 
GET /api/v2/brands

6. This endpoint gets all the countries in the database.
GET /api/v2/countries

7. This endpoint gets all the categories in the database:
GET /api/v2/categories

8. This endpoint gets the tags that group products. 
GET /api/v2/product_tags

9. This endpoint gets all nutrient types in the database.
GET /api/v2/nutriments

10. This endpoint gets all the product reviews in the database 
GET /api/v2/product_reviews

11. This endpoint gets all the ingredients in the database.
GET /api/v2/ingredients

12. This endpoint get a list of products that match a searcher's query
GET /api/v2/search?q=vegan

### Post endpoint
1. In order to add an item to the database, upload the following information to the POST request.
POST /api/v2/products
Example
{
  "code": "5649374900505",
  "product_name": "Stella's Candies",
  "ingredients_text": "syrup, sugar, red40, starwberry puree",
  "labels": ["organic"]
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
