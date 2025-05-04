
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Habit, HabitFrequency } from "@/types/habit";
import { generateId, getTodayString } from "@/utils/habitUtils";
import { Plus } from "lucide-react";

interface AddHabitDialogProps {
  onAddHabit: (habit: Habit) => void;
}

const HABIT_ICONS = ["🏃‍♂️", "💧", "📚", "🧘‍♂️", "🥗", "💤", "💪", "🧠", "🎸", "✍️"];
const HABIT_TEMPLATES = [
  { name: "Drink Water", description: "Stay hydrated throughout the day", icon: "💧" },
  { name: "Read", description: "Read for at least 20 minutes", icon: "📚" },
  { name: "Exercise", description: "Get your body moving", icon: "🏃‍♂️" },
  { name: "Meditate", description: "Practice mindfulness", icon: "🧘‍♂️" },
  { name: "Healthy Meal", description: "Focus on nutrition", icon: "🥗" },
];

export default function AddHabitDialog({ onAddHabit }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🏃‍♂️");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newHabit: Habit = {
      id: generateId(),
      name,
      description: description || undefined,
      icon,
      frequency,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
      trackingData: []
    };
    
    onAddHabit(newHabit);
    resetForm();
    setOpen(false);
  };
  
  const selectTemplate = (template: typeof HABIT_TEMPLATES[0]) => {
    setName(template.name);
    setDescription(template.description);
    setIcon(template.icon);
  };
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setIcon("🏃‍♂️");
    setFrequency("daily");
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new habit</DialogTitle>
            <DialogDescription>
              Start building a new positive habit. What would you like to track?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-4 mb-2">
                <h4 className="text-sm font-medium mb-2">Quick Start Templates</h4>
                <div className="flex flex-wrap gap-2">
                  {HABIT_TEMPLATES.map((template) => (
                    <Button 
                      key={template.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selectTemplate(template)}
                    >
                      <span className="mr-1">{template.icon}</span> {template.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="col-span-4 grid gap-2">
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input
                  id="habit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Morning Run"
                  required
                />
              </div>
              
              <div className="col-span-4 grid gap-2">
                <Label htmlFor="habit-description">Description (optional)</Label>
                <Textarea
                  id="habit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this habit important to you?"
                  rows={3}
                />
              </div>
              
              <div className="col-span-4 grid gap-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {HABIT_ICONS.map((emoji) => (
                    <Button
                      key={emoji}
                      type="button"
                      variant={icon === emoji ? "default" : "outline"}
                      size="sm"
                      className="w-9 h-9 p-0"
                      onClick={() => setIcon(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="col-span-4 grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={frequency} 
                  onValueChange={(value) => setFrequency(value as HabitFrequency)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="How often?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
