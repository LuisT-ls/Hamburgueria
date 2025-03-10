// ui.js - Gerenciamento da interface do usuário

import { logger } from '../utils/logger.js'

/**
 * Módulo de UI (User Interface)
 * Gerencia componentes e comportamentos da interface do usuário
 */
const ui = {
  // Estado de visibilidade dos diferentes componentes
  state: {
    mobileMenuOpen: false,
    cartOpen: false,
    modalOpen: false,
    currentModalId: null,
    scrollPosition: 0
  },

  /**
   * Inicializa o módulo de UI
   */
  init() {
    logger.debug('Inicializando módulo UI')

    // Preparar componentes da UI
    this.setupHeader()
    this.setupScrollBehavior()
    this.setupModals()
    this.setupForms()

    // Adicionar classes estilísticas
    this.addStylingClasses()

    logger.debug('Módulo UI inicializado')
  },

  /**
   * Configura o comportamento do header
   */
  setupHeader() {
    // Header fixo com efeito de shrink ao rolar
    const header = document.querySelector('.header')

    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('header-scrolled')
        } else {
          header.classList.remove('header-scrolled')
        }
      })

      // Verificar posição inicial do scroll
      if (window.scrollY > 50) {
        header.classList.add('header-scrolled')
      }
    }
  },

  /**
   * Configura o comportamento de rolagem
   */
  setupScrollBehavior() {
    // Links de rolagem suave para âncoras
    document
      .querySelectorAll('a[href^="#"]:not([href="#"])')
      .forEach(anchor => {
        anchor.addEventListener('click', e => {
          e.preventDefault()

          const targetId = anchor.getAttribute('href')
          const targetElement = document.querySelector(targetId)

          if (targetElement) {
            // Fechar o menu mobile se estiver aberto
            this.closeMobileMenu()

            // Rolar até o elemento
            window.scrollTo({
              top: targetElement.offsetTop - 80, // 80px de offset para o header
              behavior: 'smooth'
            })
          }
        })
      })

    // Botão de voltar ao topo (se existir)
    const backToTopButton = document.querySelector('.back-to-top')

    if (backToTopButton) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('active')
        } else {
          backToTopButton.classList.remove('active')
        }
      })

      backToTopButton.addEventListener('click', e => {
        e.preventDefault()
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      })
    }
  },

  /**
   * Configura os modais
   */
  setupModals() {
    // Links que abrem modais
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', e => {
        e.preventDefault()

        const modalId = trigger.dataset.modal
        this.openModal(modalId)
      })
    })

    // Botões de fechar modal
    document
      .querySelectorAll('.close-modal, .modal-overlay')
      .forEach(closeButton => {
        closeButton.addEventListener('click', () => {
          this.closeModal()
        })
      })

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.state.modalOpen) {
        this.closeModal()
      }
    })
  },

  /**
   * Configura os formulários
   */
  setupForms() {
    // Formulário de contato com validação
    const contactForm = document.getElementById('contact-form')

    if (contactForm) {
      contactForm.addEventListener('submit', e => {
        e.preventDefault()

        if (this.validateForm(contactForm)) {
          // Simular envio do formulário
          this.simulateFormSubmission(contactForm)
        }
      })

      // Validação de campos em tempo real
      contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => {
          this.validateField(field)
        })

        field.addEventListener('input', () => {
          // Remover mensagem de erro quando o usuário começa a digitar
          const errorElement = document.getElementById(`${field.id}-error`)
          if (errorElement) {
            errorElement.textContent = ''
          }
        })
      })
    }

    // Formulário de newsletter
    const newsletterForm = document.querySelector('.newsletter-form')

    if (newsletterForm) {
      newsletterForm.addEventListener('submit', e => {
        e.preventDefault()

        const emailInput = newsletterForm.querySelector('input[type="email"]')
        const termsCheckbox = newsletterForm.querySelector(
          'input[type="checkbox"]'
        )

        let isValid = true

        // Validar email
        if (!emailInput.value || !this.isValidEmail(emailInput.value)) {
          isValid = false
          this.showToast('Por favor, insira um email válido.')
        }

        // Validar checkbox dos termos
        if (termsCheckbox && !termsCheckbox.checked) {
          isValid = false
          this.showToast('Você precisa concordar com os termos.')
        }

        if (isValid) {
          // Simular sucesso
          this.showToast('Inscrição realizada com sucesso!', 'success')
          newsletterForm.reset()
        }
      })
    }
  },

  /**
   * Valida um formulário inteiro
   * @param {HTMLFormElement} form - O formulário a ser validado
   * @returns {boolean} - true se o formulário for válido
   */
  validateForm(form) {
    let isValid = true

    // Validar todos os campos
    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (field.hasAttribute('required')) {
        if (!this.validateField(field)) {
          isValid = false
        }
      }
    })

    return isValid
  },

  /**
   * Valida um campo específico do formulário
   * @param {HTMLElement} field - O campo a ser validado
   * @returns {boolean} - true se o campo for válido
   */
  validateField(field) {
    const errorElement = document.getElementById(`${field.id}-error`)

    // Se o campo não for obrigatório e estiver vazio, é válido
    if (!field.hasAttribute('required') && !field.value.trim()) {
      if (errorElement) errorElement.textContent = ''
      return true
    }

    // Verificar se está vazio
    if (field.hasAttribute('required') && !field.value.trim()) {
      if (errorElement) errorElement.textContent = 'Este campo é obrigatório.'
      return false
    }

    // Validações específicas por tipo
    if (field.type === 'email' && !this.isValidEmail(field.value)) {
      if (errorElement)
        errorElement.textContent = 'Por favor, insira um email válido.'
      return false
    }

    if (field.type === 'tel' && !this.isValidPhone(field.value)) {
      if (errorElement)
        errorElement.textContent = 'Por favor, insira um telefone válido.'
      return false
    }

    if (field.id === 'terms' && !field.checked) {
      if (errorElement)
        errorElement.textContent = 'Você precisa concordar com os termos.'
      return false
    }

    // Limpar mensagem de erro se o campo for válido
    if (errorElement) errorElement.textContent = ''

    return true
  },

  /**
   * Verifica se um email é válido
   * @param {string} email - O email a ser validado
   * @returns {boolean} - true se o email for válido
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Verifica se um número de telefone é válido
   * @param {string} phone - O telefone a ser validado
   * @returns {boolean} - true se o telefone for válido
   */
  isValidPhone(phone) {
    // Aceita vários formatos comuns de telefone brasileiro
    const phoneRegex = /^(\+\d{1,3}\s?)?\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/
    return phoneRegex.test(phone)
  },

  /**
   * Simula o envio do formulário (para demonstração)
   * @param {HTMLFormElement} form - O formulário a ser enviado
   */
  simulateFormSubmission(form) {
    // Adicionar classe de loading
    form.classList.add('loading')

    // Desabilitar botão de envio
    const submitButton = form.querySelector('button[type="submit"]')
    if (submitButton) {
      const originalText = submitButton.textContent
      submitButton.disabled = true
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...'

      // Simular tempo de processamento
      setTimeout(() => {
        // Remover classe de loading
        form.classList.remove('loading')

        // Restaurar botão
        submitButton.disabled = false
        submitButton.textContent = originalText

        // Resetar formulário
        form.reset()

        // Mostrar modal de sucesso ou toast
        const successModal = document.getElementById('success-modal')
        if (successModal) {
          this.openModal('success-modal')
        } else {
          this.showToast('Mensagem enviada com sucesso!', 'success')
        }
      }, 1500)
    }
  },

  /**
   * Adiciona classes estilísticas à interface
   */
  addStylingClasses() {
    // Adicionar classes de estilo para links ativos no menu
    const currentPath = window.location.pathname

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href')

      if (
        href === currentPath ||
        (currentPath.endsWith('/') && href === './')
      ) {
        link.classList.add('active')
      } else if (href !== './' && currentPath.includes(href)) {
        link.classList.add('active')
      }
    })
  },

  /**
   * Abre um modal
   * @param {string} modalId - O ID do modal a ser aberto
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (!modal) return

    // Salvar posição de scroll
    this.state.scrollPosition = window.scrollY

    // Adicionar classe para mostrar o modal
    modal.classList.add('active')

    // Atualizar estado
    this.state.modalOpen = true
    this.state.currentModalId = modalId

    // Impedir rolagem do body
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${this.state.scrollPosition}px`
    document.body.style.width = '100%'
  },

  /**
   * Fecha o modal atualmente aberto
   */
  closeModal() {
    if (!this.state.modalOpen) return

    const modal = document.getElementById(this.state.currentModalId)
    if (!modal) return

    // Remover classe active
    modal.classList.remove('active')

    // Restaurar rolagem
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, this.state.scrollPosition)

    // Atualizar estado
    this.state.modalOpen = false
    this.state.currentModalId = null
  },

  /**
   * Abre o menu mobile
   */
  openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileToggle = document.getElementById('mobile-menu-toggle')

    if (mobileMenu && mobileToggle) {
      mobileMenu.classList.add('active')
      mobileToggle.classList.add('active')
      this.state.mobileMenuOpen = true
    }
  },

  /**
   * Fecha o menu mobile
   */
  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileToggle = document.getElementById('mobile-menu-toggle')

    if (mobileMenu && mobileToggle) {
      mobileMenu.classList.remove('active')
      mobileToggle.classList.remove('active')
      this.state.mobileMenuOpen = false
    }
  },

  /**
   * Alterna o estado do menu mobile
   */
  toggleMobileMenu() {
    if (this.state.mobileMenuOpen) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  },

  /**
   * Exibe uma notificação toast
   * @param {string} message - A mensagem a ser exibida
   * @param {string} type - O tipo de toast (success, error, warning, info)
   */
  showToast(message, type = 'info') {
    // Verificar se já existe um container de toast
    let toastContainer = document.querySelector('.toast-container')

    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.className = 'toast-container'
      document.body.appendChild(toastContainer)
    }

    // Criar o toast
    const toast = document.createElement('div')
    toast.className = `toast toast-${type}`

    // Ícone baseado no tipo
    let icon = 'info-circle'
    if (type === 'success') icon = 'check-circle'
    if (type === 'error') icon = 'exclamation-circle'
    if (type === 'warning') icon = 'exclamation-triangle'

    // Conteúdo do toast
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="toast-content">${message}</div>
    `

    // Adicionar ao container
    toastContainer.appendChild(toast)

    // Mostrar o toast (atraso pequeno para permitir a animação)
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)

    // Remover após um tempo
    setTimeout(() => {
      toast.classList.remove('show')

      setTimeout(() => {
        toastContainer.removeChild(toast)

        // Remover o container se não houver mais toasts
        if (toastContainer.children.length === 0) {
          document.body.removeChild(toastContainer)
        }
      }, 300) // Tempo da animação de fade out
    }, 3000) // Tempo que o toast fica visível
  }
}

/**
 * Inicializa o módulo UI
 * @returns {Object} Retorna o objeto UI para uso externo
 */
function initUI() {
  ui.init()
  return ui
}

export { initUI, ui }
