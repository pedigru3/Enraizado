import React from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const PostCard = ({ article }) => {
  const { title, slug, description, publishedAt } = article

  // Tentar usar imagem do Strapi, senão usar imagem padrão
  const imageUrl = article.cover?.url ? article.cover.url : "/print.webp"

  // Por enquanto, categoria padrão já que não temos campo de categoria
  const categoryName = "Geral"
  const categorySlug = null

  // Autor padrão
  const authorName = "Equipe Enraizado"

  // Tempo de leitura estimado baseado na descrição (aproximadamente 200 palavras por minuto)
  const readingTime = Math.ceil((description?.length || 0) / 200)

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Imagem de capa */}
      <div className="relative h-48 overflow-hidden">
        <Link href={`/blog/${slug}`}>
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={192}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {/* Categoria */}
        <div className="absolute top-4 left-4">
          <Link
            href={categorySlug ? `/blog/categoria/${categorySlug}` : "/blog"}
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            {categoryName}
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Meta informações */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {authorName}
            </span>
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {publishedAt
                ? format(new Date(publishedAt), "dd 'de' MMM", { locale: ptBR })
                : ""}
            </span>
          </div>
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
              {readingTime} min
            </span>
          )}
        </div>

        {/* Link para ler mais */}
        <div className="mt-4">
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-dark font-medium transition-colors"
          >
            Ler mais
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostCard
