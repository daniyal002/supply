import AdminStorage from "./AdminStorage";
import style from "./page.module.scss";

export default function Storage() {
  return (
    <div className={style.storage}>
      <AdminStorage />
    </div>
  );
}