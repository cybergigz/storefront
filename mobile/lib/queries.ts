import gql from "graphql-tag";

// User Details Fragment
export const USER_DETAILS_FRAGMENT = gql`
	fragment UserDetails on User {
		id
		email
		firstName
		lastName
		avatar {
			url
			alt
		}
	}
`;

// Current User Query
export const CURRENT_USER_QUERY = gql`
	${USER_DETAILS_FRAGMENT}
	query CurrentUser {
		me {
			...UserDetails
		}
	}
`;

// Login Mutation
export const LOGIN_MUTATION = gql`
	${USER_DETAILS_FRAGMENT}
	mutation Login($email: String!, $password: String!) {
		tokenCreate(email: $email, password: $password) {
			token
			refreshToken
			csrfToken
			user {
				...UserDetails
			}
			errors {
				field
				message
				code
			}
		}
	}
`;

// Product List Query
export const PRODUCT_LIST_QUERY = gql`
	query ProductList($first: Int!, $channel: String!) {
		products(first: $first, channel: $channel) {
			edges {
				node {
					id
					name
					slug
					description
					thumbnail {
						url
						alt
					}
					pricing {
						priceRange {
							start {
								gross {
									amount
									currency
								}
							}
						}
					}
				}
			}
		}
	}
`;

// Product Detail Query
export const PRODUCT_DETAIL_QUERY = gql`
	query ProductDetail($id: ID!, $channel: String!) {
		product(id: $id, channel: $channel) {
			id
			name
			slug
			description
			thumbnail {
				url
				alt
			}
			media {
				url
				alt
			}
			pricing {
				priceRange {
					start {
						gross {
							amount
							currency
						}
					}
				}
			}
			variants {
				id
				name
				pricing {
					price {
						gross {
							amount
							currency
						}
					}
				}
			}
		}
	}
`;
