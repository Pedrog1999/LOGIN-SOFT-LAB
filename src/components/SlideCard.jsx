import React from 'react'

export default function SlideCard({ slide, exiting, exitDirection }) {
  if (!slide) return null

  return (
    <div className={`slide-card ${exiting ? `slide-card--exiting slide-card--${exitDirection}` : ''}`}>
      {slide.isLogin ? null : (
        <>
          <h1 className="slide-title">{slide.title}</h1>
          <h2 className="slide-subtitle">{slide.subtitle}</h2>
          <p className="slide-body">{slide.body}</p>
        </>
      )}
    </div>
  )
}