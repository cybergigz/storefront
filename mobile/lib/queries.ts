import gql from "graphql-tag";

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
