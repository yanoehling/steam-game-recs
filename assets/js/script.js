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
