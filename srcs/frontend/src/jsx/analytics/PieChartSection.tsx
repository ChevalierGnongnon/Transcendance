import { useState } from "react";

import type {
    GamesSummary,
    AiTokenUsage,
} from "./analytics.types";

import GamesPlayedPieChart from "./GamesPlayedPieChart";
import AiTokenUsagePieChart from "./AiTokenPieChart";
import GamesOverTimeChart from "./GamesOverTimeChart";
import { useTranslation } from "react-i18next";


interface PieChartSectionProps {
    gamesSummary: GamesSummary;
    aiTokenUsage: AiTokenUsage;
	totalTokens: number;
	totalGames: number;
}


function PieChartSection({
    gamesSummary,
    aiTokenUsage,
	totalTokens,
	totalGames,
}: PieChartSectionProps) {
    const { t } = useTranslation();
    const [selectedChart, setSelectedChart] = useState("aiTokens");

    return (
        <div className="card h-100 shadow-sm w-100">
            <div className="card-body">
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">

                    <h2 className="card-title mb-0">
                        {t("analytics.charts.distribution")}
                    </h2>

                    <select
                        className="form-select w-auto"
                        value={selectedChart}
                        onChange={(event) => setSelectedChart(event.target.value)}
                    >
                    <option value="aiTokens">
                        {t("analytics.charts.ai-token-usage")}
                    </option>

                    <option value="games">
                        {t("analytics.charts.games-played")}
                    </option>
                    </select>

                </div>

                {selectedChart === "aiTokens" && (
                    <AiTokenUsagePieChart
                        data={aiTokenUsage}
                        totalTokens={totalTokens}
                    />
                )}

                {selectedChart === "games" && (
                    <GamesPlayedPieChart
                        data={gamesSummary}
                        totalGames={totalGames}
                    />
                )}
        </div>
    </div>
    );
}

export default PieChartSection;