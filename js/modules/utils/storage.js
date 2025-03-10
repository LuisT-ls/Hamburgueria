// storage.js - Utilitário para gerenciar o armazenamento local

/**
 * Módulo utilitário para interagir com o localStorage do navegador
 * com suporte a objetos JSON e tratamento de erros
 */
const storage = {
  /**
   * Salva um valor no localStorage
   * @param {string} key - A chave para armazenar o valor
   * @param {any} value - O valor a ser armazenado (será convertido para JSON se não for string)
   * @returns {boolean} - true se bem-sucedido, false caso contrário
   */
  set(key, value) {
    try {
      // Se não for string, converte para JSON
      const valueToStore =
        typeof value !== 'string' ? JSON.stringify(value) : value

      // Armazena no localStorage
      localStorage.setItem(key, valueToStore)
      return true
    } catch (error) {
      console.error('Erro ao armazenar no localStorage:', error)
      return false
    }
  },

  /**
   * Recupera um valor do localStorage
   * @param {string} key - A chave do valor a ser recuperado
   * @param {any} defaultValue - Valor padrão a ser retornado se a chave não existir
   * @returns {any} - O valor recuperado ou o valor padrão
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key)

      if (value === null) {
        return defaultValue
      }

      // Tenta fazer parse do JSON, se falhar retorna o valor como string
      try {
        return JSON.parse(value)
      } catch (e) {
        return value
      }
    } catch (error) {
      console.error('Erro ao recuperar do localStorage:', error)
      return defaultValue
    }
  },

  /**
   * Remove um valor do localStorage
   * @param {string} key - A chave do valor a ser removido
   * @returns {boolean} - true se bem-sucedido, false caso contrário
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error)
      return false
    }
  },

  /**
   * Limpa todo o localStorage
   * @returns {boolean} - true se bem-sucedido, false caso contrário
   */
  clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Erro ao limpar o localStorage:', error)
      return false
    }
  },

  /**
   * Verifica se uma chave existe no localStorage
   * @param {string} key - A chave a ser verificada
   * @returns {boolean} - true se a chave existir, false caso contrário
   */
  has(key) {
    try {
      return localStorage.getItem(key) !== null
    } catch (error) {
      console.error('Erro ao verificar chave no localStorage:', error)
      return false
    }
  },

  /**
   * Verifica se o localStorage está disponível
   * @returns {boolean} - true se disponível, false caso contrário
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }
}

export { storage }
