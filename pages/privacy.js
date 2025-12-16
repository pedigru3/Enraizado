import React from "react"
import Head from "next/head"
import Image from "next/image"

const customColors = {
  brandDark: "#1e3a29",
  brandPrimary: "#3a7a4d",
  brandLight: "#6dbf78",
}

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Política de Privacidade - Enraizado</title>
        <meta
          name="description"
          content="Política de privacidade do aplicativo Enraizado"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <Image
                src="/icon-circle.png"
                width={40}
                height={40}
                alt="Logo Enraizado"
                className="h-10 w-10 rounded-full"
              />
              <h1
                className="text-2xl font-bold"
                style={{ color: customColors.brandDark }}
              >
                Enraizado
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Política de Privacidade
            </h1>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Última atualização:</strong>{" "}
                {new Date().toLocaleDateString("pt-BR")}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Introdução
                </h2>
                <p className="text-gray-700 mb-4">
                  Bem-vindo ao Enraizado! Esta Política de Privacidade descreve
                  como coletamos, usamos, armazenamos e protegemos suas
                  informações pessoais quando você usa nosso aplicativo móvel
                  (&quot;App&quot;).
                </p>
                <p className="text-gray-700 mb-4">
                  Ao usar o Enraizado, você concorda com as práticas descritas
                  nesta política. Se você não concordar com esta política, por
                  favor, não use nosso aplicativo.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Informações que Coletamos
                </h2>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.1 Informações Fornecidas por Você
                </h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Nome de usuário</li>
                  <li>Endereço de e-mail</li>
                  <li>Dados de progresso na leitura bíblica</li>
                  <li>Preferências de tema e configurações</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">
                  2.2 Informações Coletadas Automaticamente
                </h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>
                    Informações do dispositivo (modelo, sistema operacional)
                  </li>
                  <li>Dados de uso do aplicativo</li>
                  <li>Data e hora de acesso</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Como Usamos Suas Informações
                </h2>
                <p className="text-gray-700 mb-4">
                  Usamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Fornecer e manter o serviço do aplicativo</li>
                  <li>Personalizar sua experiência de leitura</li>
                  <li>
                    Enviar comunicações relacionadas ao serviço (ativação de
                    conta, etc.)
                  </li>
                  <li>Melhorar e desenvolver novos recursos</li>
                  <li>Garantir a segurança da plataforma</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Compartilhamento de Informações
                </h2>
                <p className="text-gray-700 mb-4">
                  Não vendemos, alugamos ou compartilhamos suas informações
                  pessoais com terceiros, exceto nas seguintes circunstâncias:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Para proteger direitos e segurança</li>
                  <li>Em caso de fusão, aquisição ou venda de ativos</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Armazenamento e Segurança
                </h2>
                <p className="text-gray-700 mb-4">
                  Suas informações são armazenadas em servidores seguros e
                  protegidas por medidas técnicas e organizacionais apropriadas.
                  Implementamos criptografia, controles de acesso e
                  monitoramento contínuo para proteger seus dados.
                </p>
                <p className="text-gray-700 mb-4">
                  Embora nos esforcemos para proteger suas informações, nenhum
                  método de transmissão ou armazenamento eletrônico é 100%
                  seguro. Não podemos garantir segurança absoluta.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Seus Direitos
                </h2>
                <p className="text-gray-700 mb-4">Você tem o direito de:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados inexatos</li>
                  <li>Excluir sua conta e dados</li>
                  <li>Optar por não receber comunicações não essenciais</li>
                  <li>Portabilidade dos dados</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  Para exercer esses direitos, entre em contato conosco através
                  do e-mail fornecido na seção de contato.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Retenção de Dados
                </h2>
                <p className="text-gray-700 mb-4">
                  Mantemos suas informações apenas pelo tempo necessário para
                  fornecer nossos serviços e cumprir obrigações legais. Dados de
                  contas inativas podem ser excluídos após período de
                  inatividade prolongado.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Cookies e Tecnologias Similares
                </h2>
                <p className="text-gray-700 mb-4">
                  Podemos usar cookies e tecnologias similares para melhorar sua
                  experiência, lembrar suas preferências e analisar o uso do
                  aplicativo. Você pode gerenciar essas configurações nas
                  configurações do seu dispositivo.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Serviços de Terceiros
                </h2>
                <p className="text-gray-700 mb-4">
                  Podemos usar serviços de terceiros confiáveis para
                  funcionalidades específicas (como envio de e-mails). Esses
                  terceiros têm suas próprias políticas de privacidade e são
                  obrigados a proteger suas informações conforme acordado
                  conosco.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Privacidade de Crianças
                </h2>
                <p className="text-gray-700 mb-4">
                  Nosso aplicativo é destinado a usuários adultos. Não coletamos
                  intencionalmente informações pessoais de crianças menores de
                  13 anos. Se tomarmos conhecimento de que coletamos informações
                  de uma criança, excluiremos essas informações imediatamente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Alterações nesta Política
                </h2>
                <p className="text-gray-700 mb-4">
                  Podemos atualizar esta Política de Privacidade periodicamente.
                  Notificaremos sobre mudanças significativas através do
                  aplicativo ou por e-mail. O uso continuado do aplicativo após
                  alterações constitui aceitação da política atualizada.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. Contato
                </h2>
                <p className="text-gray-700 mb-4">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou
                  sobre suas informações pessoais, entre em contato conosco:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> contato@enraizado.com.br
                    <br />
                    <strong>Assunto:</strong> Privacidade - Enraizado
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  13. Lei Aplicável
                </h2>
                <p className="text-gray-700 mb-4">
                  Esta Política de Privacidade é regida pelas leis brasileiras,
                  especificamente pela Lei Geral de Proteção de Dados (LGPD -
                  Lei nº 13.709/2018).
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                © {new Date().getFullYear()} Enraizado. Todos os direitos
                reservados.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default PrivacyPolicy
