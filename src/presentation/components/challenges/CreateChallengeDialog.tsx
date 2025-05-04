
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
import { DatePickerWithRange } from "./DatePickerWithRange";
import { Switch } from "@/components/ui/switch";
import { ChallengeCategory } from "../../../domain/entities/challenge";
import { Plus } from "lucide-react";
import { Habit } from "../../../domain/entities/habit";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

type CreateChallengeFormData = {
  title: string;
  description: string;
  category: ChallengeCategory;
  dateRange: DateRange;
  isPublic: boolean;
  habitTemplate?: Partial<Habit>;
};

interface CreateChallengeDialogProps {
  onCreateChallenge: (data: Omit<CreateChallengeFormData, "dateRange"> & { 
    startDate: string; 
    endDate: string;
  }) => Promise<any>;
}

export default function CreateChallengeDialog({ onCreateChallenge }: CreateChallengeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<CreateChallengeFormData>({
    title: "",
    description: "",
    category: "fitness",
    dateRange: {
      from: new Date(),
      to: addDays(new Date(), 30)
    },
    isPublic: true,
  });

  const handleChange = (field: keyof CreateChallengeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dateRange.from || !formData.dateRange.to) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onCreateChallenge({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.dateRange.from.toISOString(),
        endDate: formData.dateRange.to.toISOString(),
        isPublic: formData.isPublic,
        habitTemplate: formData.habitTemplate,
      });
      
      // Reset form and close dialog on success
      setFormData({
        title: "",
        description: "",
        category: "fitness",
        dateRange: {
          from: new Date(),
          to: addDays(new Date(), 30)
        },
        isPublic: true,
      });
      
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Challenge</DialogTitle>
            <DialogDescription>
              Create a challenge and invite others to join you on your habit building journey.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="30-Day Meditation Challenge"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the challenge and what participants should do"
                rows={3}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Challenge Duration</Label>
              <DatePickerWithRange 
                dateRange={formData.dateRange}
                onDateRangeChange={(range) => handleChange("dateRange", range)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="public"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleChange("isPublic", checked)}
              />
              <Label htmlFor="public">Make challenge public</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
