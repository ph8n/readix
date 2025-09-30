interface ReadPageProps {
  params: Promise<{ id: string }>
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-6">PDF Reader</h1>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-lg">Reading document with ID: <code className="bg-muted px-2 py-1 rounded">{id}</code></p>
          <p className="text-muted-foreground mt-4">This is where our PDF reader will be displayed.</p>
        </div>
      </div>
    </div>
  )
}