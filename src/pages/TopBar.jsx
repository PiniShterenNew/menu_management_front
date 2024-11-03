import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import Settings from './Settings';
import "./topBar.css";

export default function TopBar({ drawerVisible, setDrawerVisible, isMobile }) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="top-bar">
            {isMobile && (
                <button className="menu-button" onClick={() => setDrawerVisible(!drawerVisible)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            )}
            <button className="profile-button">
                <FontAwesomeIcon icon={faUser} />
            </button>
            <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
                <FontAwesomeIcon icon={faCog} />
            </button>
        </div>
    );
}
