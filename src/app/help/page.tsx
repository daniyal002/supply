import { HelpList } from "@/components/Help/HelpList";
import { prefetchPosts } from "@/lib/react-query/prefetch";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();
  await prefetchPosts(queryClient);

  return (
    <div className="p-6">
      <HydrationBoundary state={dehydrate(queryClient)}>

        <HelpList />
      </HydrationBoundary>
    </div>
  );
}
