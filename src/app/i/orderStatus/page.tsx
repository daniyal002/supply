
import AdminOrderStatus from './AdminOrderStatus'
import style from './page.module.scss'

export default function Posts(){
    return(
        <div className={style.orderStatus}>
            <AdminOrderStatus/>
        </div>
    )
}