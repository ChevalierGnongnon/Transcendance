import { useState } from "react";

import type {
    GamesSummary,
    AiTokenUsage,
} from "./analytics.types";

import GamesPlayedPieChart from "./GamesPlayedPieChart";
import AiTokenUsagePieChart from "./AiTokenPieChart";
import GamesOverTimeChart from "./GamesOverTimeChart";


interface PieChartSectionProps {
    gamesSummary: GamesSummary;
    aiTokenUsage: AiTokenUsage;
}


function PieChartSection({
    gamesSummary,
    aiTokenUsage,
}: PieChartSectionProps) {

    const [selectedChart, setSelectedChart] = useState("aiTokens");

    return (
        <div className="analytics-chart-section">

            <div className="analytics-chart-header">

                <h2>Distribution</h2>

                <select
                    value={selectedChart}
                    onChange={(event) =>
                        setSelectedChart(event.target.value)
                    }
                >
                    <option value="aiTokens">
                        AI Token Usage
                    </option>

                    <option value="games">
                        Games Played
                    </option>
                </select>

            </div>

            {selectedChart === "aiTokens" && (
                <AiTokenUsagePieChart data={aiTokenUsage} />
            )}

            {selectedChart === "games" && (
                <GamesPlayedPieChart data={gamesSummary} />
            )}

        </div>
    );
}

export default PieChartSection;