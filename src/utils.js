import { Octokit } from '@octokit/core';

export const getPullRequests = async (owner, repo, authToken, startDate, endDate) => {
    const query = `
		query {
			repository(owner: "${owner}", name: "${repo}") {
				pullRequests(first: 100, states: MERGED, orderBy: { field: UPDATED_AT, direction: ASC }) {
					edges {
						node {
							createdAt
							mergedAt
							author {
								login
							}
							title
							additions
							deletions
						}
					}
				}
			}
		}
	`;

    const variables = {};

    const octokit = new Octokit({ auth: authToken });
    const response = await octokit.graphql({ query, variables });
    const pullRequests = response.repository.pullRequests.edges;


    var startDate = new Date(startDate);
    var endDate = new Date(endDate);
    const filteredPullRequests = pullRequests.filter(pr => {
        const mergedAt = new Date(pr.node.mergedAt);
        return mergedAt >= startDate && mergedAt <= endDate;
    });

    return filteredPullRequests;
}
