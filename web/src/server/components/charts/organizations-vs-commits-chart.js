/**
# @License EPL-1.0 <http://spdx.org/licenses/EPL-1.0>
##############################################################################
# Copyright (c) 2016 The Linux Foundation and others.
#
# All rights reserved. This program and the accompanying materials
# are made available under the terms of the Eclipse Public License v1.0
# which accompanies this distribution, and is available at
# http://www.eclipse.org/legal/epl-v10.html
##############################################################################
*/

/**
 * React component to display Organizations vs Commits chart
 * Used in OrganizationCard, Top10Card
 * Uses ChartLayout
 *
 * @author: Vasu Srinivasan
 * @since: 0.0.1
 */

import React, { Component } from 'react';
import Griddle from 'griddle-react'
import ReactHighcharts from 'react-highcharts'

import * as DataReducers from '../../api/data-reducers'
import ChartLayout from '../chart-layout'

const ChartConfig = require('../../../../config/spectrometer-web.json').chart

const buttonActions = [
  {type: 'chartType', option: 'pie-commits', title: 'Top 10 Commits by Organizations', icon: 'pie_chart_outlined', tooltip: 'Show Commits as Pie Chart'},
  {type: 'chartType', option: 'pie-loc', title: 'Top 10 LoC by Organizations', icon: 'pie_chart', tooltip: 'Show LoC as Pie Chart'},
  {type: 'chartType', option: 'table', title: 'Commits by Organizations', icon: 'format_list_numbered', tooltip: 'Show as Table'}
]

const pieCommitsChart = (dataSeries, takeRight) => {
  const ds = DataReducers.sliceAndGroupOthers(dataSeries, takeRight, 'commitCount')
  const config = {
    chart: { type: 'pie' },
    title: { text: '' },
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'top'
    },
    colors: ChartConfig.pieChartColors,
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter: function() { return this.point.name + ' ' + this.point.y + ' (' + (Math.round(this.percentage*100)/100 + ' %)') },
          color: 'black',
          style: {
            textShadow: false
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Commits',
      colorByPoint: true,
      data: _.map(ds, (x) => { return {name: x.name, y: x.commitCount} })
    }]
  }

  return <ReactHighcharts config={config} />
}

const pieLocChart = (dataSeries, takeRight) => {
  const ds = DataReducers.sliceAndGroupOthers(dataSeries, takeRight, 'loc')
  const config = {
    chart: { type: 'pie' },
    title: { text: ''},
    legend: {
      align: 'right',
      layout: 'vertical',
      verticalAlign: 'top'
    },
    colors: ChartConfig.pieChartColors,
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          formatter: function() { return this.point.name + ' ' + this.point.y + ' (' + (Math.round(this.percentage*100)/100 + ' %)') },
          color: 'black',
          style: {
            textShadow: false
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Commits',
      colorByPoint: true,
      data: _.map(ds, (x) => { return {name: x.name, y: x.loc} })
    }]
  }

  return <ReactHighcharts config={config} />
}

const COLUMN_METADATA = [
  { columnName: "name", displayName: "Name" },
  { columnName: "commitCount", displayName: "Commit Count", cssClassName: 'td-values' },
  { columnName: "loc", displayName: "LoC Modified", cssClassName: 'td-values' },
];

const tableChart = (dataSeries, height) => {
  return (
    <Griddle id="organizations-vs-commits-table"
      tableClassName="table-chart"
      bodyHeight={height}
      results={_.orderBy(dataSeries, ['commitCount'], ['desc'])}
      showFilter={true} showSettings={false}
      columnMetadata={COLUMN_METADATA}
      filterPlaceholderText="Find Organization..."
      useFixedHeader={true}
      enableInfiniteScroll={true} />
  )
}

export default class OrganizationsVsCommitsChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      view: _.assign({}, DEFAULT_VIEW, props.view)
    }
    this.handleButtonActions = this.handleButtonActions.bind(this)
  }

  handleButtonActions = (type, value) => {
    const newView = _.merge(this.state.view, {[type]: value })
    this.setState({ view: newView })
  }

  render() {
    logger.info("organizations-vs-commits-chart:", this.state.view)
    const { chartType, name, ref1, ref2, takeRight, tableHeight } = this.state.view

    // let dataSeries = []
    const sortBy = chartType === 'pie-loc' ? 'loc' : 'commitCount'
    const dataSeries = DataReducers.organizationsVsCommitCount(this.props.projects, { name, ref1, ref2, sortBy } )

    return (
      <ChartLayout id="orgs-vs-commits-chart" title={buttonActions.find(x => x.option === this.state.view.chartType).title}
        buttonActions={buttonActions} currentView={this.state.view}
        handleButtonActions={this.handleButtonActions}>
        {chartType === 'pie-commits' && pieCommitsChart(dataSeries, takeRight)}
        {chartType === 'pie-loc' && pieLocChart(dataSeries, takeRight)}
        {chartType === 'table' && tableChart(dataSeries, tableHeight) }
      </ChartLayout>
    )
  }
}

const DEFAULT_VIEW = {
  chartType: 'pie-commits',
  sortBy: 'commitCount',
  name: undefined,
  ref1: undefined,
  ref2: undefined,
  organization: undefined,
  author: undefined,
  startDate: undefined,
  endDate: undefined,
  takeLeft: undefined,
  takeRight: undefined,
  tableHeight: 350
}

OrganizationsVsCommitsChart.propTypes = {
  projects: React.PropTypes.array,
  view: React.PropTypes.object
}
