import React,{useState} from "react";
import styles from './header.module.scss';

const Header = (props) =>{
    
    return(
        <div className={styles['header']}>
            <div className={styles['header__logo']}> Kyupid </div>
            <div className={styles['header__options']}>
                <div
                    style={props.mapType === 'revenue' ? { borderBottom: '1.5px solid green' } : { borderBottom: 'transparent' }}
                    onClick={() => props.setMapType('revenue')}
                >
                    Revenue Data
                </div>
                <div
                    style={props.mapType === 'user' ? { borderBottom: '1.5px solid green' } : { borderBottom: 'transparent' }}
                    onClick={() => props.setMapType('user')}
                >
                    User Data
                </div>
            </div>
        </div>
    );
}
export default Header;