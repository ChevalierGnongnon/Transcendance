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
        <div className="card h-100 shadow-sm w-100">
            <div className="card-body">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">

            <h2 className="card-title mb-0">
                Activity Over Time
            </h2>

            <select
                className="form-select w-auto"
                value={selectedChart}
                onChange={(event) => setSelectedChart(event.target.value)}
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
    </div>
    );
}

export default LineChartSection;