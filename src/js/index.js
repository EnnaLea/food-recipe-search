import "../css/style.css";

const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

//get meal list that matches with the ingredients
searchBtn.addEventListener("click", async () => {
  const searchInput = document.getElementById("search-input");
  const searchInputTxt = searchInput.value.trim();
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`;
  const response = await fetch(url);
  const data = await response.json();
  let html = "";
  if (data.meals) {
    data.meals.forEach((meal) => {
      html += `
            <div class="meal-item text-center" data-id="${meal.idMeal}">
                <div class="meal-img">
                    <img src="${meal.strMealThumb}" alt="food">
                </div>
                <div class="meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
            </div>
            `;
    });
    mealList.classList.remove("notFound");
  } else {
    html = "Sorry, we didn't find any meal!";
    mealList.classList.add("notFound");
  }
  mealList.innerHTML = html;
});

//get recipe of the meal
mealList.addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    const mealItem = e.target.parentElement.parentElement;
    const url2 = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`;
    const response = await fetch(url2).catch((error) =>
      console.error("Error fetching data:", error)
    );

    const data = await response
      .json()
      .then(data => mealRecipeModal(data.meals))
      .catch((error) => console.error("Error parsing JSON:", error));
      
    //create a modal
    function mealRecipeModal(meal){
        console.log(meal)
        meal = meal[0];
        let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="food">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
        `;
        mealDetailsContent.innerHTML = html;
        mealDetailsContent.parentElement.classList.add('showRecipe');
    }

    //close recipe modal
    recipeCloseBtn.addEventListener('click', () =>{
        mealDetailsContent.parentElement.classList.remove('showRecipe');
    });
    
  }
});
