
import { HelpList } from "@/components/Help/HelpList";
import { prefetchPosts } from "@/lib/react-query/prefetch";
import { LeftOutlined } from "@ant-design/icons";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Button } from "antd";
import Link from "next/link";

export default async function Page() {
  const queryClient = new QueryClient();
  await prefetchPosts(queryClient);

  return (
    <div className="p-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
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
        <HelpList />
      </HydrationBoundary>
    </div>
  );
}
