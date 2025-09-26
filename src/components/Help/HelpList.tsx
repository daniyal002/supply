// HelpList.tsx
"use client";
import { useHelpData } from "@/hook/helpHook";
import { useMemo, useState } from "react";
import { matchesSearch } from "@/helper/TableFilters/Filters/filterBySearchText";
import { IHelp } from "@/interface/help";
import HelpListView from "./HelpListView";
import Link from "next/link";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

export function HelpList() {
  const { data: helpData, isError, isLoading, error } = useHelpData();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHelp, setSelectedHelp] = useState<IHelp | null>(null);
  const pageSize = 6;

  const filteredHelpData = useMemo(() => {
    if (!searchText) return helpData;
    const lowerCaseSearchText = searchText.toLowerCase();
    return helpData?.filter((item) =>
      matchesSearch(item.help_name, lowerCaseSearchText) || matchesSearch(item.note, lowerCaseSearchText)
    );
  }, [helpData, searchText]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredHelpData?.slice(
    startIndex,
    startIndex + pageSize
  );

  const countHelpData = useMemo(() => {
    return filteredHelpData?.length || 0;
  }, [filteredHelpData]);


  return (
    <>
      {!selectedHelp && (
        <Link href="/" passHref>
          <Button
            type="primary"
            icon={<LeftOutlined />}
            style={{
              marginBottom: 16,
              backgroundColor: "#678098",
              borderColor: "#678098",
              fontWeight: 600,
            }}
          >
            Назад
          </Button>
        </Link>
      )}

      <HelpListView
        items={paginatedData || []}
        total={filteredHelpData?.length || 0}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={setSearchText}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        selectedHelp={selectedHelp}
        onSelectHelp={setSelectedHelp}
        countHelpData={countHelpData}
      />
    </>
  );
}
