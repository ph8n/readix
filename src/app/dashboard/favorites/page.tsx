export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Favorites</h1>
        <p className="text-muted-foreground">Your favorite documents will appear here</p>
      </div>
      
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl opacity-20">⭐</div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-semibold text-foreground">No favorites yet</h3>
            <p className="text-sm text-muted-foreground">
              Mark documents as favorites to see them here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}