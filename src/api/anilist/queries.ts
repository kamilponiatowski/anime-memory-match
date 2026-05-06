export const GET_ANIME_CHARACTERS = `
  query GetAnimeCharacters($mediaId: Int!, $perPage: Int!) {
    Media(id: $mediaId, type: ANIME) {
      id
      title {
        romaji
        english
      }
      characters(perPage: $perPage, sort: [FAVOURITES_DESC]) {
        nodes {
          id
          name {
            full
            native
          }
          image {
            large
            medium
          }
        }
      }
    }
  }
`

export const SEARCH_ANIME = `
  query SearchAnime($search: String!, $perPage: Int!) {
    Page(perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(search: $search, type: ANIME, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
        }
      }
    }
  }
`

export const GET_TOP_ANIME = `
  query GetTopAnime($perPage: Int!) {
    Page(perPage: $perPage) {
      media(type: ANIME, sort: [POPULARITY_DESC]) {
        id
        title {
          romaji
          english
        }
      }
    }
  }
`
