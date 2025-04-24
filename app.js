'use strict'

async function DadosContatos(numero) {
    const url = `http://localhost:8080/v1/whatsapp/contatos/${numero}`

    try {
        const response = await fetch(url)
        if (response.status === 200) {
            const data = await response.json()
            const contatos = document.getElementById('conversasLista')
            
            data.lista.forEach(item => {
                const nomeContato = document.createElement('h2') 
                nomeContato.textContent = item.name
                
                contatos.appendChild(nomeContato)
            })
        }
    } catch (erro) {
        console.error("Erro ao buscar contatos:", erro)
        alert("Erro ao buscar contatos. Verifique se a API está ativa e o número está correto.")
        return
    }
}

DadosContatos('11987876567')

const getFiltroContatos = async (name) => {
	const url = `http://localhost:8080/v1/whatsapp/filtro?numero=11987876567&name=${name}`
	const response = await fetch(url)
	const data = await response.json()

	if (response.status === 200 && data.contato.length === 1) {
		inicial_screen.replaceChildren('')
		inicial_screen.style.backgroundColor = 'whitesmoke'

		data.contato.forEach((item) => {
			item.mensagens.forEach((messages) => {
				const contentAllMe = document.createElement('div')
				const contentMe = document.createElement('div')
				const contentChatsMe = document.createElement('p')
				const talkTimeMe = document.createElement('p')

				const contentAllContact = document.createElement('div')
				const contentContact = document.createElement('div')
				const contentChatsContact = document.createElement('p')
				const talkTimeContact = document.createElement('p')
				const nameChatContact = document.createElement('p')

				contentAllMe.classList.add('content_all_me')
				contentMe.classList.add('messages', 'sender_me')
				contentAllContact.classList.add('content_all_contact')
				contentContact.classList.add('messages', 'sender_contact')

				if (messages.sender == 'me') {
					contentChatsMe.textContent = messages.content
					talkTimeMe.textContent = messages.time
					contentMe.appendChild(contentChatsMe)
					contentMe.appendChild(talkTimeMe)
					contentAllMe.appendChild(contentMe)
					inicial_screen.appendChild(contentAllMe)
				} else {
					const div = document.createElement('div')

					contentChatsContact.textContent = messages.content
					talkTimeContact.textContent = messages.time
					nameChatContact.textContent = messages.sender

					div.appendChild(contentChatsContact)
					div.appendChild(talkTimeContact)
					contentContact.appendChild(div)
					contentContact.appendChild(nameChatContact)
					contentAllContact.appendChild(contentContact)
					inicial_screen.appendChild(contentAllContact)
				}
			})
		})
	} else {
		alert('não foi possível acessar as conversas com este usuario!')
	}
}

contacts.addEventListener('click', (event) => {
	const executegetFiltroContatos = event.target.getAttribute('data-name')
	contacts.style.pointerEvents = 'none'
	setTimeout(() => {
		contacts.style.pointerEvents = 'all'
	}, 700)
	getFiltroContatos(executegetFiltroContatos)
})
// document.getElementById('pesquisar').addEventListener('click', preencherContatos)
