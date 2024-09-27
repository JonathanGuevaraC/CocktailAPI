// Llamada a la API para obtener la lista de ingredientes
function getIngredients() {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
        .then(response => response.json())
        .then(data => {
            const ingredientSelect = document.getElementById('ingredient-select');
            data.drinks.forEach(drink => {
                const option = document.createElement('option');
                option.value = drink.strIngredient1;
                option.text = drink.strIngredient1;
                ingredientSelect.appendChild(option);
            });
        })
        .catch(error => console.log("Error fetching ingredients:", error));
}

// Función para buscar cócteles por ingrediente
function searchByIngredient(ingredient) {
    if (ingredient === "") {
        alert("Por favor selecciona un ingrediente.");
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = "";
            data.drinks.forEach(drink => {
                const card = `
                    <div class="col-md-4">
                        <div class="card cocktail-card">
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                            <div class="card-body">
                                <h5 class="card-title">${drink.strDrink}</h5>
                                <button class="btn btn-primary" onclick="getCocktailDetails('${drink.idDrink}')">Ver Detalles</button>
                            </div>
                        </div>
                    </div>
                `;
                resultsDiv.innerHTML += card;
            });
        })
        .catch(error => console.log("Error fetching cocktails:", error));
}

// Función para obtener detalles del cóctel
function getCocktailDetails(idDrink) {
    console.log("Fetching details for drink ID:", idDrink); // Depuración

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`)
        .then(response => response.json())
        .then(data => {
            console.log("Cocktail details fetched:", data); // Depuración
            const cocktail = data.drinks[0];
            const detailsDiv = document.getElementById('details');
            
            // Obtener los ingredientes y las medidas del cóctel
            let ingredientsList = '';
            for (let i = 1; i <= 15; i++) {
                const ingredient = cocktail[`strIngredient${i}`];
                const measure = cocktail[`strMeasure${i}`];
                if (ingredient) {
                    ingredientsList += `<li>${measure ? measure : ''} ${ingredient}</li>`;
                }
            }

            detailsDiv.innerHTML = `
                <h2>${cocktail.strDrink}</h2>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" style="max-width: 300px;">
                <p><strong>Categoría:</strong> ${cocktail.strCategory}</p>
                <p><strong>Instrucciones:</strong> ${cocktail.strInstructions}</p>
                <p><strong>Ingredientes:</strong></p>
                <ul>${ingredientsList}</ul>
            `;
        })
        .catch(error => console.log("Error fetching cocktail details:", error));
}

// Cargar los ingredientes cuando la página se carga
window.onload = getIngredients;
