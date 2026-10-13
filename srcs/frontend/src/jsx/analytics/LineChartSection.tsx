import "../../scss/analytics-chart.scss";

import { useState } from "react";

import type {
    AiUsageOverTime,
    GamesOverTime,
} from "./analytics.types";

import AiUsageChart from "./AiUsageChart";
import GamesOverTimeChart from "./GamesOverTimeChart";
import { useTranslation } from "react-i18next";

interface LineChartSectionProps {
    aiUsageData: AiUsageOverTime[];
    gamesData: GamesOverTime[];
}

function LineChartSection({
    aiUsageData,
    gamesData,
}: LineChartSectionProps) {
    const { t } = useTranslation();
    const [selectedChart, setSelectedChart] = useState("aiUsage");

    return (
        <div className="card h-100 shadow-sm w-100">
            <div className="card-body">
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">

            <h2 className="card-title mb-0">
                {t("analytics.charts.activity-over-time")}
            </h2>

            <select
                className="form-select w-auto"
                value={selectedChart}
                onChange={(event) => setSelectedChart(event.target.value)}
            >
                <option value="aiUsage">
                    {t("analytics.charts.ai-usage-over-time")}
                </option>

                <option value="games">
                    {t("analytics.charts.games-over-time")}
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