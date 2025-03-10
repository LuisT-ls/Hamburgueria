// tema.js - Gerenciamento do tema claro/escuro

import { storage } from '../utils/storage.js'
import { logger } from '../utils/logger.js'

/**
 * Tema da aplicação
 * Gerencia a alternância entre o tema claro e escuro
 */
const tema = {
  // Chave para armazenar a preferência de tema no localStorage
  STORAGE_KEY: 'burgerhouse_theme',

  // Estado atual do tema (light ou dark)
  currentTheme: 'light',

  /**
   * Inicializa o sistema de temas
   */
  init() {
    logger.debug('Inicializando módulo de tema')

    // Verificar se há um tema salvo
    this.loadSavedTheme()

    // Verificar preferência do sistema se não houver tema salvo
    this.checkSystemPreference()

    // Aplicar o tema atual
    this.applyTheme(this.currentTheme)

    // Configurar os eventos
    this.setupEventListeners()

    logger.debug(`Tema inicial: ${this.currentTheme}`)
  },

  /**
   * Carrega o tema salvo no storage
   */
  loadSavedTheme() {
    const savedTheme = storage.get(this.STORAGE_KEY)
    if (savedTheme) {
      this.currentTheme = savedTheme
      logger.debug(`Tema carregado do storage: ${savedTheme}`)
    }
  },

  /**
   * Verifica a preferência de cor do sistema
   */
  checkSystemPreference() {
    // Só verifica a preferência do sistema se não houver tema salvo
    if (!storage.has(this.STORAGE_KEY)) {
      const prefersDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      if (prefersDarkScheme) {
        this.currentTheme = 'dark'
        logger.debug('Aplicando tema escuro com base na preferência do sistema')
      }
    }
  },

  /**
   * Configura os event listeners para troca de tema
   */
  setupEventListeners() {
    // Encontrar todos os toggles de tema na página
    const themeToggles = document.querySelectorAll('#theme-toggle')

    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        this.toggleTheme()
      })
    })

    // Detectar mudanças na preferência do sistema
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        // Só altera automaticamente se o usuário não tiver feito uma escolha
        if (!storage.has(this.STORAGE_KEY)) {
          const newTheme = e.matches ? 'dark' : 'light'
          this.applyTheme(newTheme)
          this.currentTheme = newTheme
        }
      })
  },

  /**
   * Alterna entre os temas claro e escuro
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'

    logger.debug(`Alternando tema de ${this.currentTheme} para ${newTheme}`)

    // Aplica o novo tema
    this.applyTheme(newTheme)

    // Atualiza o estado atual
    this.currentTheme = newTheme

    // Salva a preferência
    storage.set(this.STORAGE_KEY, newTheme)
  },

  /**
   * Aplica um tema específico ao site
   * @param {string} theme - 'light' ou 'dark'
   */
  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme')
      this.updateThemeToggleIcons('dark')
    } else {
      document.body.classList.remove('dark-theme')
      this.updateThemeToggleIcons('light')
    }
  },

  /**
   * Atualiza os ícones dos botões de toggle de tema
   * @param {string} theme - 'light' ou 'dark'
   */
  updateThemeToggleIcons(theme) {
    const themeToggles = document.querySelectorAll('#theme-toggle')

    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i')

      if (icon) {
        if (theme === 'dark') {
          // Se estamos no tema escuro, mostrar o ícone de sol
          icon.className = 'fas fa-sun'
        } else {
          // Se estamos no tema claro, mostrar o ícone de lua
          icon.className = 'fas fa-moon'
        }
      }
    })
  },

  /**
   * Define um tema específico
   * @param {string} theme - 'light' ou 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      logger.warn(`Tema inválido: ${theme}. Use 'light' ou 'dark'.`)
      return
    }

    this.applyTheme(theme)
    this.currentTheme = theme
    storage.set(this.STORAGE_KEY, theme)
  },

  /**
   * Retorna o tema atual
   * @returns {string} O tema atual ('light' ou 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme
  },

  /**
   * Verifica se o tema escuro está ativo
   * @returns {boolean} true se o tema escuro estiver ativo
   */
  isDarkTheme() {
    return this.currentTheme === 'dark'
  },

  /**
   * Remove a preferência de tema salva
   */
  resetTheme() {
    storage.remove(this.STORAGE_KEY)
    this.checkSystemPreference()
    this.applyTheme(this.currentTheme)
  }
}

/**
 * Inicializa o módulo de tema
 * @returns {Object} Retorna o objeto tema para uso externo
 */
function initTheme() {
  tema.init()
  return tema
}

export { initTheme, tema }
