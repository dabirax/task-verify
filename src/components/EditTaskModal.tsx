import { useEffect, useMemo, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useUpdateTask } from '../hooks/useBuyerQueries';
import { useApp } from '../context/AppContext';
import type { Task } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

function toDateTimeLocal(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { addToast } = useApp();
  const { mutate: updateTask, isPending } = useUpdateTask();

  const initialSpec = useMemo(() => {
    const spec = task.deliverable_spec && typeof task.deliverable_spec === 'object'
      ? task.deliverable_spec
      : {};

    return {
      photos_required: Boolean((spec as any).photos_required),
      minimum_photos: Number((spec as any).minimum_photos || 1),
      notes: String((spec as any).notes || ''),
    };
  }, [task.deliverable_spec]);

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [amount, setAmount] = useState(String(task.amount_naira || ''));
  const [location, setLocation] = useState(task.task_location || '');
  const [dueDate, setDueDate] = useState(toDateTimeLocal(task.due_date));
  const [skills, setSkills] = useState((task.required_skills || []).join(', '));
  const [photosRequired, setPhotosRequired] = useState(initialSpec.photos_required);
  const [minimumPhotos, setMinimumPhotos] = useState(String(initialSpec.minimum_photos));
  const [specNotes, setSpecNotes] = useState(initialSpec.notes);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(task.title || '');
    setDescription(task.description || '');
    setAmount(String(task.amount_naira || ''));
    setLocation(task.task_location || '');
    setDueDate(toDateTimeLocal(task.due_date));
    setSkills((task.required_skills || []).join(', '));
    setPhotosRequired(initialSpec.photos_required);
    setMinimumPhotos(String(initialSpec.minimum_photos));
    setSpecNotes(initialSpec.notes);
  }, [isOpen, task, initialSpec]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      addToast('Enter a valid amount', 'error');
      return;
    }

    const skillList = skills
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    updateTask(
      {
        id: task.id,
        data: {
          title: title.trim(),
          description: description.trim(),
          amount_naira: parsedAmount,
          task_location: location.trim(),
          due_date: new Date(dueDate).toISOString(),
          required_skills: skillList,
          deliverable_spec: {
            photos_required: photosRequired,
            minimum_photos: Number(minimumPhotos || 1),
            notes: specNotes.trim(),
          },
        },
      },
      {
        onSuccess: () => {
          addToast('Task updated successfully', 'success');
          onClose();
        },
        onError: (err: any) => {
          addToast(err?.message || 'Failed to update task', 'error');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Update task details visible to workers.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (Naira)</Label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Skills (comma-separated)</Label>
            <Input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="cleaning, delivery, carpentry"
            />
          </div>

          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                id="edit-photos-required"
                type="checkbox"
                checked={photosRequired}
                onChange={(e) => setPhotosRequired(e.target.checked)}
              />
              <Label htmlFor="edit-photos-required">Require photo proof</Label>
            </div>

            {photosRequired && (
              <div className="space-y-2">
                <Label>Minimum Photos</Label>
                <Input
                  type="number"
                  min="1"
                  value={minimumPhotos}
                  onChange={(e) => setMinimumPhotos(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Specification Notes</Label>
              <Textarea
                value={specNotes}
                onChange={(e) => setSpecNotes(e.target.value)}
                className="min-h-20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-navy-900 hover:bg-navy-800 text-white">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
