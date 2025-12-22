import axios from "axios"
import qs from "qs"

// Configurações do Strapi
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://authentic-bat-a05e5a34be.strapiapp.com"
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

const MEDIA_FIELDS = [
  "url",
  "alternativeText",
  "caption",
  "width",
  "height",
  "formats",
]

// Cliente axios configurado para Strapi
const strapiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  },
})

// Função para buscar posts do blog
export async function getBlogPosts(params = {}) {
  try {
    const { page = 1, pageSize = 10, category, search } = params

    const query = qs.stringify(
      {
        pagination: { page, pageSize },
        sort: ["publishedAt:desc"],
        populate: {
          // Evita erro "cover.related" (não pode popular tudo dentro de upload file)
          cover: { fields: MEDIA_FIELDS },
          // Evita erro "category.articles" (relation inversa / não-populável via *)
          category: { fields: ["name", "slug"] },
          author: { fields: ["name"] },
        },
        ...(category
          ? { filters: { category: { slug: { $eq: category } } } }
          : {}),
        ...(search
          ? {
              filters: {
                $or: [
                  { title: { $containsi: search } },
                  { description: { $containsi: search } },
                ],
              },
            }
          : {}),
      },
      { encodeValuesOnly: true },
    )

    const response = await strapiClient.get(`/api/articles?${query}`)
    return response.data
  } catch (error) {
    console.error("Erro ao buscar posts do blog:", error)
    throw error
  }
}

// Função para buscar um post específico por slug
export async function getBlogPostBySlug(slug) {
  try {
    // Dynamic Zone: populate precisa usar strategy com "on" por componente (Strapi v5)
    // Ref: https://docs.strapi.io/cms/api/rest/populate-select
    const query = qs.stringify(
      {
        filters: { slug: { $eq: slug } },
        populate: {
          // Evita erro "cover.related" ao popular upload file
          cover: { fields: MEDIA_FIELDS },
          // Evita erro "category.articles" ao popular relation com '*'
          category: { fields: ["name", "slug"] },
          author: { fields: ["name"] },
          blocks: {
            on: {
              "shared.rich-text": { populate: "*" },
              "shared.quote": { populate: "*" },
              "shared.media": {
                populate: {
                  file: { fields: MEDIA_FIELDS },
                },
              },
              "shared.slider": {
                populate: {
                  files: { fields: MEDIA_FIELDS },
                },
              },
              "shared.seo": {
                populate: {
                  shareImage: { fields: MEDIA_FIELDS },
                },
              },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    )

    const response = await strapiClient.get(`/api/articles?${query}`)

    if (response.data.data && response.data.data.length > 0) {
      return { data: response.data.data[0] }
    }

    return { data: null }
  } catch (error) {
    console.error("Erro ao buscar post do blog:", error)
    throw error
  }
}

// Função para buscar artigos recentes (como "em destaque" por enquanto)
export async function getFeaturedArticles(limit = 3) {
  try {
    const response = await strapiClient.get(
      `/api/articles?pagination[limit]=${limit}&populate=*&sort=publishedAt:desc`,
    )
    return response.data
  } catch (error) {
    console.error("Erro ao buscar artigos em destaque:", error)
    throw error
  }
}
