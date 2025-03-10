// logger.js - Utilitário para log e depuração

/**
 * Módulo utilitário para logging com diferentes níveis de severidade
 * e formatação personalizada
 */
const logger = {
  // Flag para habilitar ou desabilitar logs
  enabled: true,

  // Nível mínimo de log (debug < info < warn < error)
  minLevel: 'debug',

  // Array de níveis e suas prioridades
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  },

  // Cores para cada nível de log
  colors: {
    debug: '#7f8c8d', // cinza
    info: '#2980b9', // azul
    warn: '#f39c12', // laranja
    error: '#c0392b' // vermelho
  },

  /**
   * Verifica se um nível de log deve ser exibido
   * @param {string} level - O nível do log
   * @returns {boolean} - true se o log deve ser exibido
   */
  shouldLog(level) {
    return this.enabled && this.levels[level] >= this.levels[this.minLevel]
  },

  /**
   * Formata a mensagem de log com timestamp
   * @param {string} level - O nível do log
   * @param {string} message - A mensagem a ser logada
   * @returns {string} - A mensagem formatada
   */
  formatMessage(level, message) {
    const timestamp = new Date().toISOString().substring(11, 23)
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`
  },

  /**
   * Log de nível debug
   * @param {string} message - A mensagem a ser logada
   * @param {any} data - Dados adicionais opcionais
   */
  debug(message, data) {
    if (!this.shouldLog('debug')) return

    const formattedMessage = this.formatMessage('debug', message)

    console.log(
      `%c${formattedMessage}`,
      `color: ${this.colors.debug}; font-weight: bold;`
    )

    if (data !== undefined) {
      console.log(data)
    }
  },

  /**
   * Log de nível info
   * @param {string} message - A mensagem a ser logada
   * @param {any} data - Dados adicionais opcionais
   */
  info(message, data) {
    if (!this.shouldLog('info')) return

    const formattedMessage = this.formatMessage('info', message)

    console.log(
      `%c${formattedMessage}`,
      `color: ${this.colors.info}; font-weight: bold;`
    )

    if (data !== undefined) {
      console.log(data)
    }
  },

  /**
   * Log de nível warn
   * @param {string} message - A mensagem a ser logada
   * @param {any} data - Dados adicionais opcionais
   */
  warn(message, data) {
    if (!this.shouldLog('warn')) return

    const formattedMessage = this.formatMessage('warn', message)

    console.warn(
      `%c${formattedMessage}`,
      `color: ${this.colors.warn}; font-weight: bold;`
    )

    if (data !== undefined) {
      console.warn(data)
    }
  },

  /**
   * Log de nível error
   * @param {string} message - A mensagem a ser logada
   * @param {any} data - Dados adicionais opcionais
   */
  error(message, data) {
    if (!this.shouldLog('error')) return

    const formattedMessage = this.formatMessage('error', message)

    console.error(
      `%c${formattedMessage}`,
      `color: ${this.colors.error}; font-weight: bold;`
    )

    if (data !== undefined) {
      console.error(data)
    }
  },

  /**
   * Log com cronômetro para medição de performance
   * @param {string} label - O rótulo para o cronômetro
   */
  time(label) {
    if (!this.enabled) return
    console.time(label)
  },

  /**
   * Finaliza um cronômetro iniciado com time()
   * @param {string} label - O rótulo do cronômetro
   */
  timeEnd(label) {
    if (!this.enabled) return
    console.timeEnd(label)
  },

  /**
   * Log de grupo com títulos agrupados
   * @param {string} label - O título do grupo
   * @param {Function} callback - Função a ser executada dentro do grupo
   */
  group(label, callback) {
    if (!this.enabled) {
      callback()
      return
    }

    console.group(label)
    callback()
    console.groupEnd()
  },

  /**
   * Exibe uma tabela formatada
   * @param {Array|Object} data - Os dados a serem exibidos na tabela
   */
  table(data) {
    if (!this.enabled) return
    console.table(data)
  },

  /**
   * Limpa o console
   */
  clear() {
    if (!this.enabled) return
    console.clear()
  },

  /**
   * Define o nível mínimo de log
   * @param {string} level - O nível mínimo (debug, info, warn, error)
   */
  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.minLevel = level
    } else {
      this.warn(
        `Nível de log inválido: ${level}. Usando o padrão: ${this.minLevel}`
      )
    }
  },

  /**
   * Habilita ou desabilita os logs
   * @param {boolean} enabled - true para habilitar, false para desabilitar
   */
  setEnabled(enabled) {
    this.enabled = !!enabled
  },

  /**
   * Log condicional - só exibe se a condição for verdadeira
   * @param {boolean} condition - A condição a ser avaliada
   * @param {string} level - O nível de log (debug, info, warn, error)
   * @param {string} message - A mensagem a ser logada
   * @param {any} data - Dados adicionais opcionais
   */
  logIf(condition, level, message, data) {
    if (!condition) return

    switch (level) {
      case 'debug':
        this.debug(message, data)
        break
      case 'info':
        this.info(message, data)
        break
      case 'warn':
        this.warn(message, data)
        break
      case 'error':
        this.error(message, data)
        break
      default:
        this.info(message, data)
    }
  },

  /**
   * Exibe uma mensagem visual com estilo personalizado
   * @param {string} message - A mensagem a ser exibida
   * @param {Object} styles - Estilos CSS para a mensagem
   */
  highlight(message, styles = {}) {
    if (!this.enabled) return

    const defaultStyles = {
      padding: '4px 8px',
      'background-color': '#2ecc71',
      color: 'white',
      'border-radius': '4px',
      'font-weight': 'bold'
    }

    const mergedStyles = { ...defaultStyles, ...styles }
    const styleString = Object.entries(mergedStyles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ')

    console.log(`%c${message}`, styleString)
  }
}

// Configuração baseada no ambiente
// Verificar se estamos em ambiente de produção ou desenvolvimento
// No navegador, não temos process.env, então usamos uma abordagem diferente
const isProduction =
  window.location.hostname !== 'localhost' &&
  !window.location.hostname.includes('127.0.0.1') &&
  !window.location.hostname.includes('.local')

if (isProduction) {
  logger.enabled = false
} else {
  // Ambiente de desenvolvimento (localhost)
  logger.enabled = true
  logger.minLevel = 'debug'
}

export { logger }
