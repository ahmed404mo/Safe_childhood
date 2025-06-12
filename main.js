// Website functionality
class ChildrenSafetyWebsite {
    constructor() {
        this.currentSection = "home"
        this.init()
    }

    init() {
        this.setupEventListeners()
        this.setupColorThemes() // يجب أن تأتي أولاً
        this.loadSavedTheme() // ثم تحميل الثيم المحفوظ
        this.showSection("home")
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll("[data-section]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const section = e.currentTarget.getAttribute("data-section")
                this.showSection(section)
            })
        })

        // Settings button (الزر العادي)
        document.getElementById("settingsBtn").addEventListener("click", () => {
            this.toggleColorModal()
        })

        // Mobile color button (الزر في القائمة المحمولة)
        document.getElementById("mobileColorBtn").addEventListener("click", () => {
            this.toggleColorModal()
            // إغلاق القائمة المحمولة بعد اختيار الألوان
            if (window.innerWidth <= 768) {
                this.closeMobileMenu()
            }
        })

        // Mobile menu button
        document.getElementById("mobileMenuBtn").addEventListener("click", () => {
            this.toggleMobileMenu()
        })

        // Mobile close button
        document.getElementById("mobileCloseBtn").addEventListener("click", () => {
            this.closeMobileMenu()
        })

        // Close mobile menu when clicking on overlay
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("mobile-nav-overlay")) {
                this.closeMobileMenu()
            }
        })

        // Close mobile menu when clicking on nav items
        document.querySelectorAll(".nav-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (window.innerWidth <= 575) {
                    this.closeMobileMenu()
                }
            })
        })

        // Modal close button
        document.getElementById("closeModal").addEventListener("click", () => {
            this.toggleColorModal()
        })

        // Close modal when clicking outside
        document.getElementById("colorModal").addEventListener("click", (e) => {
            if (e.target === e.currentTarget) {
                this.toggleColorModal()
            }
        })

        // Game start button
        document.getElementById("startGameBtn").addEventListener("click", () => {
            this.toggleGameContainer()
        })

        // Video play buttons
        document.querySelectorAll(".play-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault()
                this.playVideo(e.currentTarget)
            })
        })

        // Color theme selection
        document.querySelectorAll(".theme-option").forEach((option) => {
            option.addEventListener("click", (e) => {
                const theme = e.currentTarget.getAttribute("data-theme")
                this.applyColorTheme(theme)
            })
        })

        // Footer links navigation
        document.querySelectorAll(".footer-links [data-section]").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault()
                const section = e.currentTarget.getAttribute("data-section")
                this.showSection(section)
            })
        })

        // Emergency and helpline calls
        document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
            link.addEventListener("click", (e) => {
                const phoneNumber = e.currentTarget.getAttribute("href").replace("tel:", "")
                this.showCallConfirmation(phoneNumber)
            })
        })

        // Smooth scroll for anchor links
        document.addEventListener("click", (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault()
                const target = document.querySelector(e.target.getAttribute("href"))
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                }
            }
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
        }

        // Update navigation
        document.querySelectorAll(".nav-btn").forEach((btn) => {
            btn.classList.remove("active")
        })

        const activeNavBtn = document.querySelector(`[data-section="${sectionId}"]`)
        if (activeNavBtn && activeNavBtn.classList.contains("nav-btn")) {
            activeNavBtn.classList.add("active")
        }

        this.currentSection = sectionId

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    toggleColorModal() {
        const modal = document.getElementById("colorModal")
        modal.classList.toggle("active")
    }

    toggleGameContainer() {
        const gameContainer = document.getElementById("gameContainer")
        gameContainer.classList.toggle("active")

        if (gameContainer.classList.contains("active")) {
            // Here you can initialize your custom game
            this.initializeGame()
        }
    }

    initializeGame() {
        // Placeholder for game initialization
        const gameContainer = document.getElementById("gameContainer")
        gameContainer.innerHTML = `
              <div class="game-placeholder">
                  <h3>مساحة اللعبة</h3>
                  <p>هنا يمكنك إضافة كود لعبتك المخصصة</p>
                  <p>يمكنك استخدام HTML5 Canvas, WebGL, أو أي مكتبة ألعاب تفضلها</p>
                  <div style="margin-top: 2rem;">
                      <button class="btn btn-primary" onclick="alert('يمكنك البدء في تطوير اللعبة هنا!')">
                          <i class="fas fa-code"></i>
                          ابدأ التطوير
                      </button>
                      <button class="btn btn-secondary" onclick="document.getElementById('gameContainer').classList.remove('active')">
                          <i class="fas fa-times"></i>
                          إغلاق
                      </button>
                  </div>
              </div>
          `
    }

    playVideo(button) {
        const videoPlayer = document.getElementById("videoPlayer")
        videoPlayer.classList.add("active")

        // Scroll to video player
        videoPlayer.scrollIntoView({
            behavior: "smooth",
        })

        // Here you can add your video URLs and embed code
        this.loadVideo(button)
    }

    loadVideo(button) {
        const videoCard = button.closest(".video-card")
        const videoTitle = videoCard.querySelector("h3").textContent

        const videoPlayer = document.getElementById("videoPlayer")
        videoPlayer.innerHTML = `
              <div class="video-placeholder">
                  <h3>مشغل الفيديو</h3>
                  <p>عنوان الفيديو: ${videoTitle}</p>
                  <p>هنا يمكنك إضافة روابط الفيديوهات أو كود التشغيل</p>
                  <p>يمكنك استخدام YouTube embed, Vimeo, أو أي خدمة فيديو أخرى</p>
                  <div style="margin-top: 2rem;">
                      <button class="btn btn-secondary" onclick="this.closest('.video-player').classList.remove('active')">
                          <i class="fas fa-arrow-right"></i>
                          إغلاق المشغل
                      </button>
                  </div>
              </div>
          `
    }

    showCallConfirmation(phoneNumber) {
        const confirmation = confirm(`هل تريد الاتصال بالرقم ${phoneNumber}؟`)
        if (!confirmation) {
            event.preventDefault()
        }
    }

    setupColorThemes() {
        this.colorThemes = {
            blue: {
                primary: "#3B82F6",
                secondary: "#10B981",
                accent: "#F59E0B",
                isDark: false,
            },
            green: {
                primary: "#059669",
                secondary: "#8B5CF6",
                accent: "#F97316",
                isDark: false,
            },
            purple: {
                primary: "#7C3AED",
                secondary: "#06B6D4",
                accent: "#EF4444",
                isDark: false,
            },
            pink: {
                primary: "#EC4899",
                secondary: "#84CC16",
                accent: "#F59E0B",
                isDark: false,
            },
            orange: {
                primary: "#EA580C",
                secondary: "#0EA5E9",
                accent: "#22C55E",
                isDark: false,
            },
            dark: {
                primary: "#6366F1",
                secondary: "#10B981",
                accent: "#F59E0B",
                isDark: true,
            },
        }
    }

    applyColorTheme(themeName) {
        const theme = this.colorThemes[themeName]
        if (!theme) return

        const root = document.documentElement
        const body = document.body

        // تطبيق الألوان الرئيسية
        root.style.setProperty("--primary-color", theme.primary)
        root.style.setProperty("--secondary-color", theme.secondary)
        root.style.setProperty("--accent-color", theme.accent)

        // تطبيق الوضع المظلم أو الفاتح
        if (theme.isDark) {
            body.classList.add("dark-mode")
            root.style.setProperty("--text-dark", "#f9fafb")
            root.style.setProperty("--text-light", "#d1d5db")
            root.style.setProperty("--bg-light", "#1f2937")
            root.style.setProperty("--white", "#374151")
            root.style.setProperty("--border-light", "#4b5563")
        } else {
            body.classList.remove("dark-mode")
            root.style.setProperty("--text-dark", "#1f2937")
            root.style.setProperty("--text-light", "#6b7280")
            root.style.setProperty("--bg-light", "#f9fafb")
            root.style.setProperty("--white", "#ffffff")
            root.style.setProperty("--border-light", "#e5e7eb")
        }

        // حفظ تفضيل الثيم
        localStorage.setItem("selectedTheme", themeName)

        // إظهار رسالة نجاح
        this.showThemeChangeMessage(themeName)

        // إغلاق النافذة المنبثقة بعد فترة قصيرة
        setTimeout(() => {
            this.toggleColorModal()
        }, 1000)
    }

    showThemeChangeMessage(themeName) {
        const themeNames = {
            blue: "الأزرق الكلاسيكي",
            green: "الأخضر الطبيعي",
            purple: "البنفسجي المرح",
            pink: "الوردي الناعم",
            orange: "البرتقالي المشرق",
            dark: "الوضع المظلم",
        }

        // Create temporary message
        const message = document.createElement("div")
        message.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: var(--primary-color);
              color: white;
              padding: 1rem 2rem;
              border-radius: 8px;
              z-index: 9999;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              font-weight: bold;
              opacity: 0;
              transform: translateY(-20px);
              transition: all 0.3s ease;
          `

        message.innerHTML = `
              <i class="fas fa-check-circle"></i>
              تم تطبيق ${themeNames[themeName]}
          `

        document.body.appendChild(message)

        // Animate in
        setTimeout(() => {
            message.style.opacity = "1"
            message.style.transform = "translateY(0)"
        }, 100)

        // Remove after 3 seconds
        setTimeout(() => {
            message.style.opacity = "0"
            message.style.transform = "translateY(-20px)"
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message)
                }
            }, 300)
        }, 3000)
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem("selectedTheme")
        if (savedTheme && this.colorThemes[savedTheme]) {
            this.applyColorTheme(savedTheme)
        } else {
            this.applyColorTheme("blue") // تطبيق الثيم الأزرق كافتراضي
        }
    }

    toggleMobileMenu() {
        const mobileMenuBtn = document.getElementById("mobileMenuBtn")
        const nav = document.getElementById("mainNav")
        const body = document.body

        mobileMenuBtn.classList.toggle("active")
        nav.classList.toggle("mobile-active")

        if (nav.classList.contains("mobile-active")) {
            this.createMobileOverlay()
            body.style.overflow = "hidden"
            // إضافة تأثير اهتزاز خفيف للزر
            mobileMenuBtn.style.transform = "scale(0.95)"
            setTimeout(() => {
                mobileMenuBtn.style.transform = "scale(1)"
            }, 150)
        } else {
            this.removeMobileOverlay()
            body.style.overflow = ""
        }
    }

    closeMobileMenu() {
        const mobileMenuBtn = document.getElementById("mobileMenuBtn")
        const nav = document.getElementById("mainNav")
        const body = document.body

        mobileMenuBtn.classList.remove("active")
        nav.classList.remove("mobile-active")
        this.removeMobileOverlay()
        body.style.overflow = ""

        // إضافة تأثير بصري عند الإغلاق
        nav.style.transform = "translateX(0)"
        setTimeout(() => {
            nav.style.transform = ""
        }, 400)
    }

    createMobileOverlay() {
        if (!document.querySelector(".mobile-nav-overlay")) {
            const overlay = document.createElement("div")
            overlay.className = "mobile-nav-overlay"
            document.body.appendChild(overlay)

            // إضافة event listener للإغلاق عند الضغط على الخلفية
            overlay.addEventListener("click", () => {
                this.closeMobileMenu()
            })

            setTimeout(() => {
                overlay.classList.add("active")
            }, 10)
        }
    }

    removeMobileOverlay() {
        const overlay = document.querySelector(".mobile-nav-overlay")
        if (overlay) {
            overlay.classList.remove("active")
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay)
                }
            }, 300)
        }
    }
}

// Utility functions for adding your own content
window.ChildrenSafetyUtils = {
    // Add your custom game
    addCustomGame: (gameHTML, gameCSS, gameJS) => {
        const gameContainer = document.getElementById("gameContainer")

        // Add custom styles
        if (gameCSS) {
            const style = document.createElement("style")
            style.textContent = gameCSS
            document.head.appendChild(style)
        }

        // Add game HTML
        if (gameHTML) {
            gameContainer.innerHTML = gameHTML
        }

        // Execute game JavaScript
        if (gameJS) {
            eval(gameJS)
        }
    },

    // Add custom video
    addCustomVideo: (videoTitle, videoDescription, videoURL, thumbnailURL) => {
        const videosGrid = document.querySelector(".videos-grid")

        const videoCard = document.createElement("div")
        videoCard.className = "video-card"
        videoCard.innerHTML = `
              <div class="video-thumbnail" style="background-image: url('${thumbnailURL}'); background-size: cover; background-position: center;">
                  <div class="video-overlay">
                      <button class="play-btn" data-video-url="${videoURL}">تشغيل</button>
                  </div>
              </div>
              <div class="video-info">
                  <h3>${videoTitle}</h3>
                  <p>${videoDescription}</p>
              </div>
          `

        videosGrid.appendChild(videoCard)

        // Add event listener for the new video
        const playBtn = videoCard.querySelector(".play-btn")
        playBtn.addEventListener("click", (e) => {
            e.preventDefault()
            window.childrenSafetyWebsite.playVideo(e.currentTarget)
        })
    },

    // Add safety tip
    addSafetyTip: (tipText, iconClass = "fas fa-shield-alt") => {
        const tipsGrid = document.querySelector(".tips-grid")

        const tipCard = document.createElement("div")
        tipCard.className = "tip-card"
        tipCard.innerHTML = `
              <div class="tip-icon">
                  <i class="${iconClass}"></i>
              </div>
              <p>${tipText}</p>
          `

        tipsGrid.appendChild(tipCard)
    },

    // Add custom contact method
    addContactMethod: (title, description, contactInfo, iconClass) => {
        const contactInfoContainer = document.querySelector(".contact-info")

        const contactCard = document.createElement("div")
        contactCard.className = "contact-card"
        contactCard.innerHTML = `
              <div class="contact-icon">
                  <i class="${iconClass}"></i>
              </div>
              <h3>${title}</h3>
              <p>${description}</p>
              <span class="contact-link">${contactInfo}</span>
          `

        contactInfoContainer.appendChild(contactCard)
    },
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const website = new ChildrenSafetyWebsite()

    // Make website instance globally available
    window.childrenSafetyWebsite = website
})

// Add some interactive effects
document.addEventListener("mouseover", (e) => {
    if (e.target.matches(".feature-card, .game-card, .video-card, .tip-card, .contact-card")) {
        e.target.style.transform = "translateY(-5px)"
    }
})

document.addEventListener("mouseout", (e) => {
    if (e.target.matches(".feature-card, .game-card, .video-card, .tip-card, .contact-card")) {
        e.target.style.transform = "translateY(0)"
    }
})

// Add scroll animations
window.addEventListener("scroll", () => {
    const cards = document.querySelectorAll(".feature-card, .tip-card, .game-card, .video-card, .contact-card")

    cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top
        const cardVisible = 150

        if (cardTop < window.innerHeight - cardVisible) {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
        }
    })
})

// Initialize scroll animations
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".feature-card, .tip-card, .game-card, .video-card, .contact-card")

    cards.forEach((card) => {
        card.style.opacity = "0"
        card.style.transform = "translateY(30px)"
        card.style.transition = "all 0.6s ease"
    })
})