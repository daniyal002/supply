
import AdminPost from './AdminRoute'
import style from './page.module.scss'

export default function Posts(){
    return(
        <div className={style.posts}>
            <AdminPost/>
        </div>
    )
}