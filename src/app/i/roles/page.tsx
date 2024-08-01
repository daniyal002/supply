import AdminRole from './AdminRole'
import style from './page.module.scss'

export default function Roles(){
    return(
        <div className={style.roles}>
            <AdminRole/>
        </div>
    )
}