async function enviarDados(event) {
    event.preventDefault()
    const formData = new FormData(document.getElementById('formulario'))
    const response = await fetch('http://127.0.0.1:80/novo', {
      method: 'POST',
      body: formData
    })
    if (response.status == 201) {
      alert('Usuário cadastrado com sucesso!')
      window.location.href = "sistemaEnt.html"
      return true
    } else if (response.status == 409) {
      alert('Usuário já tem cadastro!')
      return false
    } else {
      alert('Falha ao cadastrar! Fale com o suporte')
      return false
    }
}
function validaCPF() {
    const cpf = document.getElementById('cpf').value
    regex = /^\d+$/
    if (!regex.test(cpf)) { 
      alert("Informe somente números")
      return false
    }
    if (cpf.length !== 11) {
      alert("O CPF precisa ter 11 números")
      return false
    }
    return true
}
async function verificarUsuario() {

    const cpf_usuario = document.getElementById('cpf').value.trim()
    const resultado = document.getElementById('dados_tabela')
    const apiUrl = 'http://127.0.0.1/' + cpf_usuario
    const response = await fetch(apiUrl)

    if (!response.ok) {
    resultado.innerHTML = ` ID: ${id}<br> - NOME: ${nome}<br><br> - SETOR: ${setor}<br> - DESCRIÇÃO: ${descricao}<br> - DATA: ${data}<br> - STATUS: ${textostatus}<br>`;
    }
    else {
      const chamados = await response.json()
      
      for (let item of chamados) {
          let id = item.id;
          let nome = item.nome;
          let data = item.data;
          let setor = item.setor;
          let descricao = item.descricao;
          let status = item.status;
          let textostatus
          if (status == true) { 
            textostatus = "Chamado Aberto."
          }
          else {
            textostatus = "Chamado Encerrado."
          }

          resultado.innerHTML += `ID: ${id}<br>  - NOME: ${nome}<br> - SETOR: ${setor}<br> - DESCRIÇÃO: ${descricao}<br> - DATA: ${data}<br>  - STATUS: ${textostatus}<br>`;
      }
    }
}
function adicionarComentario() {
  let comentario = document.getElementById('id');
  const text = input.value.trim();
  if (text) {
      const list = document.getElementById('comentario-list');
      const item = document.createElement('li');
      item.textContent = text;
      list.appendChild(item);
      input.value = ''; // Limpa o campo de entrada
      
      // Aqui você pode adicionar uma chamada AJAX para enviar o comentário para o servidor
      fetch('/adicionarComentario', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comentario: text, ticketId: '1234' })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  } else {
      alert("Por favor, escreva um comentário antes de enviar.");
  }
}
