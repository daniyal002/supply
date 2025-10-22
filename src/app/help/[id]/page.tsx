import HelpItem from "@/components/Help/HelpItem";

export default function Page({ params }: { params: { id: string } }) {
  return <HelpItem help_id={Number(params.id)} />;
}
