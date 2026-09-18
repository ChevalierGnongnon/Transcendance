import "../../scss/analytics-chart.scss";

import { useState } from "react";

import type {
    AiUsageOverTime,
    GamesOverTime,
} from "./analytics.types";

import AiUsageChart from "./AiUsageChart";
import GamesOverTimeChart from "./GamesOverTimeChart";

interface LineChartSectionProps {
    aiUsageData: AiUsageOverTime[];
    gamesData: GamesOverTime[];
}

function LineChartSection({
    aiUsageData,
    gamesData,
}: LineChartSectionProps) {

    const [selectedChart, setSelectedChart] = useState("aiUsage");

    return (
        <div className="analytics-chart-section">

            <div className="analytics-chart-header">

                <h2>Activity Over Time</h2>

                <select
                    value={selectedChart}
                    onChange={(event) =>
                        setSelectedChart(event.target.value)
                    }
                >
                    <option value="aiUsage">
                        AI Usage Over Time
                    </option>

                    <option value="games">
                        Games Over Time
                    </option>
                </select>

            </div>

            {selectedChart === "aiUsage" && (
                <AiUsageChart data={aiUsageData} />
            )}

            {selectedChart === "games" && (
                <GamesOverTimeChart data={gamesData} />
            )}

        </div>
    );
}

export default LineChartSection;