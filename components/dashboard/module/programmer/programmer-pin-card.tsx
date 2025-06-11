import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CirclePower, Lock } from "lucide-react"

interface ProgrammerPinCardProps {
  pin: {
    id: string
    name: string
    status: "active" | "inactive" | "auto"
  }
}

export function ProgrammerPinCard({ pin }: ProgrammerPinCardProps) {
  const getStatusColor = () => {
    switch (pin.status) {
      case "active":
        return "bg-wave-buttonOn text-white status-glow-active"
      case "auto":
        return "bg-wave-buttonAuto text-wave-deepBlue status-glow-auto"
      case "inactive":
      default:
        return "bg-wave-buttonOff text-white"
    }
  }

  const getStatusText = () => {
    switch (pin.status) {
      case "active":
        return "ON"
      case "auto":
        return "AUTO"
      case "inactive":
      default:
        return "OFF"
    }
  }

  return (
    <Card className="bg-wave-deepBlue/50 border-wave-lightBlue/30 overflow-hidden backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-wave-sand">{pin.name}</h3>
          <Badge variant="outline" className="bg-wave-deepBlue/50 text-wave-sand border-wave-lightBlue/30">
            <Lock className="h-3 w-3 mr-1" />
            View Only
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div
            className={`flex items-center justify-center p-2 rounded-md ${
              pin.status === "active"
                ? "bg-wave-buttonOn/20 text-wave-buttonOn"
                : "bg-wave-deepBlue/30 text-wave-sand/50"
            }`}
          >
            ON
          </div>
          <div
            className={`flex items-center justify-center p-2 rounded-md ${
              pin.status === "auto"
                ? "bg-wave-buttonAuto/20 text-wave-buttonAuto"
                : "bg-wave-deepBlue/30 text-wave-sand/50"
            }`}
          >
            AUTO
          </div>
          <div
            className={`flex items-center justify-center p-2 rounded-md ${
              pin.status === "inactive"
                ? "bg-wave-buttonOff/20 text-wave-buttonOff"
                : "bg-wave-deepBlue/30 text-wave-sand/50"
            }`}
          >
            OFF
          </div>
        </div>
      </CardContent>
      <CardFooter className={`p-2 flex items-center justify-center ${getStatusColor()}`}>
        <div className="flex items-center gap-2">
          <CirclePower className="h-4 w-4" />
          <span className="font-medium">{getStatusText()}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
