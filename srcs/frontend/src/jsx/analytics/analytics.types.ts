// 1 .Implement data modells in json for react to use 
// check how many modells you need 

// Which data do we have THIS IS FOR KPI CARD
export interface AnalyticsOverview {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    winRate: number;

    aiRequests: number;
    inputTokens: number;
    outputTokens: number;
    thinkingTokens: number;
    totalTokens: number;
}

// THIS IS FOR AI USAGE WITH RANGE LINE CHART
export interface AiUsageOverTime {
    date: string;
    requests: number;
    inputTokens: number;
    outputTokens: number;
    thinkingTokens: number;
    totalTokens: number;
}

// THIS IS FOR GAME WITH RANGE LINE CHART
export interface GamesOverTime {
    date: string;
    played: number;
    won: number;
    lost: number;
}

// THIS IS FOR PIE CHART
export interface GamesSummary {
    won: number;
    lost: number;
}

export interface AiTokenUsage {
    inputTokens: number;
    outputTokens: number;
    thinkingTokens: number;
}

// CENTRAL CONTAINER
export interface AnalyticsData {
    overview: AnalyticsOverview;
    aiUsageOverTime: AiUsageOverTime[];
    gamesOverTime: GamesOverTime[];
    gamesSummary: GamesSummary;
}