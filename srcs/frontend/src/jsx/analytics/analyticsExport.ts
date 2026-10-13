import type { AnalyticsData } from "./analytics.types";


function downloadCsv(
	csv:string,
	filename: string
){
	// Binary large Object
	// Telling the browser the we want create a file of type csv with chatset utf 8 
	const blob = new Blob(
		[csv],
		{ type: "text/csv;charset=utf-8"}
	);

	// create temporary URL which points to the blob blob:https://trancsendance.com/....
	const url = URL.createObjectURL(blob);


	// create an <a> element which points to the url and give the link the filenamme 
	const link = document.createElement("a");

	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}


function createDailyAnalyticsData(analytics: AnalyticsData) {
    // Set both lists dates together and create a new array
    // with all unique dates.
    const aiDates = analytics.aiUsageOverTime.map(
        (day) => day.date
    );

    const gameDates = analytics.gamesOverTime.map(
        (day) => day.date
    );

    const dates = Array.from(
        new Set([
            ...aiDates,
            ...gameDates,
        ])
    ).sort();

    // Create one CSV row for each day.
    const rows = dates.map((date) => {
        const aiDay = analytics.aiUsageOverTime.find(
            (ai) => ai.date === date
        );

        const gameDay = analytics.gamesOverTime.find(
            (game) => game.date === date
        );

        return {
            date,
            gamesPlayed: gameDay?.played ?? 0,
            gamesWon: gameDay?.won ?? 0,
            gamesLost: gameDay?.lost ?? 0,
            aiRequests: aiDay?.requests ?? 0,
            inputTokens: aiDay?.inputTokens ?? 0,
            outputTokens: aiDay?.outputTokens ?? 0,
            thinkingTokens: aiDay?.thinkingTokens ?? 0,
            totalTokens: aiDay?.totalTokens ?? 0,
        };
    });

    return rows;
}

export function exportAnalyticsToCsv(
    analytics: AnalyticsData,
	from: string,
	to: string
) {
	
	const dailyData = createDailyAnalyticsData(analytics);

	// Create ehader row
    const header = [
		"Date", 
		"Games Played", 
		"Games Won", 
		"Games Lost",
		"AI requests", 
		"Input Tokens", 
		"Output Tokens", 
		"Thinking Tokens", 
		"Total Tokens",
	].join(",");

	// create each row 
	const csvRows = dailyData.map((row) => {
		return [
			row.date,
			row.gamesPlayed,
			row.gamesWon,
			row.gamesLost,
			row.aiRequests,
			row.inputTokens,
			row.outputTokens,
			row.thinkingTokens,
			row.totalTokens,
		].join(",");
	});

	// put together seperate by newline
	const csv = [
		header,
		...csvRows,
	].join("\n");

	downloadCsv(csv, `analytics_${from}_${to}.csv`);
}
