// HelpListView.tsx
import { Input, Spin, Pagination } from "antd";
import styles from "./HelpList.module.scss";
import HelpCard from "./HelpCard";
import { IHelp } from "@/interface/help";

interface Props {
  items: IHelp[];
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearch: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  countHelpData: number;
}

export default function HelpListView({
  items,
  total,
  pageSize,
  currentPage,
  onPageChange,
  onSearch,
  isLoading,
  isError,
  errorMessage,
  countHelpData,
}: Props) {
  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spin spinning />
      </div>
    );
  }

  if (isError) {
    return <div className={styles.errorWrapper}>{errorMessage}</div>;
  }

  return (
    <div className={styles.helpWrapper}>
      <Input.Search
        placeholder="Поиск видеоуроков"
        allowClear
        onSearch={onSearch}
        className={styles.search}
      />

      <div className={styles.countHelpData}>
        <p>Количество видеоуроков: </p>
        <span>{countHelpData}</span>
      </div>
      <div className={styles.helpList}>
        {items.map((item, index) => (
          <HelpCard item={item} key={index} />
        ))}
      </div>

      {total > pageSize && (
        <div className={styles.paginationWrapper}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
