import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { EnumOrderTypes, IOrderItem } from "@/interface/orderItem";
import { IProductUnit } from "@/interface/product";

export const exportOrderToExcel = async (order: IOrderItem, products:IProductUnit[]) => {
  if (!order.order_products?.length) {
    console.warn("В заявке нет товаров");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Заявка ${order.order_number}`);

  // --- Стили ---
  const corporateColor = "bfbfbf"; // без #
  const headerFill: ExcelJS.FillPattern = {
    type: "pattern", // 👈 теперь это литерал, а не string
    pattern: "solid",
    fgColor: { argb: corporateColor },
  };
  const whiteFont = { type: "pattern", color: { argb: "000000" }, bold: true };
  const borderStyle: ExcelJS.Border = {
    style: "thin", // 👈 теперь это литерал
    color: { argb: "000000" },
  };

  // --- Данные для шапки ---
  const headerData = [
    ["Номер заявки", order.order_number],
    ["Тип заявки", order.order_type === EnumOrderTypes.WAREHOUSE ? "На склад" : "На закупку"],
    [
      "Дата создания",
      order.created_at ? new Date(order.created_at).toLocaleString() : "",
    ],
    ["Статус", order.order_status?.status_name || ""],
    ["Автор", order.order_author_name || ""],
    ["Подразделение", order.department?.department_name || ""],
    ["Сотрудник/Кабинет", order.buyer?.buyer_name || ""],
    ["Склад", order.storage?.storage_name || ""],
    ["Группа товара", order.product_group?.product_group_name || ""],
    ["Примечание", order.note || ""],
  ];

  // --- Отрисовка шапки ---
  headerData.forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);

    // Левая ячейка — цветная
    const leftCell = row.getCell(1);
    leftCell.font = whiteFont;
    leftCell.alignment = { vertical: "middle", horizontal: "left" };
    leftCell.border = {
      top: borderStyle,
      left: borderStyle,
      bottom: borderStyle,
      right: borderStyle,
    };

    // Правая ячейка — белая
    const rightCell = row.getCell(2);
    rightCell.alignment = { vertical: "middle", horizontal: "left" };
    rightCell.border = {
      top: borderStyle,
      left: borderStyle,
      bottom: borderStyle,
      right: borderStyle,
    };
  });

  // Пустая строка
  sheet.addRow([]);

  // --- Заголовки таблицы товаров ---
  const productHeader = [
    "Название товара",
    "Сотрудники",
    "Ед. изм.",
    "Кол-во",
    "Общий остаток",
    "Артикул",
    "Добавленный товар",
    "Ссылка на добавленный товар",
    "Примечание",
  ];
  const headerRow = sheet.addRow(productHeader);

  headerRow.eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = whiteFont;
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: borderStyle,
      left: borderStyle,
      bottom: borderStyle,
      right: borderStyle,
    };
  });

  // --- Данные товаров ---
  order.order_products.forEach((product) => {
    const row = sheet.addRow([
      product.product?.product_name || "",
      product.buyers?.map((buyers) => buyers.buyer_name).join(", ") || "",
      product.unit_measurement?.unit_measurement?.unit_measurement_name || "",
      product.product_quantity,
      products.find(products => products.product_id === product.product.product_id)?.remainder || "",
      product.product.product_article || "",
      product.order_product_name || "",
      product.order_product_link || "",
      product.note || "",
    ]);

    row.eachCell((cell) => {
      cell.border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
    });
  });

  // Автоширина колонок
  sheet.columns.forEach((col) => {
    if (!col || !col.eachCell) return; // 👈 проверка на наличие метода

    let maxLength = 0;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, value.length);
    });

    col.width = maxLength + 2;
  });

  // --- Сохранение ---
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Заявка_${order.order_number}.xlsx`);
};
