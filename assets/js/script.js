function validaTextoEmBranco(input, status, label) {
    if (input.value != '') {
        document.getElementById(status).classList.remove('status-fail')
        document.getElementById(status).classList.add('status-ok')
        document.getElementById(status).innerHTML = '🗸'
    } else {
        document.getElementById(status).classList.add('status-fail')
        document.getElementById(status).classList.remove('status-ok')
        document.getElementById(status).innerHTML = label + ' não pode ser um espaço vazio.'
    }
}

function validaEmail(input, status, label) {
    if (input.value === '') {
        document.getElementById(status).classList.add('status-fail')
        document.getElementById(status).classList.remove('status-ok')
        document.getElementById(status).innerHTML = label + ' não pode ser um espaço vazio.'
    } else {
        arrobas = 0
        for (let i = 0; i < input.value.length; i++) {
            let char = input.value.charCodeAt(i);
            if (char == 64) {
                arrobas += 1
            }
        }
        if (arrobas >= 2) {
            document.getElementById(status).classList.add('status-fail')
            document.getElementById(status).classList.remove('status-ok')
            document.getElementById(status).innerHTML = label + ' não pode conter mais de um @.'
        } else if (arrobas == 0){
            document.getElementById(status).classList.add('status-fail')
            document.getElementById(status).classList.remove('status-ok')
            document.getElementById(status).innerHTML = label + ' deve conter um @.'
        } else {
            document.getElementById(status).classList.remove('status-fail')
            document.getElementById(status).classList.add('status-ok')
            document.getElementById(status).innerHTML = '🗸'
        }
    }
}

function validaSenha(senha1, senha2, status) {
    if (senha2.value === '') {
        document.getElementById(status).classList.add('status-fail')
        document.getElementById(status).classList.remove('status-ok')
        document.getElementById(status).innerHTML = 'Senha não pode ser um espaço vazio.'
    } else if (senha2.value != document.getElementById(senha1).value) {
        document.getElementById(status).classList.add('status-fail')
        document.getElementById(status).classList.remove('status-ok')
        document.getElementById(status).innerHTML = ' As senhas devem ser iguais.'
    } else {
        document.getElementById(status).classList.remove('status-fail')
        document.getElementById(status).classList.add('status-ok')
        document.getElementById(status).innerHTML = '🗸'
    }
}

//variavel count é para saber qual banner ele está mostrando, e como ele vai atualizando decidi
//fazer ele global
let count = 0

//É a quantidade de jogos no showcase menos 1, o menos 1 é para um calculo que faz na função
let qt = 2
setInterval(()=>{
    count++
    if(count > qt){
        count = 0
    }
    let marginpercent = (100*count*qt)/qt;
    const slider = document.getElementById("slider");
    slider.style.marginLeft = `-${marginpercent}%`;
    slider.style.transition = "1s";
}, 5000)