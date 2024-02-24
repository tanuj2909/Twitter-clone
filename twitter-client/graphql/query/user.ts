import { graphql } from '@/gql';

export const verifyUserGoogleTokenQuery = graphql(`#graphql
    query VerifyUserGoogleToken($token: String!) {
        verifyGoogleToken(token: $token)
    }
`)

export const getCurrentUserQuery = graphql(`#graphql
    query GetCurrentUser {
        getCurrentUser {
            id
            profileImageUrl
            email
            firstName
            lastName
            recommendedUsers {
                id
                lastName
                firstName
                profileImageUrl
            }
            followers {
                id
                lastName
                profileImageUrl
            }
            following {
                id
                firstName
                lastName
                profileImageUrl
            }
            tweets {
                id
                content
                author {
                    firstName
                    lastName
                    profileImageUrl

                }
            }
        }
    }
`)

export const getUserByIdQuery = graphql(`#graphql
    query GetUserById($id: ID!) {
        getUserById(id: $id) {
            id
            firstName
            lastName
            profileImageUrl
            followers {
                id
                lastName
                firstName
                profileImageUrl
            }
            following {
                firstName
                lastName
                id
                profileImageUrl
            }
            tweets {
                content
                id
                author {
                    id
                    profileImageUrl
                    lastName
                    firstName
                }
            }
        }
    }
`)