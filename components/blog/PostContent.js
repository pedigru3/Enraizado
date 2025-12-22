import React, { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const PostContent = ({ post, relatedPosts = [] }) => {
  const { title, description, publishedAt, blocks } = post

  // Tentar usar imagem do Strapi, senão deixar null
  const imageUrl = post.cover?.url ? post.cover.url : null

  // Por enquanto, categoria padrão já que não temos campo de categoria
  const categoryName = "Geral"

  // Autor padrão
  const authorName = "Equipe Enraizado"
  const authorBio = null
  const authorAvatar = null

  // Tempo de leitura estimado baseado na descrição e blocks
  const readingTime = Math.ceil((description?.length || 0) / 200)

  // Função para renderizar componentes customizados
  const renderBlock = (block, index) => {
    const componentType = block.__component

    switch (componentType) {
      case "shared.rich-text":
        if (typeof block.body !== "string" || !block.body.trim()) return null

        return (
          <div
            key={index}
            className="prose prose-base sm:prose-lg max-w-none mb-6 sm:mb-8"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => (
                  <h1
                    className="text-3xl sm:text-4xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-gray-900"
                    {...props}
                  />
                ),
                h2: (props) => (
                  <h2
                    className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-gray-900"
                    {...props}
                  />
                ),
                h3: (props) => (
                  <h3
                    className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-gray-900"
                    {...props}
                  />
                ),
                p: (props) => (
                  <p
                    className="mb-4 text-gray-700 leading-relaxed text-base"
                    {...props}
                  />
                ),
                a: (props) => (
                  <a
                    className="text-brand-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                ul: (props) => (
                  <ul className="mb-4 ml-6 list-disc" {...props} />
                ),
                ol: (props) => (
                  <ol className="mb-4 ml-6 list-decimal" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="border-l-4 border-brand-primary pl-4 sm:pl-6 pr-4 my-6 sm:my-8 italic text-gray-700 bg-gray-50 py-4 rounded-r-lg"
                    {...props}
                  />
                ),
                code: (props) => (
                  <code
                    className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                    {...props}
                  />
                ),
              }}
            >
              {block.body}
            </ReactMarkdown>
          </div>
        )

      case "shared.quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-brand-primary pl-4 sm:pl-6 pr-4 my-6 sm:my-8 italic text-gray-700 bg-gray-50 py-4 rounded-r-lg"
          >
            {block.title && (
              <h3 className="font-bold text-gray-900 mb-2 not-italic">
                {block.title}
              </h3>
            )}
            <p className="text-lg">{block.body}</p>
          </blockquote>
        )

      case "shared.media": {
        const file = block.file
        if (!file) return null

        const mediaUrl = file.url || file.data?.attributes?.url
        if (!mediaUrl) return null

        const fullUrl = mediaUrl.startsWith("http")
          ? mediaUrl
          : `https://authentic-bat-a05e5a34be.strapiapp.com${mediaUrl}`

        // Se for imagem
        if (
          file.mime?.startsWith("image/") ||
          file.data?.attributes?.mime?.startsWith("image/")
        ) {
          return (
            <div key={index} className="my-8">
              <img
                src={fullUrl}
                alt={
                  file.alternativeText ||
                  file.data?.attributes?.alternativeText ||
                  ""
                }
                className="w-full h-auto rounded-lg shadow-lg"
              />
              {file.caption && (
                <p className="text-sm text-gray-600 mt-2 text-center italic">
                  {file.caption}
                </p>
              )}
            </div>
          )
        }

        // Se for vídeo ou outro arquivo
        return (
          <div key={index} className="my-6">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {file.name || "Baixar arquivo"}
            </a>
          </div>
        )
      }

      case "shared.slider": {
        const files = block.files || []
        if (!Array.isArray(files) || files.length === 0) return null

        // Componente Slider com estado
        const ImageSlider = () => {
          const [currentIndex, setCurrentIndex] = useState(0)

          // Filtrar apenas arquivos válidos
          const validFiles = files.filter((file) => {
            const fileUrl = file.url || file.data?.attributes?.url
            return fileUrl
          })

          if (validFiles.length === 0) return null

          const goToPrevious = () => {
            setCurrentIndex((prevIndex) =>
              prevIndex === 0 ? validFiles.length - 1 : prevIndex - 1,
            )
          }

          const goToNext = () => {
            setCurrentIndex((prevIndex) =>
              prevIndex === validFiles.length - 1 ? 0 : prevIndex + 1,
            )
          }

          const goToSlide = (slideIndex) => {
            setCurrentIndex(slideIndex)
          }

          return (
            <div className="relative my-8 group">
              {/* Container principal do slider */}
              <div className="relative bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                {/* Wrapper dos slides */}
                <div className="relative w-full min-h-[200px]">
                  {validFiles.map((file, fileIndex) => {
                    const fileUrl = file.url || file.data?.attributes?.url
                    const fullFileUrl = fileUrl.startsWith("http")
                      ? fileUrl
                      : `https://authentic-bat-a05e5a34be.strapiapp.com${fileUrl}`

                    const isActive = fileIndex === currentIndex

                    return (
                      <div
                        key={fileIndex}
                        className={`w-full flex items-center justify-center p-4 ${
                          isActive
                            ? "relative opacity-100"
                            : "absolute inset-0 opacity-0 pointer-events-none"
                        } transition-opacity duration-500 ease-in-out`}
                      >
                        <img
                          src={fullFileUrl}
                          alt={
                            file.alternativeText ||
                            file.data?.attributes?.alternativeText ||
                            `Slide ${fileIndex + 1}`
                          }
                          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Botões de navegação - apenas se houver mais de 1 imagem */}
                {validFiles.length > 1 && (
                  <>
                    {/* Botão Anterior */}
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
                      aria-label="Imagem anterior"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Botão Próximo */}
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
                      aria-label="Próxima imagem"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Indicadores de posição */}
              {validFiles.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  {validFiles.map((_, slideIndex) => (
                    <button
                      key={slideIndex}
                      onClick={() => goToSlide(slideIndex)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        slideIndex === currentIndex
                          ? "bg-brand-primary w-8"
                          : "bg-gray-300 w-2 hover:bg-gray-400"
                      }`}
                      aria-label={`Ir para imagem ${slideIndex + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Contador de imagens */}
              {validFiles.length > 1 && (
                <div className="text-center mt-2 text-sm text-gray-600">
                  {currentIndex + 1} / {validFiles.length}
                </div>
              )}
            </div>
          )
        }

        return <ImageSlider key={index} />
      }

      default:
        return null
    }
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header do post */}
      <header className="mb-8 px-4 sm:px-0">
        {/* Categoria */}
        <div className="mb-4">
          <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {categoryName}
          </span>
        </div>

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {title}
        </h1>

        {/* Meta informações */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-gray-600 mb-8">
          <div className="flex items-center gap-3">
            {authorAvatar && (
              <img
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${authorAvatar}`}
                alt={authorName}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{authorName}</p>
              {authorBio && (
                <p className="text-sm text-gray-600">{authorBio}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {publishedAt
                ? format(new Date(publishedAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })
                : ""}
            </span>
            {readingTime && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {readingTime} min de leitura
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Imagem de capa */}
      {imageUrl && (
        <div className="mb-8 -mx-4 sm:mx-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-64 md:h-96 object-cover sm:rounded-2xl shadow-lg"
          />
        </div>
      )}

      {/* Conteúdo do post */}
      <div className="prose prose-lg max-w-none mb-12 px-4 sm:px-0">
        {/* Descrição */}
        {description && (
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8">
            {description}
          </p>
        )}

        {/* Renderizar blocks */}
        {blocks && Array.isArray(blocks) && blocks.length > 0 && (
          <div>{blocks.map((block, index) => renderBlock(block, index))}</div>
        )}

        {/* Se não houver blocks nem description */}
        {(!blocks || !Array.isArray(blocks) || blocks.length === 0) &&
          !description && (
            <p className="text-gray-500 italic">Conteúdo não disponível.</p>
          )}
      </div>

      {/* Posts relacionados */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-gray-200 pt-12 px-4 sm:px-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Posts Relacionados
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  <a
                    href={`/blog/${relatedPost.slug}`}
                    className="hover:text-brand-primary"
                  >
                    {relatedPost.title}
                  </a>
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {relatedPost.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default PostContent
