import { Octokit } from '@octokit/core';
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Chart.css'

export default function Chart1({ values }) {
	const [chartData, setChartData] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const pullRequests = await getPullRequests(values);

			// Extract authors and their additions
			const authors = _.groupBy(pullRequests, pr => pr.node.author.login);
			const authorNames = Object.keys(authors);
			const additions = authorNames.map(author => authors[author].reduce((sum, pr) => sum + pr.node.additions, 0));

			// Create data for the bar chart
			const data = [
				{
					x: authorNames,
					y: additions,
					type: 'bar',
				},
			];

			setChartData(data);
		}

		fetchData();
	}, [values]);

	return (
		<div className='chart'>
			{chartData ? (
				<Plot
					data={chartData}
					layout={{ title: 'Additions by Author' }}
				/>
			) : (
				<div>Loading chart data...</div>
			)}
		</div>
	);
}

const getPullRequests = async (values) => {
	const query = `
		query {
			repository(owner: "${values.owner}", name: "${values.repo}") {
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

	const octokit = new Octokit({ auth: values.APItoken });
	const response = await octokit.graphql({ query, variables });
	const pullRequests = response.repository.pullRequests.edges;


	const startDate = new Date(values.startDate);
	const endDate = new Date(values.endDate);
	const filteredPullRequests = pullRequests.filter(pr => {
		const mergedAt = new Date(pr.node.mergedAt);
		return mergedAt >= startDate && mergedAt <= endDate;
	});

	return filteredPullRequests;

	// filteredPullRequests.forEach(pr => {
	// 	const { title, author, additions, deletions } = pr.node;
	// 	const balance = additions - deletions;

	// 	console.log("Title:", title);
	// 	console.log("Author:", author.login);
	// 	console.log("Added Lines:", additions);
	// 	console.log("Deleted Lines:", deletions);
	// 	console.log("Balance:", balance);
	// });
}