import { Octokit } from '@octokit/core';

// Function to retrieve pull requests using GraphQL
const getPullRequests = async (owner, repo, authToken) => {
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
              commits {
                totalCount
              }
            }
          }
        }
      }
    }
  `;

	const variables = {};
	const octokit = new Octokit({ auth: authToken });
	const response = await octokit.graphql({ query, variables });

	return response.repository.pullRequests.edges;
};

// Function to filter pull requests based on date range
const filterPullRequestsByDateRange = (pullRequests, startDate, endDate) => {
	const start = new Date(startDate);
	const end = new Date(endDate);

	return pullRequests.filter(pr => {
		const mergedAt = new Date(pr.node.mergedAt);
		return mergedAt >= start && mergedAt <= end;
	});
};

// Function to calculate contributor statistics
const calculateContributorStats = (pullRequests) => {
	const contributorsStats = {};

	pullRequests.forEach(pr => {
		const { author, commits, additions, deletions } = pr.node;
		const authorLogin = author.login;

		if (!contributorsStats[authorLogin]) {
			contributorsStats[authorLogin] = {
				commitsCount: 0,
				additions: 0,
				deletions: 0,
				balance: 0,
				pullRequestCount: 0
			};
		}

		contributorsStats[authorLogin].commitsCount += commits.totalCount;
		contributorsStats[authorLogin].additions += additions;
		contributorsStats[authorLogin].deletions += deletions;
		contributorsStats[authorLogin].balance += additions - deletions;
		contributorsStats[authorLogin].pullRequestCount++;
	});

	return contributorsStats;
};

// Main function to get contributor statistics based on pull requests
export const getContributorsStatsBasedOnPullRequests = async (owner, repo, authToken, startDate, endDate) => {
	const pullRequests = await getPullRequests(owner, repo, authToken);
	const filteredPullRequests = filterPullRequestsByDateRange(pullRequests, startDate, endDate);
	const contributorsStats = calculateContributorStats(filteredPullRequests);

	return contributorsStats;
};
