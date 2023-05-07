const { getContributorsStatsBasedOnPullRequests } = require('../src/utils');

module.exports = async (request, response) => {
    if (request.method !== "POST") {
        response.status(405).json({ error: "Method Not Allowed! Only POST is accepted!" });
        return;
    }

    try {
        const { owner, repo, startDate, endDate } = request.body;
        const authToken = process.env.AUTH_TOKEN;

        const stats = await getContributorsStatsBasedOnPullRequests(owner, repo, authToken, startDate, endDate);

        response.status(200).json(stats);
    } catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
};
