import React from "react";

// Updated type definition to match Next.js 15.3.1 requirements
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ServicePage({ params }: Props) {
  const { id } = await params;

  // In a real app, you would fetch the service data here
  // For now, just display the ID
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Сервіс {id}</h1>
      <p>Детальна інформація про сервіс буде тут.</p>
    </div>
  );
}
