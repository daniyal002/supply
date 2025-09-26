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
  selectedHelp: IHelp | null;
  onSelectHelp: (item: IHelp | null) => void;
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
  selectedHelp,
  onSelectHelp,
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
      {!selectedHelp && (
        <Input.Search
          placeholder="Поиск видеоуроков"
          allowClear
          onSearch={onSearch}
          className={styles.search}
        />
      )}

      {!selectedHelp && (
        <div className={styles.countHelpData}>
          <p>Количество видеоуроков: </p>
          <span>{countHelpData}</span>
        </div>
      )}
      <div className={selectedHelp ? styles.selectedHelp : styles.helpList}>
        {selectedHelp ? (
          <HelpCard
            item={selectedHelp}
            onClick={() => onSelectHelp(null)}
            type="single"
          />
        ) : (
          items.map((item, index) => (
            <HelpCard
              item={item}
              key={index}
              onClick={() => onSelectHelp(item)}
              type="group"
            />
          ))
        )}
      </div>

      {!selectedHelp && total > pageSize && (
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
