import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Chart.css';
import { getContributorsStatsBasedOnPullRequests } from './utils';

export default function Chart1({ values }) {
	// State to hold the chart data
	const [chartData, setChartData] = useState(null);

	useEffect(() => {
		// Function to fetch the pull requests and update the chart data
		const fetchData = async () => {
			try {
				// Fetch the pull requests using the provided values
				const contributorsStats = await getContributorsStatsBasedOnPullRequests(
					values.owner,
					values.repo,
					values.APItoken,
					values.startDate,
					values.endDate
				);

				// Extract author names and additions into separate arrays for chart data
				const authorNames = Object.keys(contributorsStats);
				const additions = authorNames.map(author => contributorsStats[author].additions);

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
				<Plot data={chartData} layout={{ title: "Additions based on pull requests' author" }} />
			) : (
				// Show a loading message if chart data is not available
				<div>Loading chart data...</div>
			)}
		</div>
	);
}
