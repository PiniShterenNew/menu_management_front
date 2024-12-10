import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faBars } from '@fortawesome/free-solid-svg-icons';
import Settings from '../Settings';
import Logo from "../../assets/logo.png";
import "./topBar.css";
import { Image } from 'antd';

export default function TopBar({ drawerVisible, setDrawerVisible, isMobile }) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="top-bar">
            <Image className='logo-mobile' src={Logo} alt='GainGuard' preview={false} />
            <div>
                <button className="profile-button">
                    <FontAwesomeIcon icon={faUser} />
                </button>
                {/* <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
                    <FontAwesomeIcon icon={faCog} />
                </button> */}
                {isMobile && (
                    <button className="menu-button" onClick={() => setDrawerVisible(!drawerVisible)}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                )}
                {/* {<Settings flag={showSettings} setFlag={() => setShowSettings(false)} />} */}
            </div>
        </div>
    );
}
