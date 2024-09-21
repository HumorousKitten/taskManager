import React, { FC } from 'react';
import styles from './modal.module.css'
import { ICategories } from '../../types/types';

type TErrorMessage = 'Длина имени должна быть 3-21 символ' | 'название уже существует'

interface IError {
	message: TErrorMessage | ''
	isError: boolean
}

interface IModalProps {
	categories: ICategories[]
	setCategory: React.Dispatch<React.SetStateAction<[] | ICategories[]>>
	isModal: React.Dispatch<React.SetStateAction<boolean>>
	categoryId: React.MutableRefObject<number>
}

export const Modal: FC<IModalProps> = ({categories, setCategory, isModal, categoryId}) => {
	const [error, setIsError] = React.useState<IError>({
		message: '',
		isError: false
	})
	const modalInput = React.useRef<HTMLInputElement | null>(null)

	function nameValidate(value: string): boolean {
		const categoryName: RegExp =  /^(?=.{3,21}$).+$/
		return categoryName.test(value)
	}

 

	function addCategory(value: string) {
		setCategory((prevState) => [...prevState, {
				id: categoryId.current++,
				name: value,
				tasks: []
			}]
		)
	}


	function handleClick() {
		const categoryName: string = modalInput.current?.value ?? ''
		const isUniq: ICategories | undefined  = categories.find(item => item.name === categoryName)

		if(isUniq) {
			setIsError({
				message: 'название уже существует',
				isError: true
			})
			return
		}

		if(!nameValidate(categoryName)){
			setIsError({
				message: 'Длина имени должна быть 3-21 символ',
				isError: true
			})
			return
		}

		addCategory(categoryName)
		isModal(false) 
	}

	return (
		<form className={styles.modal}>
			<label className={styles.title} htmlFor='category'>Введите название категории: </label>
			<input type="text" 
				placeholder = 'Name: ' 
				name='category' 
				required
				ref = {modalInput}
			/>
			{error.isError ? <p className={styles.incorrectValue}>{error.message}</p> : null}
			<button onClick={handleClick} type='button'>save</button>
		</form>
	);
}

