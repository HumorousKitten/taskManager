import React, { FC } from 'react'
import { Button } from '../button/button'
import { ICategories } from '../../types/types'
import { Modal } from '../Modal/ModalCategory'
import styles from './categories.module.css'

interface ICategoriesProps {
	categories: ICategories[]
	setCategory: React.Dispatch<React.SetStateAction<ICategories[]>>
	setNameOfCategory: React.Dispatch<React.SetStateAction<string>>
}

const Categories: FC<ICategoriesProps> = ({ categories, setCategory, setNameOfCategory }) => {
	const [isModal, setIsModal] = React.useState<boolean>(false)
	const CATEGORY_ID = React.useRef<number>(0)

	function selectCategory(e: React.MouseEvent<HTMLUListElement>) {
		const target = e.target as HTMLElement | null
		
		if(!target) return

		const tagName = target.tagName
		if(tagName === 'LI' && target.textContent) {
			setNameOfCategory(target.textContent)
		}
		
	}

	return (
		<div className={styles.categories}>
			<h2 className={styles.title}>Категории</h2>
			<ul className={styles.list} onClick = {selectCategory}>
				{categories
					? categories.map(item => {
							return <li key={item.id}>{item.name}</li>
					  })
					: null}
			</ul>

			<div className={styles.addCategory}>
				{isModal ? (
					<Modal
						categories={categories}
						setCategory={setCategory}
						isModal={setIsModal}
						categoryId={CATEGORY_ID}
					/>
				) : null}

				<Button type='button' onClickFunc={setIsModal} valueFunc = {true}>Добавить категорию</Button>
			</div>
		</div>
	)
}

export default Categories
