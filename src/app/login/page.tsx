import { Login } from "./Login";
import style from "./page.module.scss";

export default function LoginPage() {
  return (
    <div className={style.loginPage}>
      <h2 className={style.loginLogo} data-text="Снабжение">Снабжение</h2>
      <p className={style.loginText}>Войдите в свою учетную запись</p>
      <Login />
    </div>
  );
}
