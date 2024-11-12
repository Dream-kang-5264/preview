import { Modal } from 'antd'
import React from 'react'
export type FieldType = {
    error_word?: string;
    suggestion_word?: string;
    context?: string;
    exception_context?: string;
    error_reason?: string;
    reference_description?: string;
    reference_link?: string;
    added_time?: string;
    sensitive_word?: string;
    sensitive_reason?: string;
    mistake_word?: string;
    name?: string;
    position?: string;
    original_unit?: string;
    source?: string;
    added_by?: string;
    sort_order?: string;
    rank?: string;
    watchword?: string;
    phrase?: string;
    speech_number?: string;
    speech?: string;
    full_name?: string;
    short_name?: string;
    term?: string;
    category?: string;
    definition?: string;
};

function NewModal({ modalOpen, handleOk, handleCancel, modalForm, modalTitle }: any) {
    return (
        <Modal title={modalTitle} open={modalOpen} onOk={handleOk} onCancel={handleCancel}>
            {modalForm}
        </Modal>
    )
}

export default NewModal