"use client"

export function Stats() {
  const stats = [
    { value: "140+", label: "Successful Projects" },
    { value: "35+", label: "Team Members" },
    { value: "60+", label: "Happy Clients" },
    { value: "100%", label: "Client Satisfaction" }
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Our Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</span>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 