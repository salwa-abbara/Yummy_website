let data = document.querySelector('.data');
let searchContainer = document.getElementById("searchContainer");

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading").fadeOut(500);
        $("body").css("overflow", "visible");

    })
});




$("#categories").click(function(){
    getCategories();
   
  });
$("#search").click(function(){
    searchSection();

})
$("#area").click(function(){
    getArea();
})
$("#ingred").click(function(){
    getIngredients();
})
$("#contact").click(function(){
    showContacts();
})

////////////////////// navbar function /////////////////////////////
$(' nav .nav-click-section .nav-click-i').click(function(){
    let navLeft = $('nav').offset().left;
    if(navLeft === 0){
        closeNav();
    }else{
        openNav();
        
        
    }
});
function closeNav(){
    let sideWidth = $('.nav-tab').outerWidth();
    $('nav').css({left:`-${sideWidth}px`, transition: 'left 1s'});
    $('.nav-click-i').removeClass('fa-xmark');
    $('.nav-click-i').addClass('fa-bars');    
    $(".links ul li").animate({top: 350}, 500);

}
function openNav(){
    $('nav').css({left:`0px`, transition: 'left 1s'});
        $('.nav-click-i').addClass('fa-xmark');
        $('.nav-click-i').removeClass('fa-bars');
        for (let i = 0; i < 5; i++) {
            $(".links ul li").eq(i).animate({top: 0}, (i + 5) * 100);
        }

        

}
///////////////////////////////// search function ///////////////////////////////////////////////////

function searchSection() {
    closeNav();
    searchContainer.innerHTML = `
    
        <div class="col-span-6  ">
            <input id="searchName"  class=" py-0.5 px-2 placeholder:text-[12px]  appearance-none text-base bg-clip-padding border border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out focus:border-[#86b7fe]   focus:shadow-[0_0_0_.25rem_rgba(13,110,253,.25)] focus:outline-none w-full bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-span-6">
            <input id="searchLetter"  maxlength="1"  class="py-0.5 placeholder:text-[12px] px-2 text-base bg-clip-padding border border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out focus:border-[#86b7fe]  focus:shadow-[0_0_0_.25rem_rgba(13,110,253,.25)] focus:outline-none  w-full bg-transparent  text-white" type="text" placeholder="Search By First Letter">
        </div>
    `;
    $("#searchName").keyup(function(){
        console.log(this);
        searchByName(this.value);
        
    })

    $("#searchLetter").keyup(function(){
        searchByLetter(this.value);
    })
    data.innerHTML="";
}

async function searchByName(name){
    closeNav();
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    let meals= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let response = await meals.json();
    if(response.meals){
        displayMeals(response.meals);
    } else{
        displayMeals([]);
    }

    $(".inner-loader").fadeOut(300)
}

async function searchByLetter(letter) {
    closeNav();
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    letter == "" ? letter = "a" : "";
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    let response = await apiData.json()
    if(response.meals){
        displayMeals(response.meals) 
    }else{
        displayMeals([])
    }
    $(".inner-loader").fadeOut(300);

}

//////////////////////////// show meals function ///////////////////////////////////////////////////////
function displayMeals(meals) {
    $("#data").addClass('md:grid-cols-4');
    $("#data").addClass('ms-8');
    let cartoona = "";
    for (let i = 0; i < meals.length; i++) {
        cartoona += `
        <div  onclick="getMealDetails('${meals[i].idMeal}')"  class=" group relative   overflow-hidden  rounded-sm  cursor-pointer">
            <img class=" w-full" src="${meals[i].strMealThumb}" alt="" >
            <div class=" group-hover:top-0 w-full h-full top-full transition-all duration-500 bg-[#f9f6f6ca] absolute flex items-center text-black p-1">
                <h3 class=" text-lg font-semibold">${meals[i].strMeal}</h3>
            </div>
        </div>
        
        `
    };

    data.innerHTML = cartoona
}

async function getMealDetails(mealID) {
    closeNav();
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    searchContainer.innerHTML = "";
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    let respone = await apiData.json();
    displayMealDetails(respone.meals[0])
    $(".inner-loader").fadeOut(300)
}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";
    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let allTags = ''
    for (let i = 0; i < tags.length; i++) {
        allTags += `
        <li class="bg-[#f8d7da] text-[#842029] text-xs font-medium me-2 px-1 py-0.5 rounded ">${tags[i]}</li>`
    }
    if(tags.length == 0){
        allTags = "There is no Tags"
    }


    let recipe = ``
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            recipe += `<li class="bg-[#cff4fc] text-[#055160] text-xs font-medium me-2 px-1 py-0.5 rounded ">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    $('#data').removeClass('md:grid-cols-4');
    $('#data').addClass('md:grid-cols-12');
    let cartoona = `
    <div class=" col-span-4" >
                <img class="w-full img  rounded-md" src="${meal.strMealThumb}" alt=" meal image">
                <h2 class=" font-bold text-xl">${meal.strMeal}</h2>
    </div>
    <div class=" col-span-8">
                <h2 class=" font-bold mb-1 text-xl">Instructions</h2>
                <p class=" text-xs">${meal.strInstructions}</p>
                <h3 class=" mt-3 font-bold text-xl"><span class="font-bold  text-xl">Area : </span>${meal.strArea}</h3>
                <h3 class="font-bold text-xl"><span class="font-bold text-xl">Category : </span>${meal.strCategory}</h3>
                <h3 class="font-bold text-xl mb-3">Recipes :</h3>
                <ul class=" flex gap-2 flex-wrap">
                    ${recipe}
                </ul>

                <h3 class="font-bold text-xl mt-3 mb-3">Tags :</h3>
                <ul class="flex gap-2 flex-wrap mb-6">
                    ${allTags}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="bg-green-600  hover:bg-green-800 transition-all duration-75 text-white  text-xs py-1 px-2 rounded">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="bg-red-600 hover:bg-red-800 text-white transition-all duration-75 text-xs  py-1 px-2 rounded">Youtube</a>
    </div>`
    data.innerHTML = cartoona
}

////////////////////////////// categories function //////////////////////////////////////////////////
async function getCategories() {
    closeNav();
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    searchContainer.innerHTML = "";
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let response = await apiData.json()
    if(response.categories){
        displayCategories(response.categories);
    }else{
        displayCategories([]);
    }
    $(".inner-loader").fadeOut(300)

}

function displayCategories(categoriesArray) {
    $("#data").addClass('ms-8');
    $("#data").addClass('md:grid-cols-4');
    let cartoona = "";
    for (let i = 0; i < categoriesArray.length; i++) {
        cartoona += `
                <div onclick="getCategoryMeals('${categoriesArray[i].strCategory}')" class="group  relative group-hover:top-0 rounded-md overflow-hidden cursor-pointer">
                    <img class=" w-full" src="${categoriesArray[i].strCategoryThumb}" alt="categories image">
                    <div class="group-hover:top-0 w-full h-full top-full duration-700 transition-[top] bg-[#f9f6f6ca] absolute text-center text-black py-1 px-0.5">
                        <h3 class=" text-[20px] font-semibold">${categoriesArray[i].strCategory}</h3>
                        <p class="  text-[10px]">${categoriesArray[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        
        `
    }

    data.innerHTML = cartoona
}


async function getCategoryMeals(category) {
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let  response = await apiData.json()
    displayMeals(response.meals.slice(0, 20))
    $(".inner-loader").fadeOut(300)

}
///////////////////////////////// area function ///////////////////////////////////////////////
async function getArea() {
    closeNav();
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    searchContainer.innerHTML = "";
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let respone = await apiData.json();
    if(respone.meals){
        displayArea(respone.meals)
    }else{
        displayArea([])
    }
    $(".inner-loader").fadeOut(300)

}


function displayArea(areas) {
    $("#data").addClass('md:grid-cols-4');
    $("#data").addClass('ms-8');
    let cartoona = "";
    for (let i = 0; i < areas.length; i++) {
        cartoona += `
        
                <div onclick="getAreaMeals('${areas[i].strArea}')" class="rounded-md text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${areas[i].strArea}</h3>
                </div>
        
        `
    }

    data.innerHTML = cartoona
}

async function getAreaMeals(area) {
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)

    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let response = await apiData.json()
    let meals =response.meals.slice(0, 20)
    displayMeals(meals)
    $(".inner-loader").fadeOut(300)

}
////////////////////////////// ingredients function ///////////////////////////////////////////////////////
async function getIngredients() {
    closeNav();
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    searchContainer.innerHTML = "";
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let respone = await apiData.json();
    let meals=respone.meals.slice(0, 20);
    displayIngredients(meals)
    $(".inner-loader").fadeOut(300)
}


function displayIngredients(ingredients) {
    $("#data").addClass('md:grid-cols-4');
    $("#data").addClass('ms-8');
    let cartoona = "";
    for (let i = 0; i < ingredients.length; i++) {
        cartoona += `
        
                <div onclick="getIngredientsMeals('${ingredients[i].strIngredient}')" class="rounded-md text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredients[i].strIngredient}</h3>
                        <p>${ingredients[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        
        `
    }

    data.innerHTML = cartoona
}

async function getIngredientsMeals(ingredients) {
    data.innerHTML = ""
    $(".inner-loader").fadeIn(300)
    let apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    let response = await apiData.json()
    let meals=response.meals.slice(0, 20);
    displayMeals(meals);
    $(".inner-loader").fadeOut(300)

}
/////////////////////////////// contact us function ////////////////////////////////////////////////////

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function showContacts() {
    closeNav();
    // searchContainer.innerHTML="";
    $("#data").removeClass('md:grid-cols-4');
    $("#data").addClass('ms-0');
    data.innerHTML = `<div class=" min-h-screen flex justify-center items-center w-full">
                            <div class="container mx-auto w-[80%] text-center">
                                <div class="grid md:grid-cols-12 gap-4 ">
                                    <div class=" col-span-6">
                                        <input id="nameInput" onkeyup="inputsValidation()" type="text" class=" w-full py-0.5 px-2  appearance-none text-base bg-clip-padding border placeholder:text-[12px] placeholder:text-gray-500 border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out text-[#212529] focus:border-[#86b7fe]   focus:shad " placeholder="Enter Your Name">
                                        <div id="nameAlert" class=" w-full p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100   mt-2 hidden">
                                            Special characters and numbers not allowed
                                        </div>
                                    </div>
                                    <div class="col-span-6">
                                        <input id="emailInput" onkeyup="inputsValidation()" type="email" class=" w-full py-0.5 px-2  appearance-none text-base bg-clip-padding border placeholder:text-[12px] placeholder:text-gray-500 border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out text-[#212529] focus:border-[#86b7fe]   focus:shad  " placeholder="Enter Your Email">
                                        <div id="emailAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100  w-1full mt-2 hidden">
                                            Email not valid *exemple@yyy.zzz
                                        </div>
                                    </div>
                                    <div class="col-span-6">
                                        <input id="phoneInput" onkeyup="inputsValidation()" type="text" class=" w-full py-0.5 px-2  appearance-none text-base bg-clip-padding border placeholder:text-[12px] placeholder:text-gray-500 border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out text-[#212529] focus:border-[#86b7fe]   focus:shad " placeholder="Enter Your Phone">
                                        <div id="phoneAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100  w-full mt-2 hidden">
                                            Enter valid Phone Number
                                        </div>
                                    </div>
                                    <div class="col-span-6">
                                        <input id="ageInput" onkeyup="inputsValidation()" type="number" class="w-full py-0.5 px-2  appearance-none text-base bg-clip-padding border placeholder:text-[12px] placeholder:text-gray-500 border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out text-[#212529] focus:border-[#86b7fe]   focus:shad " placeholder="Enter Your Age">
                                        <div id="ageAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100  w-full mt-2 hidden">
                                            Enter valid age
                                        </div>
                                    </div>
                                    <div class="col-span-6">
                                        <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="w-full py-0.5 px-2  appearance-none text-base bg-clip-padding border placeholder:text-[12px] placeholder:text-gray-500 border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out text-[#212529] focus:border-[#86b7fe]   focus:shad " placeholder="Enter Your Password">
                                        <div id="passwordAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 w-full mt-2 hidden">
                                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                                        </div>
                                    </div>
                                    <div class="col-span-6">
                                        <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="w-full py-0.5 px-2  appearance-none text-base bg-clip-padding border placeholder:text-[12px] placeholder:text-gray-500 border-solid border-[#ced4da] rounded-md transition-all duration-150 ease-in-out text-[#212529] focus:border-[#86b7fe]   focus:shad " placeholder="Repassword">
                                        <div id="repasswordAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 w-full mt-2 hidden">
                                            Enter valid repassword 
                                        </div>
                                    </div>
                                </div>
                                <button id="submitBtn" disabled="true" class="bg-transparent  text-red-800 font-semibold  py-2  border border-red-800  rounded px-2  mt-3 focus:shadow-[0_0_0_.25rem] focus:shadow-red-900">Submit</button>
                            </div>
                            
                        </div> `

    $("#nameInput").focus(function(){   
        nameInputTouched = true;
    }) 

    $("#emailInput").focus(function() {
        emailInputTouched = true
    }
    )

    $("#phoneInput").focus( function() {
        phoneInputTouched = true
    })

    $("#ageInput").focus(function () {
        ageInputTouched = true
    })

    $("#passwordInput").focus(function() {
        passwordInputTouched = true
    })

    $("#repasswordInput").focus(function() {
        repasswordInputTouched = true
    })
}


function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            $("#nameAlert").removeClass(" block");
            $("#nameAlert").addClass("hidden");

        } else {
            $("#nameAlert").removeClass("hidden");
            $("#nameAlert").addClass(" block");

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            
            $("#emailAlert").removeClass(" block");
            $("#emailAlert").addClass("hidden");
        } else {
            
           $("#emailAlert").removeClass("hidden")
           $("#emailAlert").addClass("block");

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            $("#phoneAlert").removeClass(" block");
            $("#phoneAlert").addClass("hidden");
        } else {
            $("#phoneAlert").removeClass("hidden");
            $("#phoneAlert").addClass(" block");

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            $("#ageAlert").removeClass(" block");
            $("#ageAlert").addClass("hidden");
        } else {
            $("#ageAlert").removeClass("hidden");
            $("#ageAlert").addClass(" block");

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            $("#passwordAlert").removeClass(" block");
            $("#passwordAlert").addClass("hidden");
        } else {
            $("#passwordAlert").removeClass("hidden");
            $("#passwordAlert").addClass(" block");

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            $("#repasswordAlert").removeClass(" block");
            $("#repasswordAlert").addClass("hidden");
        } else {
            $("#repasswordAlert").removeClass("hidden");
            $("#repasswordAlert").addClass(" block");

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        $("#submitBtn").removeAttr("disabled");
        $("#submitBtn").addClass('hover:bg-red-600');
        $("#submitBtn").addClass('hover:text-white');
        $("#submitBtn").addClass('hover:border-transparent');

        
    } else {
        $("#submitBtn").attr("disabled","disabled");
        $("#submitBtn").removeClass('hover:bg-red-600');
        $("#submitBtn").removeClass('hover:text-white');
        $("#submitBtn").removeClass('hover:border-transparent');
        

    }
}
function nameValidation() {
    let regex=/^[a-zA-Z ]+$/;
    return (regex.test($("#nameInput").val()))
}
function emailValidation() {
    let regex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (regex.test($("#emailInput").val()))
}
function phoneValidation() {
    let regex=/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return (regex.test($("#phoneInput").val()))
}
function ageValidation() {
    let regex=/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
    return (regex.test($("#ageInput").val()))
}
function passwordValidation() {
    let regex=/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    return (regex.test($("#passwordInput").val()))
}
function repasswordValidation() {
    return (($("#repasswordInput").val()) == ($("#passwordInput").val()))
}
