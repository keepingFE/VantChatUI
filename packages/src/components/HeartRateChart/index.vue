<template>
    <div class="heart-rate-chart">
        <div ref="chartContainer" class="chart-container"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { CustomChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([CustomChart, GridComponent, CanvasRenderer]);

export default {
    name: 'HeartRateChart',
    props: {
        heartRateData: { type: Array, default: () => [] }
    },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        this.initChart();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (this.chart) {
            this.chart.dispose();
        }
    },
    watch: {
        heartRateData: {
            handler() {
                this.updateChart();
            },
            deep: true
        }
    },
    methods: {
        initChart() {
            if (!this.$refs.chartContainer) return;

            this.chart = echarts.init(this.$refs.chartContainer);
            this.updateChart();
        },
        updateChart() {
            if (!this.chart || this.heartRateData.length === 0) return;

            const dates = this.heartRateData.map(item => item.date);

            // 准备瀑布图数据：[最小值, 最大值]
            const seriesData = this.heartRateData.map(item => {
                if (item.min === null || item.max === null) {
                    return [null, null];
                }
                return [item.min, item.max];
            });

            const option = {
                grid: {
                    left: '50',
                    right: '30',
                    top: '40',
                    bottom: '50'
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: 14,
                        interval: 0,
                        rotate: 45
                    }
                },
                yAxis: {
                    type: 'value',
                    interval: 25,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#ffffff',
                        fontSize: 14
                    },
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'custom',
                        renderItem: (params, api) => {
                            const categoryIndex = api.value(0);
                            const start = api.coord([categoryIndex, api.value(1)]);
                            const end = api.coord([categoryIndex, api.value(2)]);

                            if (api.value(1) === null || api.value(2) === null) {
                                return null;
                            }

                            const height = end[1] - start[1];
                            const width = 6;
                            const x = start[0] - width / 2;
                            const y = start[1];
                            const radius = 3;

                            return {
                                type: 'rect',
                                shape: {
                                    x: x,
                                    y: y,
                                    width: width,
                                    height: height,
                                    r: radius
                                },
                                style: {
                                    fill: '#e8eef5'
                                }
                            };
                        },
                        encode: {
                            x: 0,
                            y: [1, 2]
                        },
                        data: seriesData.map((item, index) => [index, item[0], item[1]])
                    }
                ]
            };

            this.chart.setOption(option);
        },
        handleResize() {
            if (this.chart) {
                this.chart.resize();
            }
        }
    }
};
</script>

<style scoped>
.heart-rate-chart {
    position: relative;
    width: 100%;
    padding: 20px;
    background: transparent;
    border-radius: 16px;
}

.chart-container {
    width: 100%;
    height: 300px;
}
</style>
