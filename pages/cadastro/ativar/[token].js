import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Image from "next/image"
const logo = "/icon-circle.png"

const customColors = {
  brandDark: "#1e3a29",
  brandPrimary: "#3a7a4d",
  brandLight: "#6dbf78",
}

const ActivationPage = () => {
  const router = useRouter()
  const { token } = router.query
  const [status, setStatus] = useState("loading") // loading, success, error
  const [message, setMessage] = useState("")
  const [errorDetails, setErrorDetails] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!token) return

    const activateAccount = async () => {
      try {
        const response = await fetch(`/api/v1/activations/${token}`, {
          method: "PATCH",
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage("Conta ativada com sucesso!")
          // Redirecionar para a página principal após 3 segundos
          setTimeout(() => {
            router.push("/")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.message || "Erro ao ativar conta")
          setErrorDetails(data)
        }
      } catch (error) {
        setStatus("error")
        setMessage("Erro ao conectar com o servidor")
        setErrorDetails({ action: "Tente novamente mais tarde" })
      }
    }

    activateAccount()
  }, [token, router])

  // Ativar animação fade-in quando o componente montar
  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        contentRef.current?.classList.add("visible")
      }, 100)
    }
  }, [status])

  return (
    <>
      <Head>
        <title>Ativação de Conta - Enraizado</title>
      </Head>

      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* NAV BAR */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo e Nome */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Image
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
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main
        className="relative min-h-screen pt-32 pb-20 overflow-hidden"
        style={{ backgroundColor: "#f9fafb" }}
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            ref={contentRef}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center fade-in-up"
          >
            {status === "loading" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-300 border-t-green-600"></div>
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: customColors.brandDark }}
                >
                  Ativando sua conta...
                </h1>
                <p className="text-gray-600 text-lg">
                  Por favor, aguarde enquanto processamos sua ativação.
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div
                    className="rounded-full p-4"
                    style={{
                      backgroundColor: customColors.brandLight,
                      opacity: 0.2,
                    }}
                  >
                    <svg
                      className="w-16 h-16"
                      style={{ color: customColors.brandPrimary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: customColors.brandDark }}
                >
                  Conta Ativada!
                </h1>
                <p className="text-gray-600 text-lg mb-6">{message}</p>
                <p className="text-sm text-gray-500">
                  Você será redirecionado para a página inicial em alguns
                  segundos...
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  style={{ backgroundColor: customColors.brandPrimary }}
                >
                  Ir para página inicial
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div
                    className="rounded-full p-4"
                    style={{ backgroundColor: "#fee2e2" }}
                  >
                    <svg
                      className="w-16 h-16 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: customColors.brandDark }}
                >
                  Erro na Ativação
                </h1>
                <p className="text-gray-600 text-lg mb-2">{message}</p>
                {errorDetails?.action && (
                  <p className="text-gray-500 text-sm mb-6">
                    {errorDetails.action}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/")}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all"
                  >
                    Voltar para página inicial
                  </button>
                  {errorDetails?.action?.includes("novo email") && (
                    <button
                      onClick={() => router.push("/cadastro")}
                      className="text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                      style={{ backgroundColor: customColors.brandPrimary }}
                    >
                      Solicitar novo email
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
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

export default ActivationPage
