import { Spin } from 'antd'
import React from 'react'

export default function Loading({ loading, children }) {
    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <Spin size="large" tip="Loading"  />
                </div>
            )}
            {children}
        </>
    )
}
