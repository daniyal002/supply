// components/CopyFormDataButton.tsx
import { Button } from "antd";

interface CopyFormDataButtonProps {
  getValues: () => any; // Функция из react-hook-form
  fields?: {
    login?: string;
    password?: string;
    employeeLabel?: string;
    roleLabel?: string;
  };
  onCopySuccess?: (copiedText: string) => void;
  onCopyError?: (error: Error) => void;
}

export default function CopyFormDataButton({
  getValues,
  fields = {},
  onCopySuccess,
  onCopyError,
}: CopyFormDataButtonProps) {
  const handleCopy = () => {
    const values = getValues();

    // Поля по умолчанию
    const login = fields.login ? values[fields.login] : values.login;
    const password = fields.password
      ? values[fields.password]
      : values.password;
    const employeeLabel = fields.employeeLabel
      ? values.employee?.[fields.employeeLabel] || values.employee?.label
      : values.employee?.label;
    const roleLabel = fields.roleLabel
      ? values.role?.[fields.roleLabel] || values.role?.label
      : values.role?.label;

    const textToCopy = `
Логин: ${login || "-"}
Пароль: ${password || "-"}
Сотрудник: ${employeeLabel || "-"}
`.trim();

    navigator.clipboard
      ?.writeText(textToCopy)
      .then(() => {
        onCopySuccess?.(textToCopy);
      })
      .catch((err: Error) => {
        onCopyError?.(err);
      });
  };

  return (
    <Button
      type="dashed"
      icon={<span>📋</span>}
      onClick={handleCopy}
      style={{ width: "100%", marginTop: "16px" }}
    >
      Скопировать данные формы
    </Button>
  );
}
