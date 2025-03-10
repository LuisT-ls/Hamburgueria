// animacoes.js - Gerenciamento de animações e efeitos visuais

import { logger } from '../utils/logger.js'

/**
 * Módulo de animações
 * Gerencia as animações e efeitos visuais do site
 */
const animacoes = {
  // Elementos que serão animados com scroll
  animatedElements: [
    { selector: '.hero-text', animation: 'slideInLeft', delay: 0 },
    { selector: '.hero-image', animation: 'slideInRight', delay: 300 },
    {
      selector: '.feature-card',
      animation: 'fadeIn',
      delay: 200,
      staggered: true
    },
    {
      selector: '.menu-item',
      animation: 'fadeIn',
      delay: 100,
      staggered: true
    },
    {
      selector: '.promocao-card',
      animation: 'fadeIn',
      delay: 200,
      staggered: true
    },
    {
      selector: '.testimonial-card',
      animation: 'fadeIn',
      delay: 200,
      staggered: true
    },
    { selector: '.delivery-text', animation: 'slideInLeft', delay: 0 },
    { selector: '.delivery-image', animation: 'slideInRight', delay: 200 },
    { selector: '.app-text', animation: 'slideInLeft', delay: 0 },
    { selector: '.app-image', animation: 'slideInRight', delay: 200 },
    { selector: '.section-header', animation: 'fadeIn', delay: 0 },
    { selector: '.cta-content', animation: 'fadeIn', delay: 0 },
    {
      selector: '.quality-item',
      animation: 'fadeIn',
      delay: 150,
      staggered: true
    },
    {
      selector: '.mission-card',
      animation: 'fadeIn',
      delay: 150,
      staggered: true
    },
    {
      selector: '.team-card',
      animation: 'fadeIn',
      delay: 150,
      staggered: true
    },
    {
      selector: '.award-item',
      animation: 'fadeIn',
      delay: 150,
      staggered: true
    },
    {
      selector: '.instagram-item',
      animation: 'fadeIn',
      delay: 100,
      staggered: true
    },
    { selector: '.contact-form', animation: 'fadeIn', delay: 200 },
    {
      selector: '.info-item',
      animation: 'slideInLeft',
      delay: 100,
      staggered: true
    },
    { selector: '.map-container', animation: 'fadeIn', delay: 300 },
    { selector: '.story-image', animation: 'slideInLeft', delay: 0 },
    { selector: '.story-text', animation: 'slideInRight', delay: 200 }
  ],

  // Flag para controlar se as animações estão habilitadas
  enabled: true,

  // Observer de interseção para animações on-scroll
  observer: null,

  /**
   * Inicializa o módulo de animações
   */
  init() {
    logger.debug('Inicializando módulo de animações')

    // Verificar suporte para animações
    this.checkSupport()

    // Configurar animações de scroll
    this.setupScrollAnimations()

    // Configurar animações específicas
    this.setupSpecificAnimations()

    logger.debug('Módulo de animações inicializado')
  },

  /**
   * Verifica o suporte a animações e preferências do usuário
   */
  checkSupport() {
    // Verificar se o navegador prefere animações reduzidas
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      logger.info(
        'Usuário prefere animações reduzidas. Desabilitando animações.'
      )
      this.enabled = false
    }
  },

  /**
   * Configura animações baseadas em scroll
   */
  setupScrollAnimations() {
    if (!this.enabled || !('IntersectionObserver' in window)) {
      // Se as animações estiverem desabilitadas ou o navegador não suportar
      // IntersectionObserver, exibe todos os elementos imediatamente
      this.showAllElements()
      return
    }

    // Opções para o observer
    const options = {
      root: null, // viewport como referência
      rootMargin: '0px',
      threshold: 0.15 // 15% do elemento visível
    }

    // Criar o observer
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const element = entry.target
        const animation = element.dataset.animation
        const delay = parseInt(element.dataset.delay || 0, 10)

        // Aplicar a animação após o delay
        setTimeout(() => {
          element.classList.add('animate', animation)

          // Depois da animação completa, remover o observer
          setTimeout(() => {
            observer.unobserve(element)
          }, 1000) // 1 segundo deve ser suficiente para a maioria das animações
        }, delay)
      })
    }, options)

    // Configurar os elementos para serem observados
    this.setupElementsToAnimate()
  },

  /**
   * Configura os elementos que serão animados
   */
  setupElementsToAnimate() {
    this.animatedElements.forEach(item => {
      const elements = document.querySelectorAll(item.selector)

      elements.forEach((element, index) => {
        // Adicionar classes e data attributes
        element.classList.add('to-animate')
        element.dataset.animation = item.animation

        // Se for animação em estágios (staggered), aumentar o delay
        // baseado na posição do elemento
        if (item.staggered) {
          element.dataset.delay = item.delay + index * 100
        } else {
          element.dataset.delay = item.delay
        }

        // Adicionar ao observer
        if (this.observer) {
          this.observer.observe(element)
        }
      })
    })
  },

  /**
   * Mostra todos os elementos sem animação (fallback)
   */
  showAllElements() {
    document.querySelectorAll('.to-animate').forEach(element => {
      element.style.opacity = '1'
      element.style.transform = 'none'
    })
  },

  /**
   * Configura animações específicas que não são baseadas em scroll
   */
  setupSpecificAnimations() {
    // Animação do hambúrguer na hero section
    const burgerImage = document.querySelector('.animated-burger')
    if (burgerImage && this.enabled) {
      burgerImage.classList.add('animate-pulse')
    }

    // Animação do contador (se houver)
    this.setupCounters()

    // Animação de hover nos cards
    this.setupHoverAnimations()
  },

  /**
   * Configura contadores animados (números crescentes)
   */
  setupCounters() {
    if (!this.enabled) return

    const counters = document.querySelectorAll('.counter')

    if (counters.length === 0) return

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    }

    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target
          const target = parseInt(element.dataset.target, 10)
          const duration = parseInt(element.dataset.duration || 2000, 10)
          const increment = target / (duration / 16) // 16ms = aproximadamente 60fps

          let current = 0

          const updateCounter = () => {
            current += increment
            if (current >= target) {
              element.textContent = target
              counterObserver.unobserve(element)
              return
            }

            element.textContent = Math.floor(current)
            requestAnimationFrame(updateCounter)
          }

          requestAnimationFrame(updateCounter)
        }
      })
    }, options)

    counters.forEach(counter => {
      counterObserver.observe(counter)
    })
  },

  /**
   * Configura animações de hover
   */
  setupHoverAnimations() {
    if (!this.enabled) return

    // Animação de hover para cards do menu
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const image = item.querySelector('img')
        if (image) {
          image.style.transform = 'scale(1.05)'
        }
      })

      item.addEventListener('mouseleave', () => {
        const image = item.querySelector('img')
        if (image) {
          image.style.transform = ''
        }
      })
    })
  },

  /**
   * Desabilita todas as animações
   */
  disable() {
    this.enabled = false
    this.showAllElements()

    // Desconectar o observer
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    logger.debug('Animações desabilitadas')
  },

  /**
   * Habilita as animações
   */
  enable() {
    this.enabled = true
    this.init()
    logger.debug('Animações habilitadas')
  },

  /**
   * Verifica se as animações estão habilitadas
   * @returns {boolean} status das animações
   */
  isEnabled() {
    return this.enabled
  }
}

/**
 * Inicializa o módulo de animações
 * @returns {Object} Retorna o objeto animacoes para uso externo
 */
function initAnimations() {
  animacoes.init()
  return animacoes
}

export { initAnimations, animacoes }
