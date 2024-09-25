import React, { FC } from 'react'
import { ICategories } from '../../types/types'
import { Button } from '../button/Button'
import { Modal } from '../Modal/ModalCategory'
import styles from './categories.module.css'

interface ICategoriesProps {
	categories: ICategories[]
	setCategory: React.Dispatch<React.SetStateAction<ICategories[]>>
	setNameOfCategory: React.Dispatch<React.SetStateAction<string>>
}

const Categories: FC<ICategoriesProps> = ({
	categories,
	setCategory,
	setNameOfCategory,
}) => {
	const [isModal, setIsModal] = React.useState<boolean>(false)
	const CATEGORY_ID = React.useRef<number>(0)

	function selectCategory(e: React.MouseEvent<HTMLUListElement>) {
		const target = e.target as HTMLElement | null

		if (!target) return

		const tagName = target.tagName
		if (tagName === 'LI' && target.textContent) {
			setNameOfCategory(target.textContent)
		}
	}

	function searchCategory(name: string, categories: ICategories[]) {
		return categories.find((item) => item.name === name)
	}

	function removeCategory(e: React.MouseEvent<HTMLImageElement>) {
		const target = e.target as HTMLImageElement;
 		const parentLi = target.closest('li');

		if (!parentLi) return
	
		const nameCategory = parentLi.querySelector('span')?.textContent ?? ''
		const category = searchCategory(nameCategory, categories)

		setCategory((prev) => prev.filter((item) => item.id !== category?.id))
		setNameOfCategory('')
	}

	return (
		<div className={styles.categories}>
			<h2 className={styles.title}>Категории</h2>
			<ul className={styles.list} onClick={selectCategory}>
				{categories
					? categories.map(item => {
							return(
								<li key={item.id}>
									<span>{item.name}</span>
									<img 
									src="/deleteIcon.svg" 
									alt="deleteIcon" 
									width='24' 
									height='24'
									onClick={removeCategory}
									/>
								</li>
							)
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

				<Button type='button' onClickFunc={setIsModal} valueFunc={true}>
					Добавить категорию
				</Button>
			</div>
		</div>
	)
}

export default Categories
