export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl opacity-20">⚙️</div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-semibold text-foreground">Settings coming soon</h3>
            <p className="text-sm text-muted-foreground">
              User preferences and account settings will be available here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}