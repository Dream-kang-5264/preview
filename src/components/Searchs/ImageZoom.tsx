import { CloseOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const ImageZoom = ({ src, alt, setAiEditorData }: any) => {
    const [zoom, setZoom] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleZoomIn = () => {
        setZoom(prevZoom => prevZoom + 0.1);
    };

    const handleZoomOut = () => {
        setZoom(prevZoom => Math.max(1, prevZoom - 0.1));
    };

    const handleClick = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '2vw', height: '2vw', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20%', position: 'absolute', zIndex: '33', right: '10%', top: '5%' }}><CloseOutlined style={{ cursor: 'pointer' }} onClick={() => {
                setAiEditorData((prve: any) => ({
                    ...prve,
                    imageShow: false
                }))
            }} /></div>
            <div
                style={{
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                }}
                onClick={handleClick}
            >
                <img
                    src={src}
                    alt={alt}
                    style={{
                        transform: `scale(${isZoomed ? zoom : 1})`,
                        transition: 'transform 0.3s ease',
                        display: 'block',
                        margin: '0 auto',
                        maxWidth: '100%',
                        maxHeight: '80vh',
                    }}
                />
            </div>
            {isZoomed && (
                <div style={{ textAlign: 'center', position: 'absolute', left: '50', bottom: '2vw',display:'flex',color:'#ccc',fontSize:'1.5vw' }}>
                    <ZoomInOutlined onClick={handleZoomIn} />
                    <ZoomOutOutlined onClick={handleZoomOut} />
                </div>
            )}
        </div>
    );
};

export default ImageZoom;
