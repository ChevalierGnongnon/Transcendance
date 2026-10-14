import '../../scss/analytics.scss';

import { useEffect, useState } from "react";
import { getAnalytics } from "./analyticsApi";
import type { AnalyticsData } from "./analytics.types";
import AnalyticsCard from "./AnalyticsCard";
import LineChartSection from './LineChartSection';
import PieChartSection from "./PieChartSection";
import { exportAnalyticsToCsv } from './analyticsExport';
import { useSocketConnection } from '../messages/hooks/useSocketConnection';
import { socket } from '../messages/socket';
import { useTranslation } from 'react-i18next';

function getDefaultDates() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);

    sevenDaysAgo.setDate(today.getDate() -7);
    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };
    return {
        from: formatDate(sevenDaysAgo),
        to: formatDate(today),
    };
}


function Analytics() {
    const { t } = useTranslation();
    const today = new Date().toISOString().split("T")[0];
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const defaultDates = getDefaultDates();
    const [from, setFrom] = useState(defaultDates.from);
    const [to, setTo] = useState(defaultDates.to);
    const [activeFrom, setActiveFrom] = useState(defaultDates.from);
    const [activeTo, setActiveTo] = useState(defaultDates.to);
    const isConnected = useSocketConnection();

    useEffect(() => {
        async function loadAnalytics() {
            console.log("Loading analytics:", {
            activeFrom,
            activeTo,
        });
            try {
                setLoading(true);
                setError(null);

                const data = await getAnalytics(
                    activeFrom,
                    activeTo
                );

                setAnalytics(data);
            } catch (error) {
                console.error(error);
                setError("Could not load analytics.");
            } finally {
                setLoading(false);
            }
        }

        function handleAnalyticsUpdated(){
            console.log("Analytics updated");
            loadAnalytics();
        }

        loadAnalytics();

        socket.on("analytics:updated", handleAnalyticsUpdated);

        return ()=> {
            socket.off("analytics:updated", handleAnalyticsUpdated);
        }
    }, [activeFrom, activeTo]);

    if (loading) {
        return <p>{t("analytics.loading")}</p>;
    }

    if (!analytics) {
        return <p>{t("analytics.no-data")}</p>;
    }

    function handleApplyFilter() {
    console.log("Apply clicked");

    if (from > to) {
        console.log("error");
        setError("The start date cannot be after the end date.");
        return;
    }

    console.log("FROM:", from);
    console.log("TO:", to);

    setError(null);
    setActiveFrom(from);
    setActiveTo(to);
}

    function applyPreset(days: number) {
    const todayDate = new Date();

    const fromDate = new Date(todayDate);
    fromDate.setDate(todayDate.getDate() - days);

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const newFrom = formatDate(fromDate);
    const newTo = formatDate(todayDate);

    setFrom(newFrom);
    setTo(newTo);

    setActiveFrom(newFrom);
    setActiveTo(newTo);
    }


    return (
    <div className="analytics">
        <h1 className="mb-2 fw-bold">
            {t("analytics.title")}
        </h1>

        <p className="text-secondary mb-4">
            {t("analytics.description")}
        </p>

        <div className="d-flex flex-wrap align-items-end gap-3 p-4 mb-4 border rounded">

    <div>
        <label
            htmlFor="analytics-from"
            className="form-label"
        >
           {t("analytics.filters.from")}
        </label>

        <input
            id="analytics-from"
            type="date"
            className="form-control"
            value={from}
            max={today}
            onChange={(event) => setFrom(event.target.value)}
        />
    </div>

    <div>
        <label
            htmlFor="analytics-to"
            className="form-label"
        >
            {t("analytics.filters.to")}
        </label>

        <input
            id="analytics-to"
            type="date"
            className="form-control"
            value={to}
            max={today}
            onChange={(event) => setTo(event.target.value)}
        />
    </div>

    <div className="d-flex gap-2">
        <button
            className="btn btn-outline-secondary"
            onClick={() => applyPreset(7)}
        >
            {t("analytics.filters.7-days")}
        </button>

        <button
            className="btn btn-outline-secondary"
            onClick={() => applyPreset(14)}
        >
            {t("analytics.filters.14-days")}
        </button>

        <button
            className="btn btn-outline-secondary"
            onClick={() => applyPreset(30)}
        >
            {t("analytics.filters.30-days")}
        </button>
    </div>

    <button
        className="btn btn-primary"
        onClick={handleApplyFilter}
    >
        {t("analytics.filters.apply")}
    </button>

    <button
        className="btn btn-success ms-auto"
        onClick={() =>
            exportAnalyticsToCsv(
                analytics,
                activeFrom,
                activeTo
            )
        }
    >
        {t("analytics.filters.export-csv")}
    </button>

    </div>

        {error && (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        )}

        <div className="row g-4">
           <div className="col-12 col-sm-6 col-lg-4">
                <AnalyticsCard
                    title={t("analytics.overview.games-played")}
                    value={analytics.overview.gamesPlayed}
                />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
                <AnalyticsCard
                    title={t("analytics.overview.games-won")}
                    value={analytics.overview.gamesWon}
                />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
                <AnalyticsCard
                    title={t("analytics.overview.games-lost")}
                    value={analytics.overview.gamesLost}
                />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
                <AnalyticsCard
                    title={t("analytics.overview.win-rate")}
                    value={`${analytics.overview.winRate.toFixed(1)}%`}
                />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
                <AnalyticsCard
                    title={t("analytics.overview.ai-requests")}
                    value={analytics.overview.aiRequests}
                />
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
                <AnalyticsCard
                    title={t("analytics.overview.total-tokens")}
                    value={analytics.overview.totalTokens}
                />
            </div>
        </div>
        <div className="row g-4 mt-4">
             <div className="col-12 col-lg-6 d-flex">
                <LineChartSection
                    aiUsageData={analytics.aiUsageOverTime}
                    gamesData={analytics.gamesOverTime}
                />
            </div>
            <div className="col-12 col-lg-6 d-flex">
                <PieChartSection
                    gamesSummary={analytics.gamesSummary}
                    aiTokenUsage={{
                        inputTokens: analytics.overview.inputTokens,
                        outputTokens: analytics.overview.outputTokens,
                        thinkingTokens: analytics.overview.thinkingTokens,
                    }}
                    totalTokens={analytics.overview.totalTokens}
                    totalGames={analytics.overview.gamesPlayed}
                />
            </div>
        </div>
    </div>
    );
}

export default Analytics;