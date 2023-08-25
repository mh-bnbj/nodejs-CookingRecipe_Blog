let addIngredientsBtn = document.getElementById('addIngredientsBtn')
let ingredientList = document.querySelector('.ingredientList')
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0]

addIngredientsBtn.addEventListener('click', function () {
    let newIngredients = ingredientDiv.cloneNode(true)
    let input = newIngredients.getElementsByTagName('input')[0]
    input.value = ''

    ingredientList.appendChild(newIngredients)
})

function getCookie(cname) {
    let name = cname + '='
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

console.log(getCookie('token'))
