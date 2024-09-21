import { FC } from 'react'
import styles from './button.module.css'

interface IButtonProps {
	type: "submit" | "reset" | "button" | undefined
	onClickFunc: React.Dispatch<React.SetStateAction<boolean>>
	valueFunc: boolean
	children?: React.ReactNode
}

export const Button: FC<IButtonProps> = ({type, onClickFunc, valueFunc, children}) => {
	return <button type = {type} className={styles.btn} onClick={() => onClickFunc(valueFunc)}>{children}</button>;
}
 

