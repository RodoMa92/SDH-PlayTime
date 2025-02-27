import { VFC, useEffect, useState } from 'react'
import { DailyStatistics, convertDailyStatisticsToGameWithTime } from '../app/model'
import { useLocator } from '../locator'
import { Paginated, empty } from '../app/reports'
import { Pager } from '../components/Pager'
import { WeekView } from '../components/statistics/WeekView'
import { ChartStyle } from '../app/settings'
import { PieView } from '../components/statistics/PieView'
import { AverageAndOverall } from '../components/statistics/AverageAndOverall'
import { formatWeekInterval } from '../app/formatters'
import { GamesTimeBarView } from '../components/statistics/GamesTimeBarView'
import { PanelSection } from 'decky-frontend-lib'

export const ReportWeekly: VFC = () => {
    const { reports, currentSettings: settings } = useLocator()
    const [isLoading, setLoading] = useState<Boolean>(false)
    const [currentPage, setCurrentPage] = useState<Paginated<DailyStatistics>>(empty())

    useEffect(() => {
        setLoading(true)
        reports.weeklyStatistics().then((it) => {
            setCurrentPage(it)
            setLoading(false)
        })
    }, [])

    const onNextWeek = () => {
        setLoading(true)
        currentPage?.next().then((it) => {
            setCurrentPage(it)
            setLoading(false)
        })
    }
    const onPrevWeek = () => {
        setLoading(true)
        currentPage?.prev().then((it) => {
            setCurrentPage(it)
            setLoading(false)
        })
    }
    return (
        <div>
            <Pager
                onNext={onNextWeek}
                onPrev={onPrevWeek}
                currentText={formatWeekInterval(currentPage.current().interval)}
                hasNext={currentPage.hasNext()}
                hasPrev={currentPage.hasPrev()}
            />
            {isLoading && <div>Loading...</div>}
            {!isLoading && !currentPage && <div>Error while loading data</div>}
            {!isLoading && currentPage && (
                <div>
                    {' '}
                    <AverageAndOverall statistics={currentPage.current().data} />
                    <PanelSection title="By day">
                        <WeekView statistics={currentPage.current().data} />
                    </PanelSection>
                    <PanelSection title="By game">
                        <GamesTimeBarView
                            data={convertDailyStatisticsToGameWithTime(
                                currentPage.current().data
                            )}
                        />
                        {settings.gameChartStyle == ChartStyle.PIE_AND_BARS && (
                            <PieView statistics={currentPage.current().data} />
                        )}
                    </PanelSection>
                </div>
            )}
        </div>
    )
}
