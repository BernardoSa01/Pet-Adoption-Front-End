/* ====== Global Configurations ====== */

// Criando uma variável global para URL base do projeto
const API_URL = 'http://localhost:5001'


/* ==== Screen manipulation ==== */

// Função para mostrar apenas a 'section' selecionada
function showSection(sectionId) {
  // Pegando todas as 'sections'
  let getAllSections = document.querySelectorAll('.section')

  // Adicionando a classe hidden a todas as 'sections'
  getAllSections.forEach(section => {
    section.classList.add('hidden')
  })

  // Mostrando apenas a 'section' clicada
  document.getElementById(sectionId).classList.remove('hidden')

  // Altera o background conforme a 'section' clicada
  changeBackground(sectionId)
}


// Função para alteração dinâmica no background, de acordo com o botão clicado pelo usuário
function changeBackground(section) {
  const body = document.body

  if (section === 'home') {
    body.style.background = "url('./assets/background5.jpg') no-repeat right fixed"
    body.style.backgroundSize = "50%"
    body.style.backgroundColor = "#282828"
  } 
  else if (section === 'cadastrar') {
    body.style.background = "url('./assets/background4.jpg') no-repeat right fixed"
    body.style.backgroundSize = "50%"
    body.style.backgroundColor = "#282828"
  }
  else if (section === 'listar') {
    body.style.background = "#282828"
  }
}


/* ==== CRUD ==== */

// Função para registrar o pet, capturando os dados do formulário
function registerPet() {
  // Capturando os campos do form
  const nomeInput = document.getElementById('nome')
  const especieInput = document.getElementById('especie')
  const racaInput = document.getElementById('raca')
  const idadeInput = document.getElementById('idade')
  const sexoInput = document.getElementById('sexo')
  const descricaoInput = document.getElementById('descricao')

  // Validação para impedir que o usuário submeta o formulário com campos em branco
  if (
    !nomeInput.value.trim() ||
    !especieInput.value.trim() ||
    !racaInput.value.trim() ||
    !idadeInput.value.trim() ||
    !sexoInput.value.trim()
    ) {
      alert('Por favor, preencha todos os campos!')
      return
    }

  // Usando o fetch para conexão com o back-end
  fetch(`${API_URL}/pet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: nomeInput.value,
      especie: especieInput.value,
      raca: racaInput.value,
      idade: Number(idadeInput.value),
      sexo: sexoInput.value,
      descricao: descricaoInput.value   
    })
  })
  .then(response => response.json())
  .then(data => {
    alert('Pet cadastrado com sucesso!')
    console.log('Pet cadastrado', data)
    document.getElementById('form-cadastro').reset() // Se a requisição tiver sucesso, limpa o formulário
  })
  .catch(error => {
    console.error('Erro ao cadastrar pet', error)
    alert('Ocorreu um erro ao cadastrar o pet.')
  })
}


// Função para listar os pets cadastrados
function listPets() {
  // Capturando o tbody para inserir os pets listados
  const petsTable = document.getElementById('tabela-pets')

  // Limpando o conteúdo atual da tabela
  petsTable.innerHTML = ''

  fetch(`${API_URL}/pets`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    data.pets.forEach(pet => {
      // Para cada pet, crie uma nova linha na tabela
      const row = document.createElement('tr')

      // E crie uma coluna para cada informação do pet, e insira os dados na tabela com appendChild
      row.appendChild(createColumn(pet.nome))
      row.appendChild(createColumn(pet.especie))
      row.appendChild(createColumn(pet.raca))
      row.appendChild(createColumn(pet.idade))
      row.appendChild(createColumn(pet.sexo))
      row.appendChild(createColumn(pet.descricao))

      // Adicionando o botão de deletar na última coluna
      row.appendChild(createDeleteButton(pet.id))

      // Adicionando a linha na tabela
      petsTable.appendChild(row)
    })
  })
  .catch(error => {
    console.error('Erro ao carregar a lista', error)
    //alert('Ocorreu um erro ao carregar a lista')
  })
}


// Função de busca para encontrar um pet específico, tendo o nome como parâmetro de pesquisa
function searchPetByName() {
  const searchPet = document.getElementById('search-name').value
  // Capturando o tbody para inserir os pets listados
  const petsTable = document.getElementById('tabela-pets')

  // Limpando a tabela antes de exibir os resultados da pesquisa
  petsTable.innerHTML = ''

  fetch(`${API_URL}/pet?nome=${searchPet}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {

    // Validação para verificar se houve retorno na busca. Se não houve, encerra o serviço
    if (data.length === 0) {
      alert('Nenhum pet encontrado!')
      return
    }

    data.pets.forEach(pet => {
      // Para cada pet, crie uma nova linha na tabela
      const row = document.createElement('tr')

      // Crie uma coluna para cada informação do pet pesquisado, e insira os dados na tabela com appendChild
      row.appendChild(createColumn(pet.nome))
      row.appendChild(createColumn(pet.especie))
      row.appendChild(createColumn(pet.raca))
      row.appendChild(createColumn(pet.idade))
      row.appendChild(createColumn(pet.sexo))
      row.appendChild(createColumn(pet.descricao))

      // Adicionando o botão de deletar na última coluna
      row.appendChild(createDeleteButton(pet.id))

      // Adicionando a linha na tabela
      petsTable.appendChild(row)
    })
  })
  .catch(error => {
    console.error('Erro ao buscar pet', error)
    alert('Ocorreu um erro na busca')
  })

  //  limpa o input após buscar
  document.getElementById('search-name').value = ''
}


// Função para deletar um pet de acordo com a escolha do usuário
function deletePet(petId) {
  fetch(`${API_URL}/pet?id=${petId}`, {
    method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ id: petId })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message || 'Pet deletado com sucesso!')
    console.log('Sucesso ao deletar pet', data)
    listPets()
  })
  .catch(error => {
    console.error('Erro ao deletar pet', error)
    alert('Ocorreu um erro ao deletar o pet.')
  })
}


/* ==== Helper functions ==== */

// Inicializando a aplicação
function initializeApp() {
  showSection('home')
}

window.onload = initializeApp


// Função auxiliar para criação de colunas
function createColumn(content) { 
  const column = document.createElement('td'); 
  column.textContent = content; 
  column.style.color = '#282828'; 
  return column;
}


// Função auxiliar para criar o botão de delete
function createDeleteButton(petId) {
  // Criando uma coluna com um botão 'X' que servirá para deletar o pet caso seja desejo do usuário
  const deletionColumn = document.createElement('td') 
  const deleteButton = document.createElement('span')
  deleteButton.textContent = 'X'
  deleteButton.classList.add('delete-button')

  // Ao clicar no botão, o usuário precisará confirmar a exclusão
  deleteButton.onclick = () => {
    if (confirm('Tem certeza que deseja excluir este pet?')) {
      deletePet(petId)
    }
  }
  deletionColumn.appendChild(deleteButton)
  return deletionColumn
}


/* ==== Event listeners ==== */

// Adicionando um event listener, para capturar a submissão do formulário
document.getElementById('form-cadastro').addEventListener('submit', function(event) {
  event.preventDefault() // Aplicando o prevent default para impedir que página recarregue
  registerPet()
})

// Adicionando um event listener, para exibir a lista de pets cadastrados ao clique no botão 'Listar Pets'
document.getElementById('btn-list').addEventListener('click', () => {
  showSection('listar')
  listPets()
})

// Adicionando um event listener, para exibir o pet específico com base na pesquisa do usuário
document.getElementById('btn-search').addEventListener('click', searchPetByName)

