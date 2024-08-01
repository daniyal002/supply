
import AdminUser from './AdminUser'
import style from './page.module.scss'

export default function Users(){
    return(
        <div className={style.users}>
            <AdminUser />
        </div>
    )
}