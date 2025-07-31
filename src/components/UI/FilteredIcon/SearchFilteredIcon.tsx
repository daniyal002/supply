import { SearchOutlined } from '@ant-design/icons';
import React, { Dispatch, SetStateAction } from 'react'

interface Props{
    visibleColumnKey:string | null
    setVisibleColumnKey:Dispatch<SetStateAction<string | null>>
    filtered:boolean
}

export default function SearchFilteredIcon({filtered,setVisibleColumnKey,visibleColumnKey}:Props) {
  return (
    <span
    onClick={(e) => {
      e.stopPropagation(); // 🔒 предотвратить автоматическое закрытие сортировки
      setVisibleColumnKey((prev) => (prev === visibleColumnKey ? null : visibleColumnKey)); // ⬅️ toggle
    }}
    style={{ cursor: "pointer" }}
  >
    <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined, fontSize: "18px" }} />
  </span>
  )
}
