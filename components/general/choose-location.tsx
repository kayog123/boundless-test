import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ChooseLocationProps {
    className?: string
    value?: string
    onChange?: (value: string) => void
    onBlur?: React.FocusEventHandler<HTMLDivElement>
    name?: string
}

export default function ChooseLocation({ className, value = "location", onChange, onBlur }: ChooseLocationProps) {
    return (
    <div onBlur={onBlur}>
        <Tabs value={value} onValueChange={onChange} className={cn("w-[400px]", className)}>
            <TabsList>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="airport">Airport</TabsTrigger>
            </TabsList>
        </Tabs>
    </div>)
}
