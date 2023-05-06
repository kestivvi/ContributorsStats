import { getPullRequests } from "./utils";
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Chart.css'

export default function Chart3({ values }) {
	// State to hold the chart data
	const [chartData, setChartData] = useState(null);

	useEffect(() => {
		// Function to fetch the pull requests and update the chart data
		async function fetchData() {
			// Fetch the pull requests using the provided values
			const pullRequests = await getPullRequests(
				values.owner,
				values.repo,
				values.APItoken,
				values.startDate,
				values.endDate
			);

			// Group pull requests by author and calculate the sum of balances for each author
			const authors = _.groupBy(pullRequests, pr => pr.node.author.login);
			const authorNames = Object.keys(authors);
			const balance = authorNames.map(author => authors[author].reduce((sum, pr) => sum + pr.balance, 0));

			// Prepare the chart data object
			const data = [
				{
					x: authorNames,
					y: balance,
					type: 'bar',
				},
			];

			// Update the chart data state
			setChartData(data);
		}

		// Fetch data when the component mounts and when the 'values' prop changes
		fetchData();
	}, [values]);

	return (
		<div className='chart'>
			{chartData ? (
				// Render the Plot component with the chart data and layout
				<Plot
					data={chartData}
					layout={{
						title: "Balance based on pull requests' author"
					}}
				/>
			) : (
				// Show a loading message if chart data is not available
				<div>Loading chart data...</div>
			)}
		</div>
	);
}
