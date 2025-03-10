// App.js - Arquivo JavaScript principal

// Importação dos módulos
import { initAnimations } from './modules/core/animacoes.js'
import { initEventListeners } from './modules/core/eventos.js'
import { initUI } from './modules/core/ui.js'
import { initTheme } from './modules/features/tema.js'
import { logger } from './modules/utils/logger.js'
import { storage } from './modules/utils/storage.js'

// Dados do menu para cardápio
const menuItems = [
  {
    id: 'classic-burger',
    name: 'Classic Burger',
    price: 25.9,
    description:
      'Hambúrguer de carne bovina, queijo cheddar, alface, tomate e molho especial.',
    image: '../assets/img/placeholders/classicburguer.jpg',
    category: 'tradicional',
    rating: 4.8,
    featured: false
  },
  {
    id: 'cheese-bacon',
    name: 'Cheese Bacon',
    price: 29.9,
    description:
      'Hambúrguer de carne bovina, queijo cheddar, bacon crocante, alface, tomate e molho especial.',
    image: '../assets/img/placeholders/cheesebacon.jpg',
    category: 'tradicional',
    rating: 4.9,
    featured: true
  },
  {
    id: 'double-burger',
    name: 'Double Burger',
    price: 34.9,
    description:
      'Dois hambúrgueres de carne bovina, queijo cheddar dobrado, alface, tomate, cebola caramelizada e molho especial.',
    image: '../assets/img/placeholders/doubleburguer.jpg',
    category: 'tradicional',
    rating: 4.7,
    featured: false
  },
  {
    id: 'premium-burger',
    name: 'Premium Burger',
    price: 39.9,
    description:
      'Hambúrguer de carne premium, queijo gruyère, cogumelos salteados, rúcula, cebola caramelizada e molho trufado.',
    image: '../assets/img/placeholders/premiumburguer.jpg',
    category: 'especial',
    rating: 5.0,
    featured: true
  },
  {
    id: 'veggie-burger',
    name: 'Veggie Burger',
    price: 27.9,
    description:
      'Hambúrguer de grão-de-bico e legumes, queijo vegano, alface, tomate, cebola roxa e molho vegano especial.',
    image: '../assets/img/placeholders/veggieburguer.jpg',
    category: 'vegano',
    rating: 4.6,
    featured: false
  },
  {
    id: 'spicy-burger',
    name: 'Spicy Burger',
    price: 32.9,
    description:
      'Hambúrguer de carne bovina, pimenta jalapeño, queijo pepper jack, cebola roxa, alface e molho apimentado.',
    image: '../assets/img/placeholders/spicyburguer.jpg',
    category: 'especial',
    rating: 4.5,
    featured: false
  },
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    price: 26.9,
    description:
      'Hambúrguer de frango grelhado, queijo suíço, alface, tomate, picles e molho de mostarda e mel.',
    image: '../assets/img/placeholders/chickenburguer.webp',
    category: 'tradicional',
    rating: 4.4,
    featured: false
  },
  {
    id: 'bbq-burger',
    name: 'BBQ Burger',
    price: 31.9,
    description:
      'Hambúrguer de carne bovina, bacon, queijo cheddar, anéis de cebola, alface e molho barbecue.',
    image: '../assets/img/placeholders/bbqburguer.jpg',
    category: 'especial',
    rating: 4.7,
    featured: true
  },
  {
    id: 'quinoa-burger',
    name: 'Quinoa Burger',
    price: 28.9,
    description:
      'Hambúrguer de quinoa e legumes, alface, tomate, abacate, cebola roxa e molho de iogurte vegano.',
    image: '../assets/img/placeholders/quinoaburguer.jpg',
    category: 'vegano',
    rating: 4.5,
    featured: false
  },
  {
    id: 'classic-fries',
    name: 'Batata Frita Clássica',
    price: 12.9,
    description:
      'Porção de batatas fritas crocantes por fora e macias por dentro.',
    image: '../assets/img/placeholders/classicfries.jpg',
    category: 'acompanhamento',
    rating: 4.5,
    featured: false
  },
  {
    id: 'onion-rings',
    name: 'Anéis de Cebola',
    price: 14.9,
    description:
      'Anéis de cebola empanados e fritos, servidos com molho especial.',
    image: '../assets/img/placeholders/onionrings.jpg',
    category: 'acompanhamento',
    rating: 4.6,
    featured: false
  },
  {
    id: 'cola',
    name: 'Refrigerante Cola',
    price: 6.9,
    description: 'Refrigerante de cola gelado (350ml).',
    image: '../assets/img/placeholders/cola.jpg',
    category: 'bebida',
    rating: 4.8,
    featured: false
  },
  {
    id: 'milkshake',
    name: 'Milkshake',
    price: 15.9,
    description:
      'Milkshake cremoso nos sabores chocolate, baunilha ou morango.',
    image: '../assets/img/placeholders/milkshake.jpg',
    category: 'bebida',
    rating: 4.9,
    featured: true
  }
]

// Classe principal da aplicação
class App {
  constructor() {
    this.menuItems = menuItems
    this.cart = []
    this.currentFilter = 'all'

    // Carregar carrinho do storage local
    this.loadCart()

    // Inicializar a aplicação quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init()
    })
  }

  // Inicialização de todos os componentes
  init() {
    logger.info('Inicializando a aplicação')

    // Inicializar componentes da UI
    initUI()

    // Inicializar animações
    initAnimations()

    // Inicializar tema
    initTheme()

    // Inicializar listeners de eventos
    initEventListeners()

    // Renderizar o menu
    this.renderMenu()

    // Configurar os listeners específicos
    this.setupEventListeners()

    logger.info('Aplicação inicializada com sucesso')
  }

  // Configurar os listeners de eventos específicos
  setupEventListeners() {
    // Filtros do menu
    const filterButtons = document.querySelectorAll('.filter-btn')
    if (filterButtons.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filter = button.dataset.filter
          this.filterMenu(filter)

          // Atualizar classe ativa
          filterButtons.forEach(btn => btn.classList.remove('active'))
          button.classList.add('active')
        })
      })
    }

    // Botão do carrinho
    const cartButton = document.getElementById('cart-button')
    const closeCartButton = document.getElementById('close-cart')
    const cartModal = document.getElementById('cart-modal')

    if (cartButton && cartModal) {
      cartButton.addEventListener('click', () => {
        cartModal.classList.add('active')
      })
    }

    if (closeCartButton && cartModal) {
      closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('active')
      })
    }

    // Botões de adicionar ao carrinho
    document.addEventListener('click', e => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const itemId = e.target.dataset.id
        this.addToCart(itemId)
      }
    })

    // Controles de slider
    this.setupSliders()

    // Accordion (FAQ)
    const accordionItems = document.querySelectorAll('.accordion-item')
    if (accordionItems.length > 0) {
      accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header')
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active')

          // Fechar todos os acordeons abertos
          accordionItems.forEach(i => i.classList.remove('active'))

          // Abrir o clicado se não estava aberto
          if (!isActive) {
            item.classList.add('active')
          }
        })
      })
    }

    // Botão de WhatsApp
    const whatsappButton = document.getElementById('whatsapp-button')
    if (whatsappButton) {
      whatsappButton.addEventListener('click', e => {
        e.preventDefault()
        const message = 'Olá! Gostaria de fazer um pedido.'
        const whatsappUrl = `https://wa.me/5511987654321?text=${encodeURIComponent(
          message
        )}`
        window.open(whatsappUrl, '_blank')
      })
    }

    // Menu mobile
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle')
    const mobileMenu = document.getElementById('mobile-menu')

    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active')
        mobileMenu.classList.toggle('active')
      })
    }
  }

  // Configurar sliders
  setupSliders() {
    // Slider de promoções
    const promoSlider = document.querySelector('.promocoes-slider')
    const promoPrev = document.getElementById('promo-prev')
    const promoNext = document.getElementById('promo-next')
    const promoDots = document.getElementById('promo-dots')

    if (promoSlider && promoPrev && promoNext) {
      let promoCurrentSlide = 0
      const promoSlides = promoSlider.querySelectorAll('.promocao-card')
      const promoTotalSlides = promoSlides.length

      // Função para mostrar um slide específico
      const showPromoSlide = index => {
        if (index < 0) index = promoTotalSlides - 1
        if (index >= promoTotalSlides) index = 0

        promoCurrentSlide = index

        // Em dispositivos móveis, mostra apenas um slide
        if (window.innerWidth < 768) {
          promoSlider.style.transform = `translateX(-${
            promoCurrentSlide * 100
          }%)`
          promoSlides.forEach((slide, i) => {
            slide.style.display = i === promoCurrentSlide ? 'block' : 'none'
          })
        }

        // Atualizar dots
        if (promoDots) {
          const dots = promoDots.querySelectorAll('.dot')
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === promoCurrentSlide)
          })
        }
      }

      // Configurar eventos dos botões
      promoPrev.addEventListener('click', () => {
        showPromoSlide(promoCurrentSlide - 1)
      })

      promoNext.addEventListener('click', () => {
        showPromoSlide(promoCurrentSlide + 1)
      })

      // Configurar dots se existirem
      if (promoDots) {
        const dots = promoDots.querySelectorAll('.dot')
        dots.forEach((dot, i) => {
          dot.addEventListener('click', () => {
            showPromoSlide(i)
          })
        })
      }

      // Inicializar o slider
      showPromoSlide(0)
    }

    // Slider de depoimentos (mesmo princípio)
    const testimonialSlider = document.querySelector('.testimonials-slider')
    const testimonialPrev = document.getElementById('testimonial-prev')
    const testimonialNext = document.getElementById('testimonial-next')
    const testimonialDots = document.getElementById('testimonial-dots')

    if (testimonialSlider && testimonialPrev && testimonialNext) {
      let testimonialCurrentSlide = 0
      const testimonialSlides =
        testimonialSlider.querySelectorAll('.testimonial-card')
      const testimonialTotalSlides = testimonialSlides.length

      const showTestimonialSlide = index => {
        if (index < 0) index = testimonialTotalSlides - 1
        if (index >= testimonialTotalSlides) index = 0

        testimonialCurrentSlide = index

        if (window.innerWidth < 768) {
          testimonialSlider.style.transform = `translateX(-${
            testimonialCurrentSlide * 100
          }%)`
          testimonialSlides.forEach((slide, i) => {
            slide.style.display =
              i === testimonialCurrentSlide ? 'block' : 'none'
          })
        }

        if (testimonialDots) {
          const dots = testimonialDots.querySelectorAll('.dot')
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === testimonialCurrentSlide)
          })
        }
      }

      testimonialPrev.addEventListener('click', () => {
        showTestimonialSlide(testimonialCurrentSlide - 1)
      })

      testimonialNext.addEventListener('click', () => {
        showTestimonialSlide(testimonialCurrentSlide + 1)
      })

      if (testimonialDots) {
        const dots = testimonialDots.querySelectorAll('.dot')
        dots.forEach((dot, i) => {
          dot.addEventListener('click', () => {
            showTestimonialSlide(i)
          })
        })
      }

      showTestimonialSlide(0)
    }
  }

  // Renderizar o menu na interface
  renderMenu() {
    const menuContainer = document.getElementById('menu-items')
    if (!menuContainer) return

    // Limpar o container
    menuContainer.innerHTML = ''

    // Filtrar os itens com base no filtro atual
    const filteredItems =
      this.currentFilter === 'all'
        ? this.menuItems
        : this.menuItems.filter(item => item.category === this.currentFilter)

    // Renderizar cada item
    filteredItems.forEach(item => {
      const menuItem = document.createElement('div')
      menuItem.className = 'menu-item'
      menuItem.innerHTML = `
        <div class="menu-item-image">
          <img src="${item.image}" alt="${item.name}">
          ${item.featured ? '<div class="menu-item-badge">Destaque</div>' : ''}
        </div>
        <div class="menu-item-content">
          <div class="menu-item-title">
            <h3>${item.name}</h3>
            <div class="menu-item-price">R$ ${item.price.toFixed(2)}</div>
          </div>
          <p class="menu-item-description">${item.description}</p>
          <div class="menu-item-footer">
            <div class="menu-item-rating">
              <i class="fas fa-star"></i>
              <span>${item.rating.toFixed(1)}</span>
            </div>
            <button class="btn btn-primary add-to-cart-btn" data-id="${
              item.id
            }">Adicionar</button>
          </div>
        </div>
      `

      menuContainer.appendChild(menuItem)
    })
  }

  // Filtrar o menu por categoria
  filterMenu(filter) {
    this.currentFilter = filter
    this.renderMenu()
  }

  // Adicionar item ao carrinho
  addToCart(itemId) {
    const item = this.menuItems.find(item => item.id === itemId)

    if (!item) {
      logger.error(`Item com ID ${itemId} não encontrado`)
      return
    }

    // Verificar se o item já está no carrinho
    const existingItem = this.cart.find(cartItem => cartItem.id === itemId)

    if (existingItem) {
      // Incrementar a quantidade
      existingItem.quantity += 1
    } else {
      // Adicionar novo item ao carrinho
      this.cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      })
    }

    // Salvar o carrinho no armazenamento local
    this.saveCart()

    // Atualizar a interface do carrinho
    this.updateCartUI()

    // Mostrar feedback para o usuário
    this.showToast(`${item.name} adicionado ao carrinho!`)
  }

  // Remover item do carrinho
  removeFromCart(itemId) {
    const itemIndex = this.cart.findIndex(item => item.id === itemId)

    if (itemIndex !== -1) {
      this.cart.splice(itemIndex, 1)

      // Salvar alterações
      this.saveCart()

      // Atualizar a interface do carrinho
      this.updateCartUI()
    }
  }

  // Atualizar quantidade de um item no carrinho
  updateCartItemQuantity(itemId, newQuantity) {
    const item = this.cart.find(item => item.id === itemId)

    if (item) {
      if (newQuantity > 0) {
        item.quantity = newQuantity
      } else {
        // Se a quantidade for 0 ou negativa, remover o item
        this.removeFromCart(itemId)
        return
      }

      // Salvar alterações
      this.saveCart()

      // Atualizar a interface do carrinho
      this.updateCartUI()
    }
  }

  // Esvaziar o carrinho
  clearCart() {
    this.cart = []
    this.saveCart()
    this.updateCartUI()
  }

  // Calcular o total do carrinho
  calculateCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  // Atualizar a interface do carrinho
  updateCartUI() {
    // Atualizar o contador do carrinho
    const cartCount = document.querySelector('.cart-count')
    if (cartCount) {
      const totalItems = this.cart.reduce(
        (count, item) => count + item.quantity,
        0
      )
      cartCount.textContent = totalItems
    }

    // Atualizar os itens do carrinho
    const cartItemsContainer = document.getElementById('cart-items')
    const cartTotalElement = document.getElementById('cart-total-price')
    const checkoutButton = document.querySelector('.btn-checkout')

    if (cartItemsContainer) {
      // Se o carrinho estiver vazio
      if (this.cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Seu carrinho está vazio</p>
          </div>
        `

        if (checkoutButton) {
          checkoutButton.disabled = true
        }
      } else {
        // Carrinho com itens
        cartItemsContainer.innerHTML = ''

        this.cart.forEach(item => {
          const cartItem = document.createElement('div')
          cartItem.className = 'cart-item'
          cartItem.innerHTML = `
            <div class="cart-item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-content">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-details">
                <span>R$ ${item.price.toFixed(2)} × ${item.quantity}</span>
                <span class="cart-item-price">R$ ${(
                  item.price * item.quantity
                ).toFixed(2)}</span>
              </div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-quantity">
                <button class="quantity-btn decrease-quantity" data-id="${
                  item.id
                }">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-id="${
                  item.id
                }">+</button>
              </div>
              <button class="remove-item-btn" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          `

          cartItemsContainer.appendChild(cartItem)
        })

        // Adicionar botão "Continuar Comprando" para fechar o carrinho sem recarregar
        const continuarComprandoBtn = document.createElement('div')
        continuarComprandoBtn.className = 'continue-shopping-btn'
        continuarComprandoBtn.innerHTML = `
          <button class="btn btn-outline btn-block" id="continue-shopping">
            <i class="fas fa-arrow-left"></i> Continuar Comprando
          </button>
        `
        cartItemsContainer.appendChild(continuarComprandoBtn)

        // Adicionar evento ao botão
        setTimeout(() => {
          const continueBtn = document.getElementById('continue-shopping')
          if (continueBtn) {
            continueBtn.addEventListener('click', () => {
              const cartModal = document.getElementById('cart-modal')
              if (cartModal) {
                cartModal.classList.remove('active')
              }
            })
          }
        }, 0)

        // Adicionar listeners para os botões de quantidade e remover
        document.querySelectorAll('.decrease-quantity').forEach(btn => {
          btn.addEventListener('click', () => {
            const itemId = btn.dataset.id
            const item = this.cart.find(cartItem => cartItem.id === itemId)
            if (item) {
              this.updateCartItemQuantity(itemId, item.quantity - 1)
            }
          })
        })

        document.querySelectorAll('.increase-quantity').forEach(btn => {
          btn.addEventListener('click', () => {
            const itemId = btn.dataset.id
            const item = this.cart.find(cartItem => cartItem.id === itemId)
            if (item) {
              this.updateCartItemQuantity(itemId, item.quantity + 1)
            }
          })
        })

        document.querySelectorAll('.remove-item-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const itemId = btn.dataset.id
            this.removeFromCart(itemId)
          })
        })

        if (checkoutButton) {
          checkoutButton.disabled = false
        }
      }
    }

    // Atualizar o valor total
    if (cartTotalElement) {
      const total = this.calculateCartTotal()
      cartTotalElement.textContent = `R$ ${total.toFixed(2)}`
    }
  }

  // Exibir notificação toast
  showToast(message) {
    // Criar elemento toast se não existir
    let toastContainer = document.querySelector('.toast-container')

    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.className = 'toast-container'
      document.body.appendChild(toastContainer)
    }

    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.textContent = message

    toastContainer.appendChild(toast)

    // Adicionar classe para animação
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)

    // Remover após alguns segundos
    setTimeout(() => {
      toast.classList.remove('show')

      setTimeout(() => {
        toastContainer.removeChild(toast)

        // Remover o container se não houver mais toasts
        if (toastContainer.children.length === 0) {
          document.body.removeChild(toastContainer)
        }
      }, 300)
    }, 3000)
  }

  // Salvar carrinho no storage local
  saveCart() {
    storage.set('burgerhouse_cart', this.cart)
  }

  // Carregar carrinho do storage local
  loadCart() {
    const savedCart = storage.get('burgerhouse_cart')
    if (savedCart) {
      this.cart = savedCart
    }
  }

  // Processar checkout (simulação)
  processCheckout() {
    // Aqui seria integrado com um gateway de pagamento real
    // Por enquanto, apenas simulamos o processo

    if (this.cart.length === 0) {
      this.showToast('Seu carrinho está vazio!')
      return
    }

    // Mostrar modal de finalização (poderia ser uma página de checkout)
    const checkoutInfo = {
      items: this.cart,
      total: this.calculateCartTotal(),
      date: new Date().toLocaleString()
    }

    console.log('Checkout info:', checkoutInfo)

    // Limpar o carrinho após o checkout bem-sucedido
    this.clearCart()

    // Fechar o modal do carrinho
    const cartModal = document.getElementById('cart-modal')
    if (cartModal) {
      cartModal.classList.remove('active')
    }

    // Mostrar feedback de sucesso
    this.showToast(
      'Pedido realizado com sucesso! Em breve entraremos em contato.'
    )
  }
}

// Inicializar a aplicação
const app = new App()

// Exportar a instância da aplicação para acesso global
window.burgerHouseApp = app

export default app
