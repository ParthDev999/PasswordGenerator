// accessing using custom attribute,  [] ->syntax
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-Indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

// color indicator for strength
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow apply by own 
}

// getting random integer
function getRndInteger(min, max) {
    return Math.floor(Math.random()*(max - min)) + min;
}

// this is for getting the random number we want using above function
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// below generates lowerCase using  ASCII values and then converting them back to string
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

// uppercase
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// no mapping for symbols so we have to do make by our own by generating a random index
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// calculating strength for our password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    // checking if checkbox is checked or not 
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}


// now copying to clipboard
async function copyContent() {
    // error aane ka chance ke liye try and catch use kia 
    try {
        // jab tak ye na ho ta tak iske neeche wala nhi hona chaiye display 
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch (e) {
        copyMsg.innerText = 'Failed';
    }

    // 2 second baad wo msg remove karna hoga 
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// shuffling password function 
function shufflePassword(array){
    // fisher Yates Method
    // we have to pass here by array so we are using array 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// now applying event listeners


// first on the slider when it moves than password length will store its value and display at the desired location 
inputSlider.addEventListener('input', (e) => {
    // e ke andar slider wali value aa rhi hai
    passwordLength = e.target.value;
    handleSlider();
})


// copy button pe now
copyBtn.addEventListener('click', () => {
    // agar password ki kuch value hai tabhi copy hogi 
    if (passwordDisplay.value) {
        copyContent();
    }
})


// applying on checkboxes
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition 
    // if password length = 1 and we have 4 checked boxes than we want our password to be atleast of length = 4
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// agar checkbox me kuch bhi change aa rha hai toh start se count karo aur total checkCount store karo 
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})



// now on our main function generate password
generateBtn.addEventListener('click', () => {
    // if none of checkbox are selected
    if (checkCount == 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start the journey to find new password
    // remove old password 
    console.log("starting the journey")

    password = "";

    // first we try to fufill all the checkboxes need ....
    // means all 4 are ticked and passwordLength = 8 than at least sabke ek ek toh hone hi chaiye 
    // uske baad bache 4 me kuch bhi daal dege 
    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);


    console.log(funcArr) ;
    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // now we want to shuffle it 
    password = shufflePassword(Array.from(password)) ;

    // show in UI
    passwordDisplay.value = password ;

    // now calculate strength
    calcStrength() ;

})












