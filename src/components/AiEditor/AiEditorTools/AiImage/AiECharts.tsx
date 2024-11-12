import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import styles from './index.less'
import { message } from 'antd';

const MyChart = ({ isBase64Image, eChartsOptions }: any) => {
    const chartDom = useRef(null);
    const chartInstance = useRef<any>(null);
    useEffect(() => {
        if (!chartInstance.current) {
            initChart();
        }
        // 当组件卸载时，释放图表资源
        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, []);

    const initChart = () => {
        chartInstance.current = echarts.init(chartDom.current);
        if (eChartsOptions) {
            chartInstance.current.setOption(JSON.parse(eChartsOptions));
        }
        // chartInstance.current.setOption(options);
        setTimeout(() => {
            html2canvas(chartInstance.current.getDom()).then(function (canvas) {
                var base64image = canvas.toDataURL('image/png');
                isBase64Image(base64image)
            }).catch((error) => {
                message.error(error)
              })
        }, 2000);

    };

    return (
        <div>
            <div ref={chartDom} className={styles.ai_image_Recommended_chart_shows}></div>

        </div>
    );
};

export default MyChart;


