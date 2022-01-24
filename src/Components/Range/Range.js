import React from 'react';
import styles from './range.module.scss';

const Range = ({mapType}) =>{           
    return(
        <div className={styles['color-container']}>
            {mapType==="pro"?
            <>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#F2F12D'}} />
                    <div className={styles['range-row__number']}>0</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#EED322' }} />
                    <div className={styles['range-row__number']}>50</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#DA9C20' }} />
                    <div className={styles['range-row__number']}>80</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#B86B25' }} />
                    <div className={styles['range-row__number']}>120</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#8B4225' }} />
                    <div className={styles['range-row__number']}>160</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#723122' }} />
                    <div className={styles['range-row__number']}>200+</div>
                </div>
            </>
            :
            <>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#94f80b' }} />
                    <div className={styles['range-row__number']}>90</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#93ff00' }} />
                    <div className={styles['range-row__number']}>120</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#75e41c' }} />
                    <div className={styles['range-row__number']}>150</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#54c527' }} />
                    <div className={styles['range-row__number']}>180</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#40b02a' }} />
                    <div className={styles['range-row__number']}>220</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#2c9b2a' }} />
                    <div className={styles['range-row__number']}>250</div>
                </div>
                <div className={styles['range-row']}>
                    <div className={styles['range-row__color']} style={{ backgroundColor: '#198729' }} />
                    <div className={styles['range-row__number']}>280+</div>
                </div>
            </>
                
            }
        </div>
    );
}

export default Range;