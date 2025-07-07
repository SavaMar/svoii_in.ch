import { EditProfileClient } from "./EditProfileClient";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProfileClient id={id} />;
}
