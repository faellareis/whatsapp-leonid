'use strict';

async function DadosContatos(numero) {
    const url = `http://localhost:8080/v1/whatsapp/contatos/${numero}`;

    try {
        const response = await fetch(url);
        if (response.status === 200) {
            const data = await response.json();
            const contatos = document.getElementById('conversasLista');
            contatos.innerHTML = ''; // Limpar antes de adicionar

            data.lista.forEach(item => {
                const nomeContato = document.createElement('h2');
                nomeContato.textContent = item.name;
                nomeContato.classList.add('contato'); // opcional para estilizar
                nomeContato.addEventListener('click', () => {
                    carregarMensagens(numero, item.name);
                });

                contatos.appendChild(nomeContato);
            });
        }
    } catch (erro) {
        console.error("Erro ao buscar contatos:", erro);
        alert("Erro ao buscar contatos. Verifique se a API está ativa e o número está correto.");
        return;
    }
}

async function carregarMensagens(numero, nomeContato) {
    const url = `http://localhost:8080/v1/whatsapp/filtro?numero=${numero}&name=${encodeURIComponent(nomeContato)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // Verificar o que a API está retornando

        if (response.status === 200) {
            const chat = document.getElementById('chat');
            const titulo = document.getElementById('nomeContato');

            titulo.textContent = nomeContato;
            chat.innerHTML = ''; // Limpa o chat antes de colocar as novas mensagens

            let mensagens = [];

            // Acesse as mensagens corretamente no formato da resposta fornecida
            if (data && Array.isArray(data) && data.length > 0) {
                // Verificando a estrutura de dados e pegando as mensagens
                data.forEach(item => {
                    if (item.contato === nomeContato) {
                        mensagens = item.mensagens;  // Acesse o campo "mensagens"
                    }
                });
            }

            if (mensagens.length > 0) {
                mensagens.forEach(msg => {
                    const mensagemElement = document.createElement('div');
                    mensagemElement.classList.add('mensagem');

                    const textoMsg = document.createElement('p');
                    textoMsg.textContent = msg.content || "Mensagem sem texto";  // Acesso correto ao campo "content"
                    mensagemElement.appendChild(textoMsg);

                    if (msg.sender) {
                        const senderElement = document.createElement('small');
                        senderElement.textContent = `De: ${msg.sender}`;
                        mensagemElement.appendChild(senderElement);
                    }

                    if (msg.time) {
                        const timeElement = document.createElement('small');
                        timeElement.textContent = ` - ${msg.time}`;
                        mensagemElement.appendChild(timeElement);
                    }

                    chat.appendChild(mensagemElement);
                });

                // Desce o scroll até a última mensagem
                chat.scrollTop = chat.scrollHeight;
            } else {
                alert('Não há mensagens para este contato.');
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar mensagens:", erro);
        alert("Erro ao carregar mensagens.");
    }
}


// Buscar contatos ao clicar no botão
document.getElementById('pesquisar').addEventListener('click', () => {
    const numero = document.getElementById('numero').value;
    if (numero) {
        DadosContatos(numero);
    } else {
        alert('Digite um número para buscar contatos.');
    }
});
