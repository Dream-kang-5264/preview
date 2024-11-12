import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import styles from './index.less'
import domtoimage from 'dom-to-image';
const MermaidChart = ({ chart, isMermaidBase64 }: any) => {
   
    const chartRef = useRef<HTMLDivElement>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    useEffect(() => {
        if (chartRef.current) {
            // 初始化 Mermaid
            mermaid.initialize({ startOnLoad: true });
            // 渲染图表
            mermaid.run({
                querySelector: `.mermaid-chart`,
                callback: (svgCode: any, bindFunctions: any) => {

                    if (chartRef.current) {
                        chartRef.current.innerHTML = svgCode;
                        bindFunctions(chartRef.current);

                    }
                },
            });
        }
        setTimeout(() => {
            if (chartRef.current) {
                // domtoimage.toPng(chartRef.current)
                //     .then((dataUrl: string) => {
                //         console.log(dataUrl);
                //         // setBase64Image(dataUrl);
                //         // isMermaidBase64(dataUrl)
                //     })
                //     .catch((error: any) => {
                //         console.error('Error converting to Base64:', error);
                //     });
            }
            convertSvgToBase64()
        }, 1000);  // Delay to ensure the chart is fully rendered
    }, [chart]);
    const convertSvgToBase64 = () => {
        if (chartRef.current) {
          const svgElement = chartRef.current.querySelector('svg');
          if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const fileReader = new FileReader();
    
            fileReader.onloadend = () => {
            //   console.log(fileReader.result);
              isMermaidBase64(fileReader.result as string)
              // setBase64Image(fileReader.result as string);
            };
    
            fileReader.readAsDataURL(svgBlob);
          } else {
            console.error('SVG element not found');
          }
        }
      };
    return (
        <div className={styles.ai_image_Recommended_body}>
            <div ref={chartRef} className={`${styles.ai_image_Recommended_chart} mermaid-chart`}>
                {chart}
            </div>
        </div>
    );
};
export default MermaidChart;






