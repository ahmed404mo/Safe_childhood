class ResponsiveChildSafetyWebsite {
  constructor() {
    this.currentSection = "home"
    this.isAIOpen = false
    this.isAITyping = false
    this.currentTheme = "blue"
    this.gameScore = 0
    this.currentColor = ""
    this.gameTimer = 30
    this.gameInterval = null
    this.activeCategory = "all"

    this.init()
  }

  init() {
    this.hideLoadingScreen()
    this.setupEventListeners()
    this.setupContentLibrary()
    this.setupThemes()
    this.loadSavedTheme()
    this.showSection("home")
    this.setupScrollAnimations()
    this.setupResponsiveHandlers()
    this.setupGame()
    this.setupAccessibility()
  }

  hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loadingScreen")
      if (loadingScreen) {
        loadingScreen.classList.add("hidden")
      }
    }, 2000)
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll("[data-section]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const section = e.currentTarget.getAttribute("data-section")
        this.showSection(section)
      })

      // Keyboard navigation
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          const section = e.currentTarget.getAttribute("data-section")
          this.showSection(section)
        }
      })
    })

    // Mobile menu
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const navClose = document.getElementById("navClose")
    const navOverlay = document.getElementById("navOverlay")

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        this.toggleMobileMenu()
      })
    }

    if (navClose) {
      navClose.addEventListener("click", () => {
        this.closeMobileMenu()
      })
    }

    if (navOverlay) {
      navOverlay.addEventListener("click", () => {
        this.closeMobileMenu()
      })
    }

    // AI Assistant buttons
    const aiButtons = [
      document.getElementById("aiAssistantBtn"),
      document.getElementById("mobileAiBtn"),
      document.getElementById("heroAiBtn"),
      document.getElementById("aiFeatureCard"),
    ]

    aiButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          this.toggleAI()
        })
      }
    })

    const aiClose = document.getElementById("aiClose")
    const aiSend = document.getElementById("aiSend")
    const aiInput = document.getElementById("aiInput")

    if (aiClose) {
      aiClose.addEventListener("click", () => {
        this.toggleAI()
      })
    }

    if (aiSend) {
      aiSend.addEventListener("click", () => {
        this.sendAIMessage()
      })
    }

    if (aiInput) {
      aiInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendAIMessage()
        }
      })

      // Auto-resize textarea
      aiInput.addEventListener("input", () => {
        aiInput.style.height = "auto"
        aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + "px"
      })
    }

    // AI Suggestions
    document.querySelectorAll(".suggestion-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const message = e.currentTarget.getAttribute("data-message")
        const input = document.getElementById("aiInput")
        if (input) {
          input.value = message
          this.sendAIMessage()
        }
      })
    })

    // Theme toggle
    const themeToggle = document.getElementById("themeToggle")
    const themeClose = document.getElementById("themeClose")

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleThemeModal()
      })
    }

    if (themeClose) {
      themeClose.addEventListener("click", () => {
        this.toggleThemeModal()
      })
    }

    // Theme options
    document.querySelectorAll(".theme-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        const theme = e.currentTarget.getAttribute("data-theme")
        this.applyTheme(theme)
        this.toggleThemeModal()
      })
    })

    // Game controls
    const startMainGame = document.getElementById("startMainGame")
    const closeGame = document.getElementById("closeGame")

    if (startMainGame) {
      startMainGame.addEventListener("click", () => {
        this.startGame()
      })
    }

    if (closeGame) {
      closeGame.addEventListener("click", () => {
        this.closeGame()
      })
    }

    // Color buttons
    document.querySelectorAll(".color-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const color = e.currentTarget.getAttribute("data-color")
        this.checkAnswer(color)
      })
    })

    // Category tabs
    document.querySelectorAll(".category-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const category = e.currentTarget.getAttribute("data-category")
        this.filterContent(category)
      })
    })

    // Escape key handlers
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.isAIOpen) {
          this.toggleAI()
        }
        if (document.getElementById("themeModal").classList.contains("active")) {
          this.toggleThemeModal()
        }
        if (document.getElementById("mainNav").classList.contains("active")) {
          this.closeMobileMenu()
        }
      }
    })

    // Window resize handler
    window.addEventListener("resize", () => {
      this.handleResize()
    })

    // Scroll handler for animations
    window.addEventListener("scroll", () => {
      this.handleScroll()
    })
  }

  showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("active")
    })

    // Show target section
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
      targetSection.classList.add("active")
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Update navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active")
      btn.setAttribute("aria-current", "false")
    })

    document.querySelectorAll(`[data-section="${sectionId}"]`).forEach((btn) => {
      if (btn.classList.contains("nav-btn")) {
        btn.classList.add("active")
        btn.setAttribute("aria-current", "page")
      }
    })

    this.currentSection = sectionId
    this.closeMobileMenu()
    this.showNotification(`تم الانتقال إلى ${this.getSectionName(sectionId)}`, "info")
  }

  getSectionName(sectionId) {
    const names = {
      home: "الرئيسية",
      library: "المكتبة",
      stories: "القصص",
      games: "الألعاب",
      videos: "الفيديوهات",
      contact: "تواصل معنا",
    }
    return names[sectionId] || sectionId
  }

  toggleMobileMenu() {
    const nav = document.getElementById("mainNav")
    const menuBtn = document.getElementById("mobileMenuBtn")

    if (nav && menuBtn) {
      const isActive = nav.classList.contains("active")

      if (isActive) {
        this.closeMobileMenu()
      } else {
        nav.classList.add("active")
        menuBtn.classList.add("active")
        menuBtn.setAttribute("aria-expanded", "true")
        document.body.style.overflow = "hidden"
      }
    }
  }

  closeMobileMenu() {
    const nav = document.getElementById("mainNav")
    const menuBtn = document.getElementById("mobileMenuBtn")

    if (nav && menuBtn) {
      nav.classList.remove("active")
      menuBtn.classList.remove("active")
      menuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  }

  toggleAI() {
    const aiModal = document.getElementById("aiModal")
    if (aiModal) {
      this.isAIOpen = !this.isAIOpen

      if (this.isAIOpen) {
        aiModal.classList.add("active")
        document.body.style.overflow = "hidden"

        // Focus on input
        setTimeout(() => {
          const input = document.getElementById("aiInput")
          if (input) input.focus()
        }, 300)

        this.updateAIStatus("متصل")
      } else {
        aiModal.classList.remove("active")
        document.body.style.overflow = ""
        this.updateAIStatus("غير متصل")
      }
    }
  }

  updateAIStatus(status) {
    const statusElement = document.getElementById("aiStatus")
    if (statusElement) {
      statusElement.textContent = status
    }
  }

  sendAIMessage() {
    const input = document.getElementById("aiInput")
    const messagesContainer = document.getElementById("aiMessages")
    const sendBtn = document.getElementById("aiSend")

    if (!input || !messagesContainer || !input.value.trim()) return

    const message = input.value.trim()

    // Add user message
    this.addAIMessage(message, "user")

    // Clear input and disable send button
    input.value = ""
    input.style.height = "auto"
    sendBtn.disabled = true

    // Show typing indicator
    this.showAITyping()

    // Simulate AI response
    setTimeout(
      () => {
        this.hideAITyping()
        const response = this.getAIResponse(message)
        this.addAIMessage(response, "assistant")
        sendBtn.disabled = false
      },
      1500 + Math.random() * 1000,
    )
  }

  addAIMessage(content, sender) {
    const messagesContainer = document.getElementById("aiMessages")
    if (!messagesContainer) return

    const messageDiv = document.createElement("div")
    messageDiv.className = `ai-message ${sender}`

    const time = new Date().toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    })

    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${sender === "user" ? "user" : "robot"}"></i>
      </div>
      <div class="message-content">
        <p>${content.replace(/\n/g, "</p><p>")}</p>
        <div class="message-time">${time}</div>
      </div>
    `

    // Remove suggestions if they exist
    const suggestions = messagesContainer.querySelector(".ai-suggestions")
    if (suggestions && sender === "user") {
      suggestions.remove()
    }

    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  showAITyping() {
    const typingElement = document.getElementById("aiTyping")
    if (typingElement) {
      typingElement.classList.add("active")
      this.isAITyping = true
      this.updateAIStatus("يكتب...")
    }
  }

  hideAITyping() {
    const typingElement = document.getElementById("aiTyping")
    if (typingElement) {
      typingElement.classList.remove("active")
      this.isAITyping = false
      this.updateAIStatus("متصل")
    }
  }

  getAIResponse(message) {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("إنترنت") || lowerMessage.includes("رقمي") || lowerMessage.includes("حماية")) {
      return `🔒 **دليل الأمان الرقمي:**

• استخدم تطبيقات الرقابة الأبوية المناسبة
• فعّل البحث الآمن في محركات البحث
• علّم طفلك عدم مشاركة المعلومات الشخصية
• ضع الكمبيوتر في مكان مفتوح ومرئي
• راقب الأنشطة الرقمية بانتظام
• تحدث مع طفلك عن المخاطر الرقمية`
    } else if (lowerMessage.includes("تنمر") || lowerMessage.includes("مضايقة")) {
      return `🚨 **التعامل مع التنمر:**

• استمع لطفلك دون إصدار أحكام
• وثّق جميع الأدلة والمحادثات
• تواصل مع إدارة المدرسة فوراً
• اطلب المساعدة المهنية إذا لزم الأمر
• علّم طفلك كيفية الرد على التنمر
• عزز ثقة طفلك بنفسه`
    } else if (lowerMessage.includes("طوارئ") || lowerMessage.includes("مساعدة")) {
      return `🆘 **أرقام الطوارئ المهمة:**

• خط نجدة الطفل: 16000
• الطوارئ العامة: 122
• الشرطة: 122
• الإسعاف: 123

**في حالة الخطر الفوري:**
• اتصل بالطوارئ فوراً
• ابق هادئاً وواضحاً
• اذكر موقعك بدقة
• لا تترك الطفل وحده`
    } else if (lowerMessage.includes("تعليم") || lowerMessage.includes("تربية")) {
      return `📚 **نصائح تربوية مهمة:**

• كن قدوة إيجابية لطفلك
• استخدم التعزيز الإيجابي
• ضع حدود واضحة ومعقولة
• اقضِ وقتاً جودة مع طفلك
• استمع لمشاعر طفلك واحترمها
• علّم طفلك المهارات الحياتية`
    } else {
      return `شكراً على سؤالك! 🌟

يمكنني مساعدتك في:
• الأمان الرقمي وحماية الأطفال
• التعامل مع التنمر والمضايقات
• نصائح التربية والتعليم
• أرقام الطوارئ والمساعدة
• إرشادات الأمان العامة

اكتب سؤالك بوضوح وسأقدم لك المساعدة المناسبة!`
    }
  }

  toggleThemeModal() {
    const themeModal = document.getElementById("themeModal")
    if (themeModal) {
      const isActive = themeModal.classList.contains("active")

      if (isActive) {
        themeModal.classList.remove("active")
        document.body.style.overflow = ""
      } else {
        themeModal.classList.add("active")
        document.body.style.overflow = "hidden"
      }
    }
  }

  setupThemes() {
    this.themes = {
      blue: { primary: "#3b82f6", secondary: "#10b981", accent: "#f59e0b" },
      green: { primary: "#10b981", secondary: "#8b5cf6", accent: "#f97316" },
      purple: { primary: "#8b5cf6", secondary: "#06b6d4", accent: "#ef4444" },
      pink: { primary: "#ec4899", secondary: "#84cc16", accent: "#f59e0b" },
      orange: { primary: "#f97316", secondary: "#0ea5e9", accent: "#22c55e" },
    }
  }

  applyTheme(themeName) {
    if (!this.themes[themeName]) return

    const theme = this.themes[themeName]
    const root = document.documentElement

    root.style.setProperty("--primary-color", theme.primary)
    root.style.setProperty("--secondary-color", theme.secondary)
    root.style.setProperty("--accent-color", theme.accent)

    // Update theme options
    document.querySelectorAll(".theme-option").forEach((option) => {
      option.classList.remove("active")
    })

    const activeOption = document.querySelector(`[data-theme="${themeName}"]`)
    if (activeOption) {
      activeOption.classList.add("active")
    }

    this.currentTheme = themeName
    this.saveTheme(themeName)
    this.showNotification(`تم تطبيق اللون ${this.getThemeName(themeName)}`, "success")
  }

  getThemeName(theme) {
    const names = {
      blue: "الأزرق",
      green: "الأخضر",
      purple: "البنفسجي",
      pink: "الوردي",
      orange: "البرتقالي",
    }
    return names[theme] || theme
  }

  saveTheme(theme) {
    try {
      localStorage.setItem("childSafetyTheme", theme)
    } catch (e) {
      console.warn("Could not save theme to localStorage")
    }
  }

  loadSavedTheme() {
    try {
      const savedTheme = localStorage.getItem("childSafetyTheme")
      if (savedTheme && this.themes[savedTheme]) {
        this.applyTheme(savedTheme)
      }
    } catch (e) {
      console.warn("Could not load theme from localStorage")
    }
  }

  setupContentLibrary() {
    this.contentItems = [
      { id: 1, title: "قصة الأمان الرقمي", category: "stories", icon: "book-heart" },
      { id: 2, title: "لعبة الألوان", category: "games", icon: "puzzle-piece" },
      { id: 3, title: "فيديو الأرقام", category: "videos", icon: "play-circle" },
      { id: 4, title: "قصة النجوم", category: "stories", icon: "star" },
      { id: 5, title: "لعبة الذاكرة", category: "games", icon: "brain" },
      { id: 6, title: "أغاني تعليمية", category: "videos", icon: "music" },
    ]
  }

  filterContent(category) {
    // Update active tab
    document.querySelectorAll(".category-tab").forEach((tab) => {
      tab.classList.remove("active")
      tab.setAttribute("aria-selected", "false")
    })

    const activeTab = document.querySelector(`[data-category="${category}"]`)
    if (activeTab) {
      activeTab.classList.add("active")
      activeTab.setAttribute("aria-selected", "true")
    }

    // Filter content items
    const contentItems = document.querySelectorAll(".content-item")
    contentItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category")

      if (category === "all" || itemCategory === category) {
        item.style.display = "block"
        item.classList.add("fade-in")
      } else {
        item.style.display = "none"
        item.classList.remove("fade-in")
      }
    })

    this.activeCategory = category
    this.showNotification(`تم تصفية المحتوى: ${this.getCategoryName(category)}`, "info")
  }

  getCategoryName(category) {
    const names = {
      all: "جميع المحتويات",
      stories: "القصص",
      games: "الألعاب",
      videos: "الفيديوهات",
    }
    return names[category] || category
  }

  setupGame() {
    this.colors = ["أحمر", "أزرق", "أخضر", "أصفر"]
    this.gameScore = 0
    this.gameTimer = 30
  }

  startGame() {
    const gameContainer = document.getElementById("gameContainer")
    if (gameContainer) {
      gameContainer.classList.add("active")
      this.resetGame()
      this.startNewRound()
      this.startGameTimer()
      this.showNotification("بدأت اللعبة! حظاً سعيداً", "success")
    }
  }

  closeGame() {
    const gameContainer = document.getElementById("gameContainer")
    if (gameContainer) {
      gameContainer.classList.remove("active")
      this.stopGameTimer()
      this.showNotification(`انتهت اللعبة! نقاطك النهائية: ${this.gameScore}`, "info")
    }
  }

  resetGame() {
    this.gameScore = 0
    this.gameTimer = 30
    this.updateGameScore()
    this.updateGameTimer()

    const feedback = document.getElementById("gameFeedback")
    if (feedback) {
      feedback.textContent = ""
    }
  }

  startNewRound() {
    this.currentColor = this.colors[Math.floor(Math.random() * this.colors.length)]
    const instruction = document.getElementById("game-instruction")
    if (instruction) {
      instruction.textContent = `اختر اللون: ${this.currentColor}`
    }
  }

  checkAnswer(selectedColor) {
    const feedback = document.getElementById("gameFeedback")

    if (selectedColor === this.currentColor) {
      this.gameScore += 10
      if (feedback) {
        feedback.textContent = "🎉 إجابة صحيحة! +10 نقاط"
        feedback.style.color = "var(--success-color)"
      }
    } else {
      if (feedback) {
        feedback.textContent = `❌ إجابة خاطئة! الإجابة الصحيحة: ${this.currentColor}`
        feedback.style.color = "var(--danger-color)"
      }
    }

    this.updateGameScore()

    setTimeout(() => {
      this.startNewRound()
      if (feedback) {
        feedback.textContent = ""
      }
    }, 1500)
  }

  startGameTimer() {
    this.gameInterval = setInterval(() => {
      this.gameTimer--
      this.updateGameTimer()

      if (this.gameTimer <= 0) {
        this.endGame()
      }
    }, 1000)
  }

  stopGameTimer() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
      this.gameInterval = null
    }
  }

  updateGameScore() {
    const scoreElement = document.getElementById("gameScore")
    if (scoreElement) {
      scoreElement.textContent = this.gameScore
    }
  }

  updateGameTimer() {
    const timerElement = document.getElementById("gameTimer")
    if (timerElement) {
      timerElement.textContent = this.gameTimer

      // Change color when time is running out
      if (this.gameTimer <= 10) {
        timerElement.parentElement.style.background = "var(--danger-color)"
      } else {
        timerElement.parentElement.style.background = "var(--warning-color)"
      }
    }
  }

  endGame() {
    this.stopGameTimer()
    const feedback = document.getElementById("gameFeedback")
    if (feedback) {
      feedback.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <h3>🎮 انتهت اللعبة!</h3>
          <p>نقاطك النهائية: <strong>${this.gameScore}</strong></p>
          <p>${this.getScoreMessage()}</p>
        </div>
      `
      feedback.style.color = "var(--primary-color)"
    }

    setTimeout(() => {
      this.closeGame()
    }, 3000)
  }

  getScoreMessage() {
    if (this.gameScore >= 100) {
      return "🏆 ممتاز! أداء رائع!"
    } else if (this.gameScore >= 50) {
      return "👏 جيد جداً! استمر في التحسن!"
    } else if (this.gameScore >= 20) {
      return "👍 جيد! يمكنك تحسين أدائ��!"
    } else {
      return "💪 لا بأس! حاول مرة أخرى!"
    }
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in")
        }
      })
    }, observerOptions)

    // Observe elements for animation
    document
      .querySelectorAll(".feature-card, .content-item, .story-card, .game-card, .video-card, .contact-card")
      .forEach((el) => {
        observer.observe(el)
      })
  }

  setupResponsiveHandlers() {
    // Handle responsive breakpoints
    this.checkScreenSize()

    // Handle orientation change
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.handleResize()
      }, 100)
    })
  }

  handleResize() {
    this.checkScreenSize()

    // Close mobile menu on desktop
    if (window.innerWidth >= 1024) {
      this.closeMobileMenu()
    }

    // Adjust AI modal on mobile
    const aiModal = document.getElementById("aiModal")
    if (aiModal && window.innerWidth <= 768) {
      const aiContainer = aiModal.querySelector(".ai-container")
      if (aiContainer) {
        aiContainer.style.width = "100%"
        aiContainer.style.height = "100%"
        aiContainer.style.borderRadius = "0"
      }
    }
  }

  checkScreenSize() {
    const isMobile = window.innerWidth <= 768
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024
    const isDesktop = window.innerWidth > 1024

    document.body.classList.toggle("mobile", isMobile)
    document.body.classList.toggle("tablet", isTablet)
    document.body.classList.toggle("desktop", isDesktop)
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Add shadow to header on scroll
    const header = document.querySelector(".header")
    if (header) {
      if (scrollTop > 10) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }

    // Parallax effect for hero cards
    const heroCards = document.querySelectorAll(".hero-card")
    heroCards.forEach((card, index) => {
      const speed = 0.5 + index * 0.1
      const yPos = -(scrollTop * speed)
      card.style.transform = `translateY(${yPos}px)`
    })
  }

  setupAccessibility() {
    // Keyboard navigation for cards
    document.querySelectorAll(".feature-card, .content-item, .story-card, .game-card, .video-card").forEach((card) => {
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          card.click()
        }
      })
    })

    // Focus management for modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        this.handleTabNavigation(e)
      }
    })

    // Announce section changes to screen readers
    const sections = document.querySelectorAll(".section")
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionTitle = entry.target.querySelector("h1, h2")
            if (sectionTitle) {
              this.announceToScreenReader(`تم الانتقال إلى قسم ${sectionTitle.textContent}`)
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => {
      sectionObserver.observe(section)
    })
  }

  handleTabNavigation(e) {
    // Trap focus in modals
    if (this.isAIOpen) {
      const aiModal = document.getElementById("aiModal")
      const focusableElements = aiModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  showNotification(message, type = "info") {
    const container = document.getElementById("notificationContainer")
    if (!container) return

    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    notification.setAttribute("role", "alert")
    notification.setAttribute("aria-live", "assertive")

    container.appendChild(notification)

    // Trigger animation
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Auto remove
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (container.contains(notification)) {
          container.removeChild(notification)
        }
      }, 300)
    }, 4000)
  }

  // Public methods for external access
  navigateToSection(section) {
    this.showSection(section)
  }

  openAI() {
    if (!this.isAIOpen) {
      this.toggleAI()
    }
  }

  changeTheme(theme) {
    this.applyTheme(theme)
  }
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.childSafetyWebsite = new ResponsiveChildSafetyWebsite()
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause any running timers or animations
    if (window.childSafetyWebsite && window.childSafetyWebsite.gameInterval) {
      window.childSafetyWebsite.stopGameTimer()
    }
  } else {
    // Resume if needed
    console.log("Page is now visible")
  }
})

// Service Worker registration for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ResponsiveChildSafetyWebsite
}
