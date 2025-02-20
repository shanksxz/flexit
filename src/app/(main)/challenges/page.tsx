import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const challenges = [
  {
    title: "30-Day Push-up Challenge",
    description: "Build upper body strength with daily push-ups",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Intermediate",
    participants: 10234,
    duration: "30 days",
  },
  {
    title: "Squat Master Challenge",
    description: "Perfect your squat form and build leg strength",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Beginner",
    participants: 8567,
    duration: "14 days",
  },
  {
    title: "Core Crusher Challenge",
    description: "Strengthen your core with daily exercises",
    image: "/placeholder.svg?height=200&width=300",
    difficulty: "Advanced",
    participants: 6789,
    duration: "21 days",
  },
]

export default function ChallengesPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Available Challenges</h1>
        <p className="text-muted-foreground">Join a challenge and start your fitness journey today</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.title} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image src={challenge.image || "/placeholder.svg"} alt={challenge.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Difficulty</p>
                  <p className="font-medium">{challenge.difficulty}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{challenge.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Participants</p>
                  <p className="font-medium">{challenge.participants.toLocaleString()}</p>
                </div>
              </div>
              <Button className="w-full">Join Challenge</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

