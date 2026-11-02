import { EnquiryDetail } from "@/components/EnquiryManagement";

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EnquiryDetail id={id} />;
}
