import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Plus, X, BrainCircuit, MapPin, Calendar, Banknote, Briefcase } from 'lucide-react';
import { useCreateTask } from '../hooks/useBuyerQueries';
import { useApp } from '../context/AppContext';
import type { WorkerMatch } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (taskId: number, matches: WorkerMatch[]) => void;
}

const NIGERIAN_CITIES = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kaduna', 'Onitsha', 'Benin City', 'Aba'];
const SKILL_OPTIONS = ['cleaning', 'delivery', 'carpentry', 'tailoring', 'cooking', 'driving', 'security', 'tutoring', 'welding', 'phone repair', 'plumbing', 'painting'];

export default function CreateTaskModal({ isOpen, onClose, onCreated }: CreateTaskModalProps) {
  const { addToast } = useApp();
  const { mutate, isPending } = useCreateTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [photosRequired, setPhotosRequired] = useState(true);
  const [minPhotos, setMinPhotos] = useState('3');
  const [specNotes, setSpecNotes] = useState('');

  const addSkill = (skill: string) => {
    const s = skill.trim().toLowerCase();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput('');
  };

  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deliverableSpec = {
      photos_required: photosRequired,
      minimum_photos: Number(minPhotos),
      notes: specNotes,
    };

    mutate({
      title,
      description,
      amount_naira: Number(amount),
      task_location: location,
      due_date: new Date(dueDate).toISOString(),
      deliverable_spec: deliverableSpec,
      client_name: 'Anonymous',
      client_email: 'client@example.com',
      required_skills: skills,
    }, {
      onSuccess: (data) => {
        addToast('Task created! AI matched candidates for you.', 'success');
        onCreated?.(data.task.id, data.matches || []);
        onClose();
        resetForm();
      },
      onError: (err: Error) => {
        addToast(err.message || 'Failed to create task', 'error');
      },
    });
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setAmount(''); setLocation('');
    setDueDate(''); setSkills([]); setSkillInput('');
    setPhotosRequired(true); setMinPhotos('3'); setSpecNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-navy-900 p-8 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight text-white">
                Post a New Service
              </DialogTitle>
            </div>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              AI will match and rank the best workers for you
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" /> Service Title
            </Label>
            <Input
              required
              placeholder="e.g. Deep clean 3-bedroom apartment"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="h-12 rounded-2xl border-slate-100"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Description</Label>
            <Textarea
              required
              placeholder="Describe the work in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="rounded-2xl border-slate-100 min-h-[100px]"
            />
          </div>

          {/* Amount + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900 flex items-center gap-2">
                <Banknote className="w-3.5 h-3.5" /> Amount (₦)
              </Label>
              <Input
                required
                type="number"
                min="500"
                placeholder="25000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="h-12 rounded-2xl border-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Location
              </Label>
              <Input
                required
                placeholder="Ikeja, Lagos"
                value={location}
                onChange={e => setLocation(e.target.value)}
                list="city-list"
                className="h-12 rounded-2xl border-slate-100"
              />
              <datalist id="city-list">
                {NIGERIAN_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Due Date
            </Label>
            <Input
              required
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="h-12 rounded-2xl border-slate-100"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-navy-900">Required Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                list="skills-list"
                className="h-10 rounded-2xl border-slate-100 flex-1"
              />
              <datalist id="skills-list">
                {SKILL_OPTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
              <Button type="button" onClick={() => addSkill(skillInput)} variant="outline" size="icon" className="w-10 h-10 rounded-2xl border-slate-100">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(s => (
                  <Badge key={s} className="bg-navy-50 text-navy-900 border-none font-bold text-xs px-3 py-1 flex items-center gap-1 capitalize">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="ml-1 hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Deliverable Spec */}
          <div className="rounded-3xl border border-slate-100 p-6 space-y-4 bg-slate-50/50">
            <div className="text-[10px] font-black uppercase tracking-widest text-navy-900 mb-2">Deliverable Specification</div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="photos-required"
                checked={photosRequired}
                onChange={e => setPhotosRequired(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="photos-required" className="text-sm font-bold text-navy-900">Require photo proof</label>
            </div>

            {photosRequired && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Minimum Photos</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={minPhotos}
                  onChange={e => setMinPhotos(e.target.value)}
                  className="h-10 w-28 rounded-2xl border-slate-100"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Spec Notes</Label>
              <Textarea
                placeholder="e.g. Upload before & after photos of each room..."
                value={specNotes}
                onChange={e => setSpecNotes(e.target.value)}
                className="rounded-2xl border-slate-100 min-h-[80px] bg-white"
              />
            </div>

          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-black text-sm uppercase tracking-widest shadow-xl"
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating & Matching...</>
            ) : (
              <><BrainCircuit className="w-5 h-5 mr-2 text-emerald-400" /> Post Service & Get AI Matches</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
