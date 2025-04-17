'use strict'

async function DadosContatos(numero) {
    const url = `http://localhost:8080/v1/whatsapp/contatos/${numero}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }
        const dados = await response.json()
        return dados.dados_contato
    } catch (erro) {
        console.error("Erro ao buscar contatos:", erro)
        alert("Erro ao buscar contatos. Verifique se a API está ativa e o número está correto.")
        return []
    }
}

async function getFiltroContatos(numero, contato) {
    const url = `http://localhost:8080/v1/whatsapp/filtro?numero=${numero}&contato=${contato}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }
        const dados = await response.json()
        return dados.conversas[0].conversas
    } catch (erro) {
        console.error("Erro ao buscar conversas:", erro)
        alert("Erro ao buscar conversas. Certifique-se de que a API está rodando corretamente.")
        return []
    }
}



async function preencherConversas(contato) {
    const numero = document.getElementById('numero').value
    const mensagens = await getFiltroContatos(numero, contato)
    const chatBox = document.getElementById('chat')

    document.getElementById('nomeContato').textContent = contato
    chatBox.replaceChildren()

    mensagens.forEach(mensagem => {
        const msgDiv = document.createElement('div')
        msgDiv.textContent = `${mensagem.sender}: ${mensagem.content} (${mensagem.time})`
        msgDiv.classList.add(mensagem.sender === "me" ? "mensagem-enviada" : "mensagem-recebida")
        chatBox.appendChild(msgDiv)
    })
}

async function preencherContatos() {
    const numero = document.getElementById('numero').value
    const contatos = await DadosContatos(numero) // Função para buscar contatos pelo número
    const galeria = document.getElementById('conversasLista')

    galeria.replaceChildren()

    contatos.forEach(contato => {
        const contatoDiv = document.createElement('div')
        contatoDiv.classList.add('contato-item')
        contatoDiv.addEventListener('click', () => preencherConversas(contato.name))

        const img = document.createElement('img')
        img.src = './img/user.png'
        img.alt = contato.name

        const nome = document.createElement('span')
        nome.textContent = contato.name
        nome.classList.add('contato-nome')

        contatoDiv.appendChild(img)
        contatoDiv.appendChild(nome)
        galeria.appendChild(contatoDiv)
    })
}


document.getElementById('pesquisar').addEventListener('click', preencherContatos)
