var answers = {
    2: null,
    3: null,
    4: null,
    5: null
};

// Движение вперед
var btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
    button.addEventListener("click", function(){
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);

        if (thisCard.dataset.validate == "novalidate") {
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
        } else {            
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar("next", thisCardNumber);
            } else {
                alert("Заполните карточку, прежде чем перейти вперед!")
            }            
        }
    });
});

// Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener("click", function(){
        var thisCard = this.closest("[data-card]");
        var thisCardNumber = parseInt(thisCard.dataset.card);

        navigate("prev", thisCard);
        updateProgressBar("next", thisCardNumber);        
    })
});

// Функция для кнопок
function navigate(direction, thisCard) {
    
    var thisCardNumber = parseInt(thisCard.dataset.card);
    var nextCard;
    if (direction == "next") {
        nextCard = thisCardNumber + 1;
    } else if (direction == "prev") {
        nextCard = thisCardNumber - 1;
    }   
    
    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
    
}

// Функция сбора заполненых данных с карточки
function gatherCardData(number) {
    var question;
    var result = [];

    var currentCard = document.querySelector(`[data-card="${number}"]`);
   
    question = currentCard.querySelector("[data-question]").innerText;
    
    var radioValues = currentCard.querySelectorAll('[type="radio"]');

    radioValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item){
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });

    var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');

    inputValues.forEach(function(item){
        itemValue = item.value;
        if ( itemValue.trim() != "") {
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });
   
    var data = {
        question: question,
        answer: result
    };

    return data;
}

// Функция записи ответов
function saveAnswer(number, data) {
    answers[number] = data
}

// Функция проверки на заполненность
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Ф-я для проверки email
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}

// Функция проверки на заполненность email и required
function checkOnRequired(number) {
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll("[required]");

    var isValidArray = [];
    
    requiredFields.forEach(function(item){

        if( item.type == "checkbox" && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == "email") {
            if ( validateEmail(item.value) ) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    } 
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function(item){
    item.addEventListener("click", function(e){
        var label = e.target.closest("label");
        if (label) {
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item){
                item.classList.remove("radio-block--active");
            })
            label.classList.add("radio-block--active");
        }
    })
});

// Подсвечиваем рамку у checkbox
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
    item.addEventListener("change", function(){
        if (item.checked) {
            item.closest("label").classList.add("checkbox-block--active");
        } else {
            item.closest("label").classList.remove("checkbox-block--active");
        }
    })
});

// Функция отображения прогресс бара
function updateProgressBar(direction, cardNumber) {
    var cardsTotalNumber = document.querySelectorAll("[data-card]").length;

    if (direction == "next") {
        cardNumber = cardNumber + 1;
    } else if (direction == "prev") {
        cardNumber = cardNumber - 1;
    }

    var progress = ((cardNumber*100 ) / cardsTotalNumber).toFixed();
       
    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");
    if (progressBar) {
        progressBar.querySelector(".progress__label strong").innerHTML = `${progress}%`;
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }
}