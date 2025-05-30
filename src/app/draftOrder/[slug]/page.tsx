import React from 'react'
import Order from './DraftOrder'

export default function OrderPage({ params }: { params: { slug: string } }) {
  return (
    <div><Order type='Добавить' draftOrderid={params.slug}/></div>
  )
}
