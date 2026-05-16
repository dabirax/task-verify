import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient} from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import { useWorkerProfile, useCreateWorkerProfile, useWorkerKYC, useUpdateWorkerProfile } from '../hooks/useWorkerProfileQueries';
import { workerProfileApi } from '../services/workerProfileApi';
import KYCModal from '../components/KYCModal';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getInitials, getSkillColor } from '../utils/formatters';
import { ShieldCheck, User as UserIcon, Mail, MapPin, Edit2, Loader2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { addToast } = useApp();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    primary_location: '',
    skills: [] as string[],
  });
  const [tempSkill, setTempSkill] = useState('');

  const { data: workerProfile, isLoading: loadingProfile } = useWorkerProfile({ 
    enabled: user?.role === 'worker',
    retry: false 
  });

  const { data: kycStatus } = useWorkerKYC();
  const createMutation = useCreateWorkerProfile();
  
  const [showKYC, setShowKYC] = useState(false);

  const updateMutation = useUpdateWorkerProfile();

  const handleEditClick = () => {
    if (workerProfile) {
      setEditForm({
        name: workerProfile.name || '',
        bio: workerProfile.bio || '',
        primary_location: workerProfile.primary_location || '',
        skills: workerProfile.skills || [],
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    updateMutation.mutate(editForm, {
      onSuccess: (data: any) => {
        addToast('Profile updated successfully!', 'success');
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ['worker', 'profile'] });
        // update auth user if name changed
        if (user) {
          setUser({ ...user, full_name: data.name || user.full_name });
        }
      },
      onError: (err: any) => {
        addToast(err.message || 'Failed to update profile', 'error');
      }
    });
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const handleCreateProfile = () => {
    createMutation.mutate(
      {
        name: editForm.name || user?.full_name || '',
        primary_location: editForm.primary_location || 'Lagos, Nigeria',
        bio: editForm.bio || '',
        skills: editForm.skills || [],
      },
      {
        onSuccess: (response: any) => {
          addToast('Worker Profile Created!', 'success');
          if (user && response?.worker?.id) {
            setUser({ ...user, worker_id: response.worker.id });
          }
          queryClient.invalidateQueries({ queryKey: ['worker', 'profile'] });
          // If user added skills while creating, update the profile with skills via PATCH
          if (editForm.skills && editForm.skills.length > 0) {
            workerProfileApi.updateProfile({ skills: editForm.skills }).then(() => {
              queryClient.invalidateQueries({ queryKey: ['worker', 'profile'] });
            }).catch((err) => {
              addToast(err.message || 'Failed to save skills', 'error');
            });
          }
        },
        onError: (err: any) => {
          addToast(err.message || 'Failed to create profile', 'error');
        }
      }
    );
  };

  const avatarBg = 'bg-blue-50 text-blue-700';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container pt-32 pb-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-navy-900">My Profile</h1>
        {user?.role === 'worker' && workerProfile && !isEditing && (
          <Button onClick={handleEditClick} variant="outline" className="rounded-xl">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-100 p-8 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg rounded-3xl">
             <AvatarImage src={workerProfile?.avatar_url || ''} className="object-cover" />
             <AvatarFallback className={`${avatarBg} rounded-3xl font-black text-3xl`}>
               {getInitials(workerProfile?.name || user?.full_name || user?.email || 'U')}
             </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
             {isEditing ? (
               <Input 
                 value={editForm.name}
                 onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                 className="mb-2 max-w-sm text-lg font-bold"
                 placeholder="Your full name"
               />
             ) : (
               <h2 className="text-2xl font-black text-navy-900 mb-1">{workerProfile?.name || user?.full_name || 'User'}</h2>
             )}
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-slate-500 font-bold">
               <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user?.email}</div>
               <Badge variant="secondary" className="uppercase tracking-widest text-[10px]">{user?.role}</Badge>
             </div>
          </div>
        </div>

        {user?.role === 'worker' && !workerProfile && (
          <div className="p-8 space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-6">
              <h3 className="font-black text-amber-900 text-lg mb-2">Create Your Worker Profile</h3>
              <p className="text-amber-800 text-sm font-medium">To apply for tasks and receive payouts, you must complete your worker profile.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1 block">Full Name</label>
                <Input 
                  value={editForm.name || user?.full_name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1 block">Primary Location</label>
                <Input 
                  value={editForm.primary_location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, primary_location: e.target.value }))}
                  placeholder="e.g. Ikeja, Lagos"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1 block">Bio / Expertise</label>
                <textarea 
                  className="w-full rounded-xl border-slate-200 p-3 text-sm font-medium focus:border-emerald-500 focus:ring-emerald-500 resize-none h-24"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe your skills and experience..."
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1 block">Skills</label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {editForm.skills?.map((s) => (
                    <Badge key={s} className="flex items-center gap-2 px-3 py-1 rounded-full">
                      <span className="uppercase font-black text-xs">{s}</span>
                      <button type="button" onClick={() => setEditForm(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }))} className="text-slate-400 hover:text-slate-600">✕</button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={tempSkill} onChange={(e) => setTempSkill(e.target.value)} placeholder="Add a skill and press Enter or Add" onKeyDown={(e) => {
                    if (e.key === 'Enter' && tempSkill.trim()) {
                      e.preventDefault();
                      if (!editForm.skills.includes(tempSkill.trim())) {
                        setEditForm(prev => ({ ...prev, skills: [...prev.skills, tempSkill.trim()] }));
                      }
                      setTempSkill('');
                    }
                  }} />
                  <Button onClick={() => {
                    if (tempSkill.trim()) {
                      if (!editForm.skills.includes(tempSkill.trim())) {
                        setEditForm(prev => ({ ...prev, skills: [...prev.skills, tempSkill.trim()] }));
                      }
                      setTempSkill('');
                    }
                  }}>Add</Button>
                </div>
              </div>
              <Button 
                onClick={handleCreateProfile} 
                disabled={createMutation.isPending || !editForm.primary_location}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest h-14 rounded-xl"
              >
                {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create & Link Profile'}
              </Button>
            </div>
          </div>
        )}

        {user?.role === 'worker' && workerProfile && (
          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-3">About</h3>
              {isEditing ? (
                <textarea 
                  className="w-full rounded-xl border-slate-200 p-3 text-sm font-medium focus:border-emerald-500 focus:ring-emerald-500 resize-none h-24"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {workerProfile.bio || "No bio provided. Edit your profile to add one."}
                </p>
              )}
            </div>

              <div className="mt-4">
                <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-3">Skills</h3>
                {isEditing ? (
                  <div>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {editForm.skills?.map((s) => (
                        <Badge key={s} className="flex items-center gap-2 px-3 py-1 rounded-full">
                          <span className="uppercase font-black text-xs">{s}</span>
                          <button type="button" onClick={() => setEditForm(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }))} className="text-slate-400 hover:text-slate-600">✕</button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={tempSkill} onChange={(e) => setTempSkill(e.target.value)} placeholder="Add a skill and press Enter or Add" onKeyDown={(e) => {
                        if (e.key === 'Enter' && tempSkill.trim()) {
                          e.preventDefault();
                          if (!editForm.skills.includes(tempSkill.trim())) {
                            setEditForm(prev => ({ ...prev, skills: [...prev.skills, tempSkill.trim()] }));
                          }
                          setTempSkill('');
                        }
                      }} />
                      <Button onClick={() => {
                        if (tempSkill.trim()) {
                          if (!editForm.skills.includes(tempSkill.trim())) {
                            setEditForm(prev => ({ ...prev, skills: [...prev.skills, tempSkill.trim()] }));
                          }
                          setTempSkill('');
                        }
                      }}>Add</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {workerProfile.skills && workerProfile.skills.length > 0 ? (
                      workerProfile.skills.map((s: string) => (
                        <Badge key={s} variant="outline" className={`font-black uppercase tracking-widest border-none px-3 py-1 ${getSkillColor(s)}`}>
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <div className="text-slate-500">No skills added yet.</div>
                    )}
                  </div>
                )}
              </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location
                </h3>
                {isEditing ? (
                  <Input 
                    value={editForm.primary_location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, primary_location: e.target.value }))}
                    placeholder="e.g. Lagos, Nigeria"
                  />
                ) : (
                  <div className="text-slate-600 font-bold">{workerProfile.primary_location || "Not specified"}</div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-black text-navy-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-400" /> Account Status
                </h3>
                <div className="flex items-center gap-2">
                  {workerProfile.is_active ? (
                     <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">Active</Badge>
                  ) : (
                     <Badge variant="outline" className="text-slate-400">Inactive</Badge>
                  )}
                  {workerProfile.trust_score >= 500 && (
                     <Badge className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                       <ShieldCheck className="w-3 h-3" /> KYC Verified
                     </Badge>
                  )}
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="bg-navy-950 text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <ShieldCheck className="w-full h-full" />
                </div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Trust Identity</h3>
                  {workerProfile.tier && (
                    <Badge className="bg-white/10 text-white border-none font-black text-[10px] uppercase tracking-widest">{workerProfile.tier} Tier</Badge>
                  )}
                </div>
                <div className="flex items-end gap-3 mb-6 relative z-10">
                  <div className="text-4xl font-black">{workerProfile.trust_score}</div>
                  <div className="text-sm font-bold text-slate-300 pb-1">Points</div>
                </div>

                {workerProfile.economic_profile && (
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 relative z-10">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Economic Risk</div>
                      <div className="text-sm font-bold capitalize">{workerProfile.economic_profile.risk_level}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reliability Score</div>
                      <div className="text-sm font-bold">{workerProfile.economic_profile.reliability_score}/100</div>
                    </div>
                  </div>
                )}
                
                {kycStatus?.status !== 'approved' && (
                  <Button 
                    onClick={() => setShowKYC(true)}
                    className="mt-6 bg-white text-navy-950 hover:bg-slate-100 font-black text-xs uppercase tracking-widest px-6 h-10 rounded-xl"
                  >
                    Complete National KYC <ShieldCheck className="ml-2 w-4 h-4 text-emerald-500" />
                  </Button>
                )}
              </div>
            )}

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                 <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={updateMutation.isPending}>
                   <X className="w-4 h-4 mr-2" /> Cancel
                 </Button>
                 <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-emerald-600 hover:bg-emerald-500">
                   {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                   Save Changes
                 </Button>
              </div>
            )}
          </div>
        )}

        {user?.role === 'buyer' && (
          <div className="p-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
               <h3 className="text-lg font-black text-navy-900 mb-2">Buyer Account</h3>
               <p className="text-slate-500 font-medium">You are logged in as a Buyer. Use the Finance page to manage your Squad Escrow transactions and fund your wallet.</p>
            </div>
          </div>
        )}
      </div>

      <KYCModal isOpen={showKYC} onClose={() => setShowKYC(false)} />
    </motion.div>
  );
}
