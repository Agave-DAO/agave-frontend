import React, { useState } from 'react';
import styled from 'styled-components';
import Chart from "react-apexcharts";
import Button from '../../components/Button';

const GraphWrapper = styled.div`
  width: 100%;

  .filter-section {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    max-width: 300px;
  }

  .graph-section {
    display: flex;
    justify-content: space-between;

    .reserve-graph-inner {
      background-color: ${props => props.theme.color.bgSecondary};
      margin-bottom: 15px;
      border-radius: 2px;
      box-shadow: ${props => props.theme.color.boxShadow};
      padding-bottom: 10px;
      width: 32.5%;

      .top-inner {
        display: flex;
        align-items: center;
        padding: 6px 10px;
        color: ${props => props.theme.color.textSecondary};
        border-bottom: 1px solid ${props => props.theme.color.white};

        .top-title {
          font-size: 12px !important;
          font-weight: 400 !important;
          padding-right: 10px;
        }

        .top-legend {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1 1 0%;
          font-size: 12px !important;
          font-weight: 400 !important;

          .top-legend-item {
            display: flex;
            align-items: center;
            margin-left: 10px;
            white-space: nowrap;

            .legend-dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 5px;

              &.pink {
                background-color: ${props => props.theme.color.pink};
              }

              &.blue {
                background-color: ${props => props.theme.color.blue};
              }
            }

            .legend-name {
              font-size: 12px !important;
              font-weight: 400 !important;
            }
          }
        }
      }

      .content-inner {
        height: 150px;
        overflow: hidden;
        position: relative;
      }
    }
  }
`;

function Graph() {
  const [options, setOptions] = useState({
    chart: {
      height: 150,
      width: "100%",
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    xaxis: {
      type: "category",
      categories: ['1 Jan', '1 Jan', '1 Jan'],
      tickPlacement: 'between',
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
            colors: 'white',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
        },
        offsetX: 0,
        offsetY: 0,
        format: 'dd/MM',
        formatter: undefined,
        datetimeUTC: true,
        datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm',
        },
      },
      axisTicks: {
        show: true,
        borderType: 'solid',
        color: 'white',
        height: 6,
        offsetX: 0,
        offsetY: 0
      },
      axisBorder: {
        show: true,
        color: 'white',
        height: 1,
        width: '100%',
        offsetX: 0,
        offsetY: 0
      },
    },
    yaxis: {
      show: true,
      showAlways: true,
      showForNullSeries: true,
      seriesName: undefined,
      opposite: false,
      reversed: false,
      logarithmic: false,
      tickAmount: 6,
      forceNiceScale: false,
      floating: false,
      decimalsInFloat: undefined,
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: 'white',
          fontSize: '20px',
          fontWeight: 'normal',
        },
        formatter: (val) => { return val + ' %' },
      },
      axisBorder: {
        show: true,
        color: 'white',
        offsetX: 0,
        offsetY: 0
      },
      axisTicks: {
        show: false,
      },
    },
  });

  const [series, setSeries] = useState([]);
  
  return (
    <GraphWrapper>
      <div className="filter-section">
        <Button size="sm">Daily</Button>
        <Button size="sm">Weekly</Button>
        <Button size="sm">Monthly</Button>
        <Button size="sm">All</Button>
      </div>
      <div className="graph-section">
        <div className="reserve-graph-inner">
          <div className="top-inner">
            <div className="top-title">
              Stable vs Variable APR
            </div>
            <div className="top-legend">
              <div className="top-legend-item">
                <div className="legend-dot pink"></div>
                <div className="legend-name">Stable</div>
              </div>
              <div className="top-legend-item">
                <div className="legend-dot blue"></div>
                <div className="legend-name">Variable</div>
              </div>
            </div>
          </div>
          <div className="content-inner">
            <Chart
              options={options}
              series={series}
              type="line"
              height="150"
            />
          </div>
        </div>
        <div className="reserve-graph-inner">
          <div className="top-inner">
            <div className="top-title">
              Deposit APY
            </div>
          </div>
          <div className="content-inner">
            <Chart
              options={options}
              series={series}
              type="line"
              height="150"
            />
          </div>
        </div>
        <div className="reserve-graph-inner">
          <div className="top-inner">
            <div className="top-title">
              Utilization rate
            </div>
          </div>
          <div className="content-inner">
            <Chart
              options={options}
              series={series}
              type="line"
              height="150"
            />
          </div>
        </div>
      </div>
    </GraphWrapper>
  );
}

export default Graph;
