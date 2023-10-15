import React from 'react'
import styles from './Card.module.css'

export const Card = ({text, number}) => {
  return (
    <div className={styles.card}>
        <p className={styles.number}>{number}</p>
        <p className={styles.text}>{text}</p>
    </div>
  )
}
