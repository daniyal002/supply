import React from 'react'
import Order from './AdminOrder'

export default function OrderPage({ params }: { params: { slug: string } }) {
  return (
    <div><Order type='Добавить' orderid={params.slug}/></div>
  )
}
