import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getFeaturedArticles } from '../../lib/strapi';
import PostContent from '../../components/blog/PostContent';

const customColors = {
  brandDark: "#1e3a29",
  brandPrimary: "#3a7a4d",
  brandLight: "#6dbf78",
};

export default function BlogPost({ article, relatedArticles }) {
  if (!article) {
    return (
      <>
        <Head>
          <title>Artigo não encontrado - Blog Enraizado</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
            <p className="text-gray-600 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
            >
              ← Voltar ao Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        {/* Meta tags para SEO */}
        <title>{article.title} - Blog Enraizado</title>
        <meta
          name="description"
          content={article.description?.substring(0, 160) || 'Leia este artigo no Blog Enraizado'}
        />
        <meta name="author" content="Equipe Enraizado" />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${article.title} - Blog Enraizado`} />
        <meta
          property="og:description"
          content={article.description?.substring(0, 160) || 'Leia este artigo no Blog Enraizado'}
        />
        <meta property="og:url" content={`https://enraizado.com/blog/${article.slug}`} />
        <meta property="og:site_name" content="Enraizado" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${article.title} - Blog Enraizado`} />
        <meta
          name="twitter:description"
          content={article.description?.substring(0, 160) || 'Leia este artigo no Blog Enraizado'}
        />

        <link rel="canonical" href={`https://enraizado.com/blog/${article.slug}`} />
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
                href="/blog"
                className="text-gray-600 hover:text-brand-primary"
              >
                ← Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <PostContent post={article} relatedPosts={relatedArticles} />
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

// Função para gerar caminhos estáticos
export async function getStaticPaths() {
  // Por enquanto, vamos gerar caminhos vazios e usar fallback
  // Em produção, você pode buscar todos os slugs do Strapi
  return {
    paths: [],
    fallback: 'blocking', // Gera páginas sob demanda
  };
}

// Função para buscar dados estáticos
export async function getStaticProps({ params }) {
  try {
    const { slug } = params;

    // Buscar o artigo
    const articleResponse = await getBlogPostBySlug(slug);

    if (!articleResponse.data) {
      return {
        notFound: true,
      };
    }

    // Buscar artigos relacionados (artigos recentes)
    const relatedResponse = await getFeaturedArticles(3);
    const relatedArticles = relatedResponse.data || [];

    return {
      props: {
        article: articleResponse.data,
        relatedArticles,
      },
      revalidate: 60, // Revalidar a cada 60 segundos
    };
  } catch (error) {
    console.error('Erro ao buscar dados do artigo:', error);
    return {
      notFound: true,
    };
  }
}
