import React, { useEffect, useRef, useState } from "react"
// Caminho para o logo (círculo verde)
const logo = "/icon-circle.png"
// Caminho para a nova imagem de mockup de tela
const mockupImage = "/print.webp"

const customColors = {
  brandDark: "#1e3a29",
  brandPrimary: "#3a7a4d",
  brandLight: "#6dbf78",
}

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const sectionsRef = useRef([])

  // Função para animação de scroll (fade-in)
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    // Cleanup
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false) // Fecha o menu mobile após clicar
    }
  }

  // Estilo para animação (o Tailwind não suporta animações complexas diretamente em className)
  const animationStyle = `
        .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        /* Para manter a imagem do print totalmente dentro da borda do celular */
        .mockup-screen-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 2.5rem; /* Corresponde ao rounded-[2.5rem] */
        }
    `

  // Função auxiliar para adicionar refs aos elementos
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <>
      <style>{animationStyle}</style>

      {/* NAV BAR */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo e Nome */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection("top")}
            >
              <img
                src={logo}
                alt="Logo Enraizado"
                className="h-10 w-10 rounded-full shadow-sm hover:rotate-12 transition-transform duration-500"
              />
              <span
                className="font-bold text-2xl tracking-tight"
                style={{ color: customColors.brandDark }}
              >
                Enraizado
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                onClick={() => scrollToSection("como-funciona")}
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors cursor-pointer"
              >
                Como funciona
              </a>
              <a
                onClick={() => scrollToSection("beneficios")}
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors cursor-pointer"
              >
                Benefícios
              </a>
              <a
                onClick={() => scrollToSection("baixar")}
                className="hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
                style={{ backgroundColor: customColors.brandPrimary }}
              >
                Baixar App
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-brand-primary focus:outline-none"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Panel */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-white border-t border-gray-100 absolute w-full`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2 shadow-lg">
            <a
              onClick={() => scrollToSection("como-funciona")}
              className="block px-3 py-3 text-gray-600 hover:bg-green-50 hover:text-brand-primary rounded-md font-medium cursor-pointer"
            >
              Como funciona
            </a>
            <a
              onClick={() => scrollToSection("beneficios")}
              className="block px-3 py-3 text-gray-600 hover:bg-green-50 hover:text-brand-primary rounded-md font-medium cursor-pointer"
            >
              Benefícios
            </a>
            <a
              onClick={() => scrollToSection("baixar")}
              className="block mt-4 w-full text-center text-white px-3 py-3 rounded-lg font-bold cursor-pointer"
              style={{ backgroundColor: customColors.brandPrimary }}
            >
              Baixar Agora
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
        id="top"
      >
        {/* Background Decor */}
        <div
          className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: customColors.brandLight, opacity: 0.2 }}
        ></div>
        <div
          className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: customColors.brandPrimary, opacity: 0.1 }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="text-center lg:text-left fade-in-up"
              ref={addToRefs}
            >
              <span
                className="inline-block py-1 px-3 rounded-full font-semibold text-sm mb-6 border border-brand-light/30"
                style={{
                  backgroundColor: customColors.brandLight,
                  opacity: 0.2,
                  color: customColors.brandDark,
                }}
              >
                🌱 Sua vida espiritual em crescimento
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Leia a Bíblia inteira em{" "}
                <span
                  className="relative"
                  style={{ color: customColors.brandPrimary }}
                >
                  1 ano
                  <svg
                    className="absolute w-full h-3 -bottom-1 left-0 opacity-50"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    style={{ color: customColors.brandLight }}
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Muitos tentam, mas desistem no caminho. O <b>Enraizado</b> torna
                a leitura bíblica simples e constante. Apenas{" "}
                <b>15 minutos por dia</b> para transformar sua vida inteira.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: customColors.brandDark,
                    borderColor: customColors.brandDark,
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.5 2H6.5C3.5 2 2 3.5 2 6.5V17.5C2 20.5 3.5 22 6.5 22H17.5C20.5 22 22 20.5 22 17.5V6.5C22 3.5 20.5 2 17.5 2Z"
                      fillOpacity="0"
                    />
                    <path
                      d="M16.21 15.65C16.21 15.65 13.9 13.08 12.08 13.08C10.27 13.08 7.79 15.65 7.79 15.65C7.45 16.03 6.87 16.06 6.49 15.72C6.11 15.38 6.08 14.8 6.42 14.42C6.42 14.42 9.29 11.23 11.4 11.23C13.51 11.23 16.58 14.42 16.58 14.42C16.92 14.8 16.89 15.38 16.51 15.72C16.13 16.06 15.55 16.03 16.21 15.65ZM12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22Z"
                      fill="currentColor"
                    />
                  </svg>
                  Baixar Gratuitamente
                </button>
                <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all">
                  Saber mais
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-2">
                <span className="flex text-yellow-400">★★★★★</span> Mais de
                10.000 vidas transformadas
              </p>
            </div>

            {/* Hero Image Mockup - AGORA COM /print.webp */}
            <div
              className="relative fade-in-up"
              ref={addToRefs}
              style={{ transitionDelay: "0.2s" }}
            >
              <div
                className="relative mx-auto w-72 sm:w-80 rounded-[3rem] p-4 shadow-2xl border-4 border-white/50"
                style={{ backgroundColor: customColors.brandDark }}
              >
                <div className="bg-white mockup-screen-container">
                  {/* A nova imagem é inserida aqui para preencher o espaço da tela */}
                  <img
                    src={mockupImage}
                    alt="Screenshot do Aplicativo Enraizado"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* PROBLEM / BENEFÍCIOS SECTION */}
      <section className="py-20 bg-white" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="text-center max-w-3xl mx-auto mb-16 fade-in-up"
            ref={addToRefs}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que é tão difícil manter a constância?
            </h2>
            <p className="text-gray-600 text-lg">
              A rotina corrida e a falta de um plano claro fazem com que a
              maioria dos cristãos desista da leitura anual antes de março. O{" "}
              <b>Enraizado</b> resolve isso.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" id="beneficios">
            {/* Feature 1 */}
            <div
              className="bg-gray-50 p-8 rounded-2xl hover:bg-green-50 transition-colors duration-300 fade-in-up group border border-gray-100"
              ref={addToRefs}
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8"
                  style={{ color: customColors.brandPrimary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Apenas 15 Minutos
              </h3>
              <p className="text-gray-600">
                Dividimos a Bíblia em porções diárias perfeitamente calculadas.
                Você lê no ônibus, no café da manhã ou antes de dormir.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-gray-50 p-8 rounded-2xl hover:bg-green-50 transition-colors duration-300 fade-in-up border border-gray-100"
              ref={addToRefs}
              style={{ transitionDelay: "0.1s" }}
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8"
                  style={{ color: customColors.brandPrimary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Progresso Visual
              </h3>
              <p className="text-gray-600">
                Veja sua "árvore" espiritual crescer à medida que você lê.
                Acompanhe seu progresso e sinta-se motivado a não quebrar a
                sequência.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-gray-50 p-8 rounded-2xl hover:bg-green-50 transition-colors duration-300 fade-in-up border border-gray-100"
              ref={addToRefs}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8"
                  style={{ color: customColors.brandPrimary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Coração Enraizado
              </h3>
              <p className="text-gray-600">
                Mais do que ler, nosso objetivo é que você se aprofunde em
                Cristo. Meditações curtas acompanham cada leitura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LARGE CTA SECTION */}
      <section
        className="py-20 relative overflow-hidden"
        id="baixar"
        style={{ backgroundColor: customColors.brandDark }}
      >
        {/* Decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>

        <div
          className="max-w-4xl mx-auto px-4 text-center relative z-10 fade-in-up"
          ref={addToRefs}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Comece sua jornada hoje mesmo
          </h2>
          <p
            className="text-xl mb-10"
            style={{ color: customColors.brandLight, opacity: 0.8 }}
          >
            Junte-se a milhares de cristãos que estão aprofundando suas raízes.
            Não deixe para amanhã a transformação que pode começar em 15
            minutos.
          </p>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl inline-block border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <button
                className="bg-white text-brand-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
                style={{ color: customColors.brandDark }}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.68-.04-.84.26L16.43 9c-1.38-.6-2.96-.94-4.59-.94-1.66 0-3.23.33-4.63.94L5.32 5.71c-.16-.3-.55-.41-.84-.26-.3.16-.42.54-.26.85l1.86 3.18c-2.65 1.43-4.43 3.99-4.57 6.95h19.64c-.13-2.94-1.9-5.49-4.55-6.95zM8.38 13.13c-.76 0-1.38-.61-1.38-1.36 0-.75.62-1.36 1.38-1.36.76 0 1.38.61 1.38 1.36 0 .75-.62 1.36-1.38 1.36zm5.83 1.36c-.76 0-1.38-.61-1.38-1.36 0-.75.62-1.36 1.38-1.36.76 0 1.38.61 1.38 1.36 0 .75-.62 1.36-1.38 1.36z" />
                </svg>
                Download para Android
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2 w-full md:w-auto">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.72-3.03 1.64-.65.82-1.2 2.03-1.07 3.1 1.15.08 2.33-.79 3.03-1.63z" />
                </svg>
                Download para iOS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-8 grayscale opacity-70"
            />
            <span className="font-bold text-lg text-gray-200">Enraizado</span>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacidade
            </a>
            <a href="#" className="hover:text-white transition">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition">
              Suporte
            </a>
          </div>

          <div className="text-sm opacity-60">
            &copy; 2024 App Enraizado. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Home
