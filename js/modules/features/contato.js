/**
 * contato.js
 * Funcionalidades específicas para a página de contato
 */

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Buscar formulário
  const formContato = document.getElementById('contactForm');
  
  // Adicionar evento de envio
  if (formContato) {
    formContato.addEventListener('submit', handleEnvioFormulario);
  }
});

// Handler de envio do formulário
function handleEnvioFormulario(event) {
  event.preventDefault();
  
  // Obter valores do formulário
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  
  // Validação básica
  if (!validarFormulario(nome, email, mensagem)) {
    return;
  }
  
  // Simular envio para um servidor (pode ser substituído por um fetch real)
  mostrarEnviando();
  
  // Simulação de resposta do servidor (remover em produção)
  setTimeout(() => {
    // Simular sucesso (em produção, isso dependeria da resposta do servidor)
    mostrarSucesso();
    
    // Limpar formulário
    formContato.reset();
  }, 1500);
}

// Validação do formulário
function validarFormulario(nome, email, mensagem) {
  // Validar nome
  if (nome === '') {
    mostrarErro('Por favor, informe seu nome.');
    return false;
  }
  
  // Validar email
  if (email === '' || !validarEmail(email)) {
    mostrarErro('Por favor, informe um email válido.');
    return false;
  }
  
  // Validar mensagem
  if (mensagem === '') {
    mostrarErro('Por favor, digite sua mensagem.');
    return false;
  }
  
  return true;
}

// Validar formato de email
function validarEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

// Exibir mensagem de erro
function mostrarErro(mensagem) {
  // Verificar se já existe alerta
  let alerta = document.querySelector('.alert-danger');
  
  if (!alerta) {
    // Criar novo alerta
    alerta = document.createElement('div');
    alerta.className = 'alert alert-danger';
    
    // Inserir antes do formulário
    const formContato = document.getElementById('contactForm');
    formContato.parentNode.insertBefore(alerta, formContato);
  }
  
  // Definir mensagem
  alerta.textContent = mensagem;
  
  // Remover após 5 segundos
  setTimeout(() => {
    alerta.remove();
  }, 5000);
}

// Mostrar mensagem de "enviando"
function mostrarEnviando() {
  const botaoEnviar = document.querySelector('button[type="submit"]');
  botaoEnviar.disabled = true;
  botaoEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
}

// Mostrar mensagem de sucesso
function mostrarSucesso() {
  // Restaurar botão
  const botaoEnviar = document.querySelector('button[type="submit"]');
  botaoEnviar.disabled = false;
  botaoEnviar.innerHTML = 'Enviar';
  
  // Criar alerta de sucesso
  const alerta = document.createElement('div');
  alerta.className = 'alert alert-success';
  alerta.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
  
  // Inserir antes do formulário
  const formContato = document.getElementById('contactForm');
  formContato.parentNode.insertBefore(alerta, formContato);
  
  // Remover após 5 segundos
  setTimeout(() => {
    alerta.remove();
  }, 5000);
}
