'use client'

import HelpCard from "./HelpCard";
import { useHelpData } from "@/hook/helpHook";
import styles from './HelpList.module.scss'


export function HelpList() {
    const {data: helpData,isError,isLoading,error} = useHelpData()
  return (
    <div className={styles.helpList}>
      {helpData?.map((item, index) => (
         <HelpCard item={item} key={index}/>
    ))}
    </div>
  );
}
