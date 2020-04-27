import type { Data, EnglandData } from "types/Data";
import React, { Fragment, ReactNode } from "react";
import AltChartTable from "components/AltChartTable";

import moment from "moment";
import numeral from "numeral";

import { zip } from "pythonic";
import * as Styles from "./ChartTable.styles";
import { Table } from "govuk-react-jsx";

import type { EnglandTableProps, TablesProps, TableStructure, TitleOrDescription } from "./ChartTable.types"


const sortFunc = (a, b) => {

    const
        dateA = new Date(a.date),
        dateB = new Date(b.date);

    if ( dateA < dateB ) return 1;

    return dateA > dateB ? -1 : 0

}; // sortFunc


const EnglandDailyCasesStructure = ({ titles, descriptions }: TitleOrDescription): TableStructure => ({
    metadata: [
        {
            key: 'previouslyReportedDailyCases',
            headings: { value: 'Date', type: 'string' },
            type: 'date',
            formatter: moment,
            format: 'DD MMM YYYY',
            valueGetter: (d) => d.date
        },
        {
            key: 'previouslyReportedDailyCases',
            headings: { value: 'Previously reported', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'changeInDailyCases',
            headings: { value: 'Change', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'dailyConfirmedCases',
            headings: { value: 'Confirmed cases', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        }
    ],
    extra: {
        intro: titles.dailyCases,
        description: descriptions.dailyCases,
    }
}); // englandDailyCasesStructure


const EnglandDailyTotalCasesStructure = ({ titles, descriptions }: TitleOrDescription): TableStructure => ({
    metadata: [
        {
            key: 'previouslyReportedDailyTotalCases',
            headings: { value: 'Date', type: 'string' },
            type: 'date',
            formatter: moment,
            format: 'DD MMM YYYY',
            valueGetter: (d) => d.date
        },
        {
            key: 'previouslyReportedDailyTotalCases',
            headings: { value: 'Previously reported', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'changeInDailyTotalCases',
            headings: { value: 'Change', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        },
        {
            key: 'dailyTotalConfirmedCases',
            headings: { value: 'Total confirmed cases', type: 'numeric' },
            type: 'numeric',
            formatter: numeral,
            format: '0,0',
            valueGetter: (d) => d.value
        }
    ],
    extra: {
        intro: titles.totalCases,
        description: descriptions.totalCases,
    }
}); // EnglandDailyTotalCasesStructure


const EnglandTable = ({ englandData, structure }: EnglandTableProps): React.ReactNode => {

    const
        dataKeys = structure.metadata.map(item => item.key),
        dataArray = zip(...dataKeys.map(key => englandData[key].sort(sortFunc)));

    return <Styles.Container>
        {
            structure?.extra?.intro ?? null
                ? <span className={ "govuk-heading-s" }>{ structure.extra.intro }</span>
                : null
        }
        <Styles.Table>
            <Table
                tabIndex={ 0 }
                head={
                    dataKeys.map((_, index) => ({
                        children: [structure.metadata[index].headings.value],
                        format: structure.metadata[index].headings.type
                    }))
                }
                rows={
                    dataArray.map(item =>
                        dataKeys.map((_, index) => ({
                            children: structure
                                .metadata[index]
                                .formatter(structure.metadata[index].valueGetter(item[index]))
                                .format(structure.metadata[index].format),
                            format: structure.metadata[index].type
                        }))
                    )
                }
            />
        </Styles.Table>
        {
            structure?.extra?.description ?? null
                ? <Styles.P className={ "govuk-body govuk-!-font-size-14 govuk-!-margin-top-5" }>
                    { structure.extra.description }
                </Styles.P>
                : null
        }
    </Styles.Container>

}; // EnglandTable


/**
 * Produces the tables.
 *
 * @param data { Data }
 * @param titles { TitleOrDescriptionValues }
 * @param descriptions { TitleOrDescriptionValues }
 * @returns { ReactNode }
 */
export const Tables = ({ data, titles, descriptions }: TablesProps): ReactNode => {

    const
        { overview = {}, countries = {} } = data,
        england: EnglandData = countries?.E92000001 ?? [];

    return <Fragment>
        <EnglandTable
            englandData={ england }
            structure={
                EnglandDailyTotalCasesStructure({
                    titles: titles,
                    descriptions: descriptions
                }) }
        />

        <EnglandTable
            englandData={ england }
            structure={
                EnglandDailyCasesStructure({
                    titles: titles,
                    descriptions: descriptions
                }) }
        />

        <AltChartTable
            data={ overview?.K02000001?.dailyTotalDeaths ?? [] }
            header={ titles.totalDeaths }
            valueName="Total deaths"
        />

        <AltChartTable
            data={ overview?.K02000001?.dailyDeaths ?? [] }
            header={ titles.dailyDeaths }
            valueName="Daily deaths"
        />

        <AltChartTable
            data={ overview?.K02000001?.dailyTests ?? [] }
            header={ titles.dailyTests }
            valueName="Daily tests"
        />
    </Fragment>

}; // tables
