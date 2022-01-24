import React from "react";
import styles from './dashboard.module.scss';
import Countup from 'react-countup'
const Dashboard = ({type, data, mapType}) => {

    return(
        <>
            { type === 'total' ? 
            <>
                <div className={styles['pro-container']}>
                    <div className={styles['percentage']}>  
                            {mapType === 'pro' ? 
                            <>
                                <div className={styles['percentage__title']}> Total Revenue </div>
                                <div style={{color: '#F2F12D'}} className={styles['percentage__number']}><Countup  end={data.totalRevPercentage}/>%</div>
                                <div className={styles['percentage__subtext']}> Pro Users </div>
                                <div className={styles['percentage__subtext']}><em> ({data.totalUsers})</em> </div>
                                
                            </>
                            :
                            <>
                                <div  className={styles['percentage__title']}> Total Users </div>
                                <Countup style={{ color: '#94f80b' }} className={styles['percentage__number']} end={data.totalUsers} />
                            </>
                            }
                    </div>
                    <div className={styles['gender']}>
                            <div className={styles['gender__inner']}>
                                <div className={styles['gender__title']}>Total Female Users </div>
                                <Countup 
                                style={mapType === 'pro' ? { color: 'rgb(217 155 32)' } : { color: 'rgb(82 195 39)' }}
                                className={styles['gender__number']} end={data.female} />
                            </div>
                            <div style={{ 'border': '.25px solid #333','width':'10rem'}}></div>
                            <div className={styles['gender__inner']}>
                                <div className={styles['gender__title']}>Total Male Users </div>
                                <Countup
                                style={mapType === 'pro' ? { color: 'rgb(217 155 32)' } : { color: 'rgb(82 195 39)' }}
                                className={styles['gender__number']} end={data.male} />
                            </div>
                    </div>
                    <div className={styles['percentage']}>
                            <div className={styles['percentage__title']}>Total Matches</div>
                            <Countup 
                            style={mapType === 'pro' ? { color: '#F2F12D' }:{ color: '#94f80b' }}
                            className={styles['percentage__number']} end={data.total_matches} />
                    </div>
                </div>
            </>
            :
            <>
                <div className={styles['region-container']}>
                    <div className={styles['area-name']}>{data.areaName}</div>
                    {mapType === 'pro' ?
                        <>
                            <div className={styles['rev-percentage']}>
                                <div style={{ color: 'rgb(217 155 32)' }} className={styles['rev-percentage__number']}>{data.revPercentage}% </div>
                                <div className={styles['rev-percentage__text']}>revenue</div>
                            </div>
                        </>
                        :
                        <>
                            <div className={styles['rev-percentage']}>
                                <div style={{ color: 'rgb(82 195 39)' }} className={styles['rev-percentage__number']} >{data.totalUsers}</div>
                                <div className={styles['rev-percentage__text']}> Users </div>                                    
                            </div>
                            
                        </>
                    }
                    <div className={styles['region-info-container']}>
                        <div className={styles['region-info']}>
                            <div className={styles['region-info__text']}>Female Users:</div>
                            <div style={mapType === 'pro' ? { color: '#F2F12D' } : { color: '#94f80b' }}
                                className={styles['region-info__number']}>{data.female}</div>
                        </div>
                        <div className={styles['region-info']}>
                            <div className={styles['region-info__text']}>Male Users:</div>
                            <div style={mapType === 'pro' ? { color: '#F2F12D' } : { color: '#94f80b' }}
                            className={styles['region-info__number']}>{data.male}</div>
                        </div>
                        <div className={styles['region-info']}>
                            <div className={styles['region-info__text']}>Matches:</div>
                            <div style={mapType === 'pro' ? { color: '#F2F12D' } : { color: '#94f80b' }}
                            className={styles['region-info__number']}>{data.totalMatches}</div>
                        </div>
                    </div>
                </div>
            </>
            }
        </>
    )
}

export default Dashboard;
