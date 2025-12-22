import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { getBlogPosts, getFeaturedArticles } from '../../lib/strapi';
import PostCard from '../../components/blog/PostCard';

const customColors = {
  brandDark: "#1e3a29",
  brandPrimary: "#3a7a4d",
  brandLight: "#6dbf78",
};

export default function Blog({ articles, featuredArticles, pagination }) {
  return (
    <>
      <Head>
        {/* Meta tags para SEO */}
        <title>Blog Enraizado - Leituras Espirituais e Devocionais</title>
        <meta
          name="description"
          content="Descubra conteúdos espirituais, devocionais e reflexões bíblicas no blog do Enraizado. Leituras diárias para fortalecer sua fé e caminhada espiritual."
        />
        <meta
          name="keywords"
          content="blog cristão, leituras espirituais, devocionais, Bíblia, fé, espiritualidade, Enraizado"
        />
        <meta name="author" content="Enraizado" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog Enraizado - Leituras Espirituais" />
        <meta
          property="og:description"
          content="Conteúdos espirituais para fortalecer sua caminhada com Cristo"
        />
        <meta property="og:url" content="https://enraizado.com/blog" />
        <meta property="og:site_name" content="Enraizado" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog Enraizado - Leituras Espirituais" />
        <meta
          name="twitter:description"
          content="Conteúdos espirituais para fortalecer sua caminhada com Cristo"
        />

        <link rel="canonical" href="https://enraizado.com/blog" />
      </Head>

      {/* NAV BAR */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo e Nome */}
            <Link
              href="/"
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image
                src="/icon-circle.png"
                alt="Logo Enraizado"
                width={40}
                height={40}
                className="rounded-full shadow-sm hover:rotate-12 transition-transform duration-500"
              />
              <span
                className="font-bold text-2xl tracking-tight"
                style={{ color: customColors.brandDark }}
              >
                Enraizado
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                Início
              </Link>
              <Link
                href="/#como-funciona"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                Como funciona
              </Link>
              <Link
                href="/#beneficios"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                Benefícios
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-brand-primary font-medium transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/#baixar"
                className="hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ backgroundColor: customColors.brandPrimary }}
              >
                Baixar App
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link
                href="/"
                className="text-gray-600 hover:text-brand-primary"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blog <span style={{ color: customColors.brandPrimary }}>Enraizado</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Conteúdos espirituais para fortalecer sua caminhada com Cristo.
              Leituras diárias, devocionais e reflexões bíblicas.
            </p>
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Posts em Destaque */}
        {featuredArticles && featuredArticles.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Artigos em Destaque</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <PostCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}


        {/* Lista de Posts */}
        <section>
          {articles && articles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {articles.map((article) => (
                  <PostCard key={article.id} article={article} />
                ))}
              </div>

              {/* Paginação */}
              {pagination && pagination.pageCount > 1 && (
                <div className="flex justify-center gap-2">
                  {pagination.page > 1 && (
                    <Link
                      href={`/blog?page=${pagination.page - 1}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ← Anterior
                    </Link>
                  )}

                  {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      href={`/blog?page=${page}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === pagination.page
                          ? 'bg-brand-primary text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Link>
                  ))}

                  {pagination.page < pagination.pageCount && (
                    <Link
                      href={`/blog?page=${pagination.page + 1}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Próximo →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum artigo encontrado</h3>
              <p className="text-gray-600">Em breve teremos conteúdos incríveis para você!</p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-circle.png"
              alt="Logo"
              width={32}
              height={32}
              className="grayscale opacity-70"
            />
            <span className="font-bold text-lg text-gray-200">Enraizado</span>
          </div>

          <div className="flex gap-6 text-sm">
            <Link href="/privacidade" className="hover:text-white transition">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white transition">
              Termos de Uso
            </Link>
            <Link href="/suporte" className="hover:text-white transition">
              Suporte
            </Link>
          </div>

          <div className="text-sm opacity-60">
            &copy; 2024 App Enraizado. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}

// Função para buscar dados no servidor
export async function getServerSideProps({ query }) {
  try {
    const page = parseInt(query.page) || 1;
    const category = query.category;

    // Buscar artigos
    const articlesResponse = await getBlogPosts({ page, category });
    const articles = articlesResponse.data || [];
    const pagination = articlesResponse.meta?.pagination;

    // Buscar artigos em destaque (artigos mais recentes)
    const featuredResponse = await getFeaturedArticles();
    const featuredArticles = featuredResponse.data || [];

    return {
      props: {
        articles,
        featuredArticles,
        pagination,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados do blog:', error);
    return {
      props: {
        articles: [],
        featuredArticles: [],
        pagination: null,
      },
    };
  }
}
