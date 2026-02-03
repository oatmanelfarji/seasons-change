import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
          <h1>Seasons Change 1</h1>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <h1>Seasons Change 2</h1>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          <h1>Seasons Change 3</h1>
        </div>
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  )
}
