// validador.js - Utilitário para validação de dados

/**
 * Módulo utilitário para validação de diversos tipos de dados
 */
const validador = {
  /**
   * Valida se uma string não está vazia
   * @param {string} value - O valor a ser validado
   * @returns {boolean} - true se a string não for vazia
   */
  required(value) {
    return typeof value === 'string' && value.trim().length > 0
  },

  /**
   * Valida um endereço de email
   * @param {string} email - O email a ser validado
   * @returns {boolean} - true se o email for válido
   */
  email(email) {
    if (!email || typeof email !== 'string') return false

    // Regex para validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Valida um número de telefone (formato brasileiro)
   * @param {string} phone - O telefone a ser validado
   * @returns {boolean} - true se o telefone for válido
   */
  phone(phone) {
    if (!phone || typeof phone !== 'string') return false

    // Remove todos os caracteres não numéricos
    const digits = phone.replace(/\D/g, '')

    // Verifica se o número tem entre 10 e 11 dígitos
    // (10 para fixo sem DDD, 11 para celular com 9 na frente)
    if (digits.length < 10 || digits.length > 11) return false

    // Se for um celular (11 dígitos), verifica se começa com 9
    if (digits.length === 11 && digits[2] !== '9') return false

    return true
  },

  /**
   * Valida um nome (pelo menos nome e sobrenome)
   * @param {string} name - O nome a ser validado
   * @returns {boolean} - true se o nome for válido
   */
  fullName(name) {
    if (!name || typeof name !== 'string') return false

    // Divide o nome e verifica se tem pelo menos 2 partes
    const parts = name.trim().split(/\s+/)
    return parts.length >= 2
  },

  /**
   * Valida um CPF
   * @param {string} cpf - O CPF a ser validado
   * @returns {boolean} - true se o CPF for válido
   */
  cpf(cpf) {
    if (!cpf || typeof cpf !== 'string') return false

    // Remove caracteres não numéricos
    const digits = cpf.replace(/\D/g, '')

    // Verifica se tem 11 dígitos
    if (digits.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(digits)) return false

    // Calcula o primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits.charAt(i)) * (10 - i)
    }

    let firstDigit = 11 - (sum % 11)
    if (firstDigit > 9) firstDigit = 0

    // Verifica se o primeiro dígito verificador está correto
    if (parseInt(digits.charAt(9)) !== firstDigit) return false

    // Calcula o segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(digits.charAt(i)) * (11 - i)
    }

    let secondDigit = 11 - (sum % 11)
    if (secondDigit > 9) secondDigit = 0

    // Verifica se o segundo dígito verificador está correto
    return parseInt(digits.charAt(10)) === secondDigit
  },

  /**
   * Valida um CEP brasileiro
   * @param {string} cep - O CEP a ser validado
   * @returns {boolean} - true se o CEP for válido
   */
  cep(cep) {
    if (!cep || typeof cep !== 'string') return false

    // Remove caracteres não numéricos
    const digits = cep.replace(/\D/g, '')

    // Verifica se tem 8 dígitos
    return digits.length === 8
  },

  /**
   * Valida uma data no formato DD/MM/YYYY
   * @param {string} date - A data a ser validada
   * @returns {boolean} - true se a data for válida
   */
  date(date) {
    if (!date || typeof date !== 'string') return false

    // Verifica o formato DD/MM/YYYY
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false

    // Extrai dia, mês e ano
    const [day, month, year] = date.split('/').map(Number)

    // Verifica se a data é válida
    const dateObj = new Date(year, month - 1, day)
    return (
      dateObj.getFullYear() === year &&
      dateObj.getMonth() === month - 1 &&
      dateObj.getDate() === day
    )
  },

  /**
   * Valida se uma string tem um comprimento mínimo
   * @param {string} value - O valor a ser validado
   * @param {number} min - O comprimento mínimo
   * @returns {boolean} - true se a string tiver comprimento maior ou igual ao mínimo
   */
  minLength(value, min) {
    return typeof value === 'string' && value.length >= min
  },

  /**
   * Valida se uma string tem um comprimento máximo
   * @param {string} value - O valor a ser validado
   * @param {number} max - O comprimento máximo
   * @returns {boolean} - true se a string tiver comprimento menor ou igual ao máximo
   */
  maxLength(value, max) {
    return typeof value === 'string' && value.length <= max
  },

  /**
   * Valida se um número está dentro de um intervalo
   * @param {number} value - O valor a ser validado
   * @param {number} min - O valor mínimo
   * @param {number} max - O valor máximo
   * @returns {boolean} - true se o número estiver dentro do intervalo
   */
  range(value, min, max) {
    return typeof value === 'number' && value >= min && value <= max
  },

  /**
   * Valida se um valor é um número
   * @param {any} value - O valor a ser validado
   * @returns {boolean} - true se o valor for um número
   */
  number(value) {
    return !isNaN(parseFloat(value)) && isFinite(value)
  },

  /**
   * Valida se um valor é um número inteiro
   * @param {any} value - O valor a ser validado
   * @returns {boolean} - true se o valor for um número inteiro
   */
  integer(value) {
    return Number.isInteger(Number(value))
  },

  /**
   * Valida se um valor é um número decimal
   * @param {any} value - O valor a ser validado
   * @returns {boolean} - true se o valor for um número decimal
   */
  decimal(value) {
    return this.number(value) && !this.integer(value)
  },

  /**
   * Valida um cartão de crédito
   * @param {string} cardNumber - O número do cartão a ser validado
   * @returns {boolean} - true se o cartão for válido
   */
  creditCard(cardNumber) {
    if (!cardNumber || typeof cardNumber !== 'string') return false

    // Remove espaços e traços
    const digits = cardNumber.replace(/[\s-]/g, '')

    // Verifica se tem somente dígitos
    if (!/^\d+$/.test(digits)) return false

    // Verifica o comprimento (a maioria dos cartões tem 13-19 dígitos)
    if (digits.length < 13 || digits.length > 19) return false

    // Algoritmo de Luhn (https://en.wikipedia.org/wiki/Luhn_algorithm)
    let sum = 0
    let double = false

    // Iterar de trás para frente
    for (let i = digits.length - 1; i >= 0; i--) {
      let current = parseInt(digits.charAt(i))

      if (double) {
        current *= 2
        if (current > 9) current -= 9
      }

      sum += current
      double = !double
    }

    return sum % 10 === 0
  },

  /**
   * Valida uma URL
   * @param {string} url - A URL a ser validada
   * @returns {boolean} - true se a URL for válida
   */
  url(url) {
    if (!url || typeof url !== 'string') return false

    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  },

  /**
   * Valida se uma senha é forte
   * @param {string} password - A senha a ser validada
   * @param {Object} options - Opções de validação
   * @returns {boolean} - true se a senha for forte
   */
  strongPassword(password, options = {}) {
    if (!password || typeof password !== 'string') return false

    const defaultOptions = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }

    const config = { ...defaultOptions, ...options }

    // Verifica o comprimento mínimo
    if (password.length < config.minLength) return false

    // Verifica requisitos de caracteres
    if (config.requireUppercase && !/[A-Z]/.test(password)) return false
    if (config.requireLowercase && !/[a-z]/.test(password)) return false
    if (config.requireNumbers && !/\d/.test(password)) return false
    if (
      config.requireSpecialChars &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    )
      return false

    return true
  },

  /**
   * Valida um arquivo por sua extensão
   * @param {string} filename - O nome do arquivo
   * @param {Array<string>} allowedExtensions - Array de extensões permitidas
   * @returns {boolean} - true se a extensão do arquivo for permitida
   */
  fileExtension(filename, allowedExtensions) {
    if (
      !filename ||
      typeof filename !== 'string' ||
      !Array.isArray(allowedExtensions)
    ) {
      return false
    }

    const extension = filename.split('.').pop().toLowerCase()
    return allowedExtensions.includes(extension)
  },

  /**
   * Valida o tamanho de um arquivo
   * @param {number} filesize - O tamanho do arquivo em bytes
   * @param {number} maxSize - O tamanho máximo permitido em bytes
   * @returns {boolean} - true se o tamanho do arquivo for permitido
   */
  fileSize(filesize, maxSize) {
    return (
      typeof filesize === 'number' &&
      typeof maxSize === 'number' &&
      filesize <= maxSize
    )
  },

  /**
   * Método principal que executa validações múltiplas
   * @param {any} value - O valor a ser validado
   * @param {Array<Object>} rules - Array de regras de validação
   * @returns {Object} - Objeto com resultado da validação e mensagens de erro
   */
  validate(value, rules) {
    const errors = []

    for (const rule of rules) {
      const { type, options, message } = rule

      // Ignora validações undefined ou null, a menos que seja a regra 'required'
      if ((value === undefined || value === null) && type !== 'required') {
        continue
      }

      let isValid = false

      // Executa a validação correspondente
      switch (type) {
        case 'required':
          isValid = this.required(value)
          break
        case 'email':
          isValid = this.email(value)
          break
        case 'phone':
          isValid = this.phone(value)
          break
        case 'fullName':
          isValid = this.fullName(value)
          break
        case 'cpf':
          isValid = this.cpf(value)
          break
        case 'cep':
          isValid = this.cep(value)
          break
        case 'date':
          isValid = this.date(value)
          break
        case 'minLength':
          isValid = this.minLength(value, options.min)
          break
        case 'maxLength':
          isValid = this.maxLength(value, options.max)
          break
        case 'range':
          isValid = this.range(value, options.min, options.max)
          break
        case 'number':
          isValid = this.number(value)
          break
        case 'integer':
          isValid = this.integer(value)
          break
        case 'decimal':
          isValid = this.decimal(value)
          break
        case 'creditCard':
          isValid = this.creditCard(value)
          break
        case 'url':
          isValid = this.url(value)
          break
        case 'strongPassword':
          isValid = this.strongPassword(value, options)
          break
        case 'fileExtension':
          isValid = this.fileExtension(value, options.allowedExtensions)
          break
        case 'fileSize':
          isValid = this.fileSize(value, options.maxSize)
          break
        case 'custom':
          // Permite funções personalizadas de validação
          isValid =
            typeof options.validator === 'function' && options.validator(value)
          break
        default:
          console.warn(`Tipo de validação desconhecido: ${type}`)
          isValid = true
      }

      if (!isValid) {
        errors.push(message || `Validação '${type}' falhou.`)
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export { validador }
