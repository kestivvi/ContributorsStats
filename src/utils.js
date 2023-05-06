import { Octokit } from '@octokit/core';

export const getPullRequests = async (owner, repo, authToken, startDate, endDate) => {
	// Define the GraphQL query to retrieve pull requests
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

	// Create an instance of the Octokit with the provided authentication token
	const octokit = new Octokit({ auth: authToken });

	// Send the GraphQL request to retrieve pull requests
	const response = await octokit.graphql({ query, variables });

	// Extract the pull requests from the GraphQL response
	const pullRequests = response.repository.pullRequests.edges;

	// Convert the start and end dates to Date objects
	const start = new Date(startDate);
	const end = new Date(endDate);

	// Filter the pull requests based on the merged date falling within the specified range
	const filteredPullRequests = pullRequests.filter(pr => {
		const mergedAt = new Date(pr.node.mergedAt);
		return mergedAt >= start && mergedAt <= end;
	});

	// Add the balance of lines of code (added - deleted) to each pull request
	const pullRequestsWithBalance = filteredPullRequests.map(pr => {
		const { additions, deletions } = pr.node;
		console.log(additions, deletions);
		const balance = additions - deletions;
		return {
			...pr,
			balance
		};
	});

	return pullRequestsWithBalance;
};
