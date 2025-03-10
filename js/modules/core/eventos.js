// eventos.js - Gerenciamento de eventos da aplicação

import { logger } from '../utils/logger.js'
import { ui } from './ui.js'

/**
 * Módulo de eventos
 * Gerencia todos os event listeners globais da aplicação
 */
const eventos = {
  // Lista de eventos registrados
  eventListeners: [],

  /**
   * Inicializa o módulo de eventos
   */
  init() {
    logger.debug('Inicializando módulo de eventos')

    // Configurar eventos globais
    this.setupWindowEvents()
    this.setupKeyboardEvents()
    this.setupTouchEvents()

    // Configurar listeners para dispositivos móveis
    this.setupMobileEvents()

    logger.debug('Módulo de eventos inicializado')
  },

  /**
   * Configura eventos da janela (resize, load, etc)
   */
  setupWindowEvents() {
    // Evento de redimensionamento da janela
    this.addEvent(window, 'resize', this.handleResize.bind(this))

    // Evento de carregamento completo da página
    this.addEvent(window, 'load', this.handleLoad.bind(this))

    // Evento de rolagem da página
    this.addEvent(window, 'scroll', this.handleScroll.bind(this), {
      passive: true
    })

    // Evento de mudança de orientação (mobile)
    this.addEvent(
      window,
      'orientationchange',
      this.handleOrientationChange.bind(this)
    )

    // Evento para detectar quando o usuário sai da página
    this.addEvent(window, 'beforeunload', this.handleBeforeUnload.bind(this))
  },

  /**
   * Configura eventos de teclado
   */
  setupKeyboardEvents() {
    // Evento global de teclado
    this.addEvent(document, 'keydown', this.handleKeyDown.bind(this))
    this.addEvent(document, 'keyup', this.handleKeyUp.bind(this))
  },

  /**
   * Configura eventos de toque (mobile)
   */
  setupTouchEvents() {
    // Evento de toque para melhorar a experiência em dispositivos móveis
    this.addEvent(document, 'touchstart', () => {}, { passive: true })
  },

  /**
   * Configura eventos específicos para dispositivos móveis
   */
  setupMobileEvents() {
    // Detectar se é um dispositivo móvel
    const isMobile = this.isMobileDevice()

    if (isMobile) {
      logger.debug(
        'Dispositivo móvel detectado, configurando eventos específicos'
      )

      // Adicionar classe ao body para estilos específicos de mobile
      document.body.classList.add('mobile-device')

      // Manipular comportamento de hover para dispositivos de toque
      this.handleMobileHover()
    }
  },

  /**
   * Adiciona um event listener com referência para remoção posterior
   * @param {Element} element - O elemento ao qual adicionar o listener
   * @param {string} type - O tipo de evento
   * @param {Function} callback - A função de callback
   * @param {Object} options - Opções adicionais para o event listener
   */
  addEvent(element, type, callback, options = {}) {
    element.addEventListener(type, callback, options)

    // Guardar referência para poder remover depois
    this.eventListeners.push({
      element,
      type,
      callback,
      options
    })
  },

  /**
   * Remove um event listener específico
   * @param {Element} element - O elemento do qual remover o listener
   * @param {string} type - O tipo de evento
   * @param {Function} callback - A função de callback
   */
  removeEvent(element, type, callback) {
    element.removeEventListener(type, callback)

    // Remover da lista de controle
    this.eventListeners = this.eventListeners.filter(listener => {
      return !(
        listener.element === element &&
        listener.type === type &&
        listener.callback === callback
      )
    })
  },

  /**
   * Remove todos os event listeners registrados
   */
  removeAllEvents() {
    this.eventListeners.forEach(listener => {
      listener.element.removeEventListener(
        listener.type,
        listener.callback,
        listener.options
      )
    })

    this.eventListeners = []
  },

  /**
   * Handler para evento de redimensionamento da janela
   * @param {Event} event - O evento de redimensionamento
   */
  handleResize(event) {
    // Ajustar elementos baseados no tamanho da tela
    logger.debug('Evento de resize detectado', {
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Emitir evento personalizado para outros módulos responderem
    const resizeEvent = new CustomEvent('app:resize', {
      detail: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768
      }
    })

    document.dispatchEvent(resizeEvent)

    // Verificar se deveá fechar o menu mobile em telas grandes
    if (window.innerWidth >= 992 && ui.state.mobileMenuOpen) {
      ui.closeMobileMenu()
    }
  },

  /**
   * Handler para evento de carregamento completo da página
   * @param {Event} event - O evento de load
   */
  handleLoad(event) {
    logger.debug('Página totalmente carregada')

    // Remover o preloader se existir
    const preloader = document.getElementById('preloader')
    if (preloader) {
      preloader.classList.add('fade-out')
      setTimeout(() => {
        preloader.remove()
      }, 500)
    }

    // Emitir evento personalizado de load completo
    document.dispatchEvent(new CustomEvent('app:loaded'))
  },

  /**
   * Handler para evento de rolagem da página
   * @param {Event} event - O evento de scroll
   */
  handleScroll(event) {
    // Controle de elementos baseados na posição do scroll
    const scrollTop = window.scrollY

    // Emitir evento personalizado de scroll
    const scrollEvent = new CustomEvent('app:scroll', {
      detail: {
        position: scrollTop,
        direction: this.getScrollDirection(scrollTop)
      }
    })

    document.dispatchEvent(scrollEvent)
  },

  /**
   * Determina a direção do scroll
   * @param {number} currentPosition - A posição atual do scroll
   * @returns {string} - A direção do scroll ('up' ou 'down')
   */
  getScrollDirection(currentPosition) {
    // Variável estática para armazenar a posição anterior
    if (typeof this.lastScrollPosition === 'undefined') {
      this.lastScrollPosition = 0
    }

    const direction = currentPosition > this.lastScrollPosition ? 'down' : 'up'
    this.lastScrollPosition = currentPosition

    return direction
  },

  /**
   * Handler para evento de mudança de orientação (mobile)
   * @param {Event} event - O evento de orientationchange
   */
  handleOrientationChange(event) {
    logger.debug('Mudança de orientação detectada')

    // Emitir evento personalizado
    document.dispatchEvent(new CustomEvent('app:orientationchange'))
  },

  /**
   * Handler para evento antes de sair da página
   * @param {Event} event - O evento beforeunload
   */
  handleBeforeUnload(event) {
    // Se houver alterações não salvas, mostrar confirmação
    if (this.hasUnsavedChanges()) {
      event.preventDefault()
      event.returnValue = 'Há alterações não salvas. Deseja realmente sair?'
      return event.returnValue
    }
  },

  /**
   * Verifica se há alterações não salvas
   * @returns {boolean} - true se houver alterações não salvas
   */
  hasUnsavedChanges() {
    // Implementar lógica para verificar formulários não enviados, etc.
    return false
  },

  /**
   * Handler para evento de tecla pressionada
   * @param {KeyboardEvent} event - O evento de teclado
   */
  handleKeyDown(event) {
    // Registrar teclas pressionadas para atalhos
    const key = event.key.toLowerCase()

    // Atalhos globais
    if (event.ctrlKey || event.metaKey) {
      // Exemplo: Ctrl+S para salvar
      if (key === 's') {
        // Prevenir o comportamento padrão do navegador
        event.preventDefault()
        logger.debug('Atalho Ctrl+S detectado')

        // Emitir evento personalizado
        document.dispatchEvent(new CustomEvent('app:shortcut:save'))
      }
    }

    // Navegação por teclado para acessibilidade
    if (ui.state.modalOpen) {
      // Navegação dentro de modais
      this.handleModalKeyboardNavigation(event)
    }
  },

  /**
   * Handler para evento de tecla liberada
   * @param {KeyboardEvent} event - O evento de teclado
   */
  handleKeyUp(event) {
    // Implementar conforme necessário
  },

  /**
   * Gerencia navegação por teclado em modais (acessibilidade)
   * @param {KeyboardEvent} event - O evento de teclado
   */
  handleModalKeyboardNavigation(event) {
    const modal = document.getElementById(ui.state.currentModalId)
    if (!modal) return

    // Lidar com a tecla Tab para manter o foco dentro do modal
    if (event.key === 'Tab') {
      const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="checkbox"], select'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Se pressionou Shift+Tab e está no primeiro elemento, ir para o último
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
      // Se pressionou Tab e está no último elemento, voltar para o primeiro
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  },

  /**
   * Gerencia comportamento de hover em dispositivos móveis
   */
  handleMobileHover() {
    // Em dispositivos de toque, o primeiro toque ativa o hover, o segundo aciona o clique
    document.querySelectorAll('.hover-effect').forEach(element => {
      this.addEvent(element, 'touchstart', function (e) {
        if (!this.classList.contains('hover')) {
          e.preventDefault()

          // Remover hover de todos os outros elementos
          document.querySelectorAll('.hover-effect.hover').forEach(el => {
            if (el !== this) el.classList.remove('hover')
          })

          this.classList.add('hover')
        }
      })
    })

    // Remover todos os hovers ao tocar fora
    this.addEvent(document, 'touchstart', e => {
      if (!e.target.closest('.hover-effect')) {
        document.querySelectorAll('.hover-effect.hover').forEach(el => {
          el.classList.remove('hover')
        })
      }
    })
  },

  /**
   * Detecta se o dispositivo atual é móvel
   * @returns {boolean} - true se for um dispositivo móvel
   */
  isMobileDevice() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    )
  }
}

/**
 * Inicializa o módulo de eventos
 * @returns {Object} Retorna o objeto eventos para uso externo
 */
function initEventListeners() {
  eventos.init()
  return eventos
}

export { initEventListeners, eventos }
