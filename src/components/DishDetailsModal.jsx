import { useEffect, useRef } from 'react'

export default function DishDetailsModal({ dish, onClose }) {
  const panel = useRef(null)
  useEffect(() => {
    if (!dish) return
    const previous = document.activeElement
    const onKey = event => event.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    addEventListener('keydown', onKey)
    requestAnimationFrame(() => panel.current?.focus())
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', onKey); previous?.focus?.() }
  }, [dish, onClose])
  if (!dish) return null
  const ingredients = Array.isArray(dish.ingredients) ? dish.ingredients : String(dish.ingredients || '').split(',').map(x => x.trim()).filter(Boolean)
  return <div className="dish-modal" role="dialog" aria-modal="true" aria-labelledby="dish-title" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <article className="dish-modal__panel" ref={panel} tabIndex="-1">
      <button className="dish-modal__close" onClick={onClose} aria-label="Close dish details">Close <span>×</span></button>
      <div className="dish-modal__image">{dish.image && <img src={dish.image} alt={dish.name} />}</div>
      <div className="dish-modal__content"><p className="eyebrow">{dish.category} · MARÉ</p><h2 id="dish-title">{dish.name}</h2><p className="dish-modal__description">{dish.description}</p>
        <div className="dish-modal__meta"><span>{dish.price || 'Market'}</span>{dish.dietary && <span>{dish.dietary}</span>}</div>
        <div className="dish-modal__ingredients"><p className="eyebrow">Ingredients</p><ul>{ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul></div>
        {dish.preparation && <div className="dish-modal__preparation"><p className="eyebrow">From the kitchen</p><p>{dish.preparation}</p></div>}
        {dish.allergens?.length > 0 && <p className="dish-modal__allergens"><b>Allergens:</b> {dish.allergens.join(', ')}. Please tell our team about any allergy.</p>}
      </div>
    </article>
  </div>
}
