import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Chart.css';
import { getPullRequests } from './utils';

export default function Chart1({ values }) {
	// State to hold the chart data
	const [chartData, setChartData] = useState(null);

	useEffect(() => {
		// Function to fetch the pull requests and update the chart data
		const fetchData = async () => {
			try {
				// Fetch the pull requests using the provided values
				const pullRequests = await getPullRequests(
					values.owner,
					values.repo,
					values.APItoken,
					values.startDate,
					values.endDate
				);

				// Group pull requests by author and calculate the sum of additions for each author
				const authors = pullRequests.reduce((groupedAuthors, pr) => {
					const author = pr.node.author.login;
					const additions = pr.node.additions;

					if (groupedAuthors[author]) {
						groupedAuthors[author] += additions;
					} else {
						groupedAuthors[author] = additions;
					}

					return groupedAuthors;
				}, {});

				// Extract author names and additions into separate arrays for chart data
				const authorNames = Object.keys(authors);
				const additions = authorNames.map(author => authors[author]);

				// Prepare the chart data object
				const data = [
					{
						x: authorNames,
						y: additions,
						type: 'bar',
					},
				];

				// Update the chart data state
				setChartData(data);
			} catch (error) {
				console.error('Error fetching pull requests:', error);
			}
		};

		// Fetch data when the component mounts and when the 'values' prop changes
		fetchData();
	}, [values]);

	return (
		<div className="chart">
			{chartData ? (
				// Render the Plot component with the chart data and layout
				<Plot data={chartData} layout={{ title: 'Additions by Author' }} />
			) : (
				// Show a loading message if chart data is not available
				<div>Loading chart data...</div>
			)}
		</div>
	);
}
