import type { GamesOverTime } from "./analytics.types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

interface GamesOverTimeChartProps {
    data: GamesOverTime[];
}

function GamesOverTimeChart({ data }: GamesOverTimeChartProps) {
    const { t } = useTranslation();

    return (
        <div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid />

                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    <Bar
                        dataKey="won"
                        stackId="games"
                        name={t("analytics.charts.won")}
                        fill="#169b4d"
                    />

                    <Bar
                        dataKey="lost"
                        stackId="games"
                        name={t("analytics.charts.lost")}
                        fill="#c13323"
                    />

                    <Bar
                        dataKey="drawn"
                        stackId="games"
                        name={t("analytics.charts.drawn")}
                        fill="#b3abab"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default GamesOverTimeChart;
