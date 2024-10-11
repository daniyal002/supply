import React from 'react'
import Route from './Route'

export default function page({ params }: { params: { slug: string } }) {
  return (
    <div><Route routeId={params.slug}/></div>
  )
}
