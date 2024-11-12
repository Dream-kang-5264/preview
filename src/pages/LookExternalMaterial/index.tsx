
import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { Spin } from 'antd';
import { useParams } from 'umi';
import { baseUrl } from '@/utils/process';

function App() {
    const { id } = useParams<{ id: string }>();
    const [docxUrl, setDocxUrl] = useState('');
    const containerRef = useRef<any>(null);
    const [loadingShow, setLoadingShow] = useState(true);
    let [blob, setBlob] = useState()
    useEffect(() => {
        document.title = "智笔写作系统";
        if (id) {
            // console.log(id)
            getDocumentDocx();
        }
    }, [id]);

    const getDocumentDocx = async () => {
        if (id) {
            try {
                const response = await fetch(`${baseUrl}/api/v1/crawler/without/external/material/preview`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        "token": localStorage.getItem('token') || '',
                    },
                    body: JSON.stringify({ external_id: id })
                });


                if (response.ok) {
                    const blob = await response.blob();
                    setBlob(blob)
                    const contentType = response.headers.get('Content-Type');
                    console.log(blob);
                    if (contentType === 'application/pdf') {
                        const url = URL.createObjectURL(blob);
                        setDocxUrl(url);
                    } else if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        // 清空之前的内容
                        containerRef.current.innerHTML = '';
                        await renderAsync(blob, containerRef.current);
                    }
                    // else if (contentType === 'application/json') {
                    //     containerRef.current.innerHTML = '';
                    //     await renderAsync(blob, containerRef.current);
                    // }
                    else {
                        console.error('Unsupported file type');
                    }
                    setLoadingShow(false);
                } else {
                    console.error('Failed to fetch document');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }
    };


    return (
        <div style={{ overflow: 'auto' }}>
            {loadingShow && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spin size="large" />
                </div>
            )}
            {docxUrl && (
                <iframe width={'100%'} height={'680vw'} style={{ marginTop: '1vw' }} src={docxUrl}></iframe>
            )}
            <div ref={containerRef} style={{ height: '100vh', }}></div>

        </div>
    );
}

export default App












