'use client';

import { IPost } from "@/interface/post";
import { Button, Space, Table } from "antd";
import { toast } from "sonner";
import { useDeletePostMutation } from "@/hook/postHook";
import { useSearch } from "@/helper/TableFilters/hook/useSearch";
import SearchFilter from "@/helper/TableFilters/Filters/SearchFilter";
import { SearchOutlined } from "@ant-design/icons";
import { Key } from "react";
import { filterBySearchText } from "@/helper/TableFilters/Filters/filterBySearchText";
import Highlighter from "react-highlight-words";

interface PostTableProps {
  postData: IPost[] | undefined;
  onEdit: (id: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({ postData, onEdit }) => {
  const { mutate: deletePostMutation } = useDeletePostMutation();
  const { searchText, searchedColumn, searchInput, handleSearch, handleReset } = useSearch();

  const columns = [
    {
      title: "ID",
      dataIndex: "post_id",
      key: "post_id",
    },
    {
      title: "Должность",
      dataIndex: "post_name",
      key: "post_name",
      filterDropdown: (props:any) => (
        <SearchFilter
          {...props}
          searchText={searchText}
          searchedColumn={searchedColumn}
          dataIndex="post_name"
          searchInput={searchInput}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value:boolean|Key, record:IPost) => {
        const searchValue = (value as string).toLowerCase();
        const post_name = record.post_name.toString().toLowerCase();

        return filterBySearchText(searchValue, post_name);
      },
      render: (text:string) =>
        searchedColumn === "post_name" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: IPost) => (
        <Space size="middle">
          <Button type="dashed" onClick={() => onEdit(record.post_id as number)}>
            Изменить
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              toast.error("Вы точно хотите удалить должность ?", {
                style: {
                  color: "red",
                },
                action: {
                  label: "Удалить",
                  onClick: () => deletePostMutation(record),
                },
              })
            }
          >
            Удалить
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = postData?.map((post) => ({
    ...post,
    key: post.post_id, // Ensure each item has a unique key
  }));

  return <Table dataSource={dataSource} columns={columns} />;
};

export default PostTable;
