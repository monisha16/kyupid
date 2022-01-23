import React from "react";
import styles from './header.module.scss';

const Header = (props) =>{
    return(
        <div className={styles['header']}>
            <div className={styles['header__options']}>
                <div
                    style={props.mapType === 'pro' ? { color: '#F2F12D' } : { color: '#a3a3a33b' }}
                    onClick={() => props.setMapType('pro')}
                >
                    Revenue Data
                </div>
                <div
                    style={props.mapType === 'general' ? { color: '#94f80b' } : { color: '#a3a3a33b' }}
                    onClick={() => props.setMapType('general')}
                >
                    User Data
                </div>
            </div>
        </div>
    );
}
export default Header;