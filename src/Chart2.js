import { getContributorsStatsBasedOnPullRequests } from "./utils";
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import './Chart.css'

export default function Chart2({ values }) {
	// State to hold the chart data
	const [chartData, setChartData] = useState(null);

	useEffect(() => {
		// Function to fetch the pull requests and update the chart data
		async function fetchData() {

			// Fetch the pull requests using the provided values
			const contributorsStats = await getContributorsStatsBasedOnPullRequests(
				values.owner,
				values.repo,
				values.APItoken,
				values.startDate,
				values.endDate
			);

			const authorNames = Object.keys(contributorsStats);
			const deletions = authorNames.map(author => contributorsStats[author].deletions);

			// Prepare the chart data object
			const data = [
				{
					x: authorNames,
					y: deletions,
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
					layout={{ title: "Deletions based on pull requests' author" }}
				/>
			) : (
				// Show a loading message if chart data is not available
				<div>Loading chart data...</div>
			)}
		</div>
	);
}
