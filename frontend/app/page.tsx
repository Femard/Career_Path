export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">
          Dynamic Career Pathing SaaS
        </h1>
        <p className="text-lg mb-4">
          Navigate your career with AI-powered trajectory planning.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Plan A</h2>
            <p className="text-sm text-gray-600">Optimal career path based on ROI</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Plan B</h2>
            <p className="text-sm text-gray-600">Alternative path with lower risk</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Plan C</h2>
            <p className="text-sm text-gray-600">Fast-track option with higher cost</p>
          </div>
        </div>
      </div>
    </main>
  )
}
