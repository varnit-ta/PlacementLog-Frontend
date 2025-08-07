"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useState } from 'react';
import Editor from '@/components/editor';
import { UserContext } from '@/context/user-context';
import { apiService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Building2, Briefcase, DollarSign, GraduationCap, Clock, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label as ShadLabel } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import useResourcePreloader from '@/hooks/useResourcePreloader';

export default function PostCreationPage() {
  // Preload resources for better performance
  useResourcePreloader();
  
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [rounds, setRounds] = useState('');
  const [experience, setExperience] = useState('');
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const userContext = useContext(UserContext);
  const currentUser = userContext?.state;
  const dispatch = userContext?.dispatch;
  const isLoadingUser = userContext?.loading;
  const router = useRouter();

  // Capitalize username for post body
  function capitalizeName(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const handleSubmit = async () => {
    console.log('Anonymous checked:', isAnonymous);
    if (isLoadingUser) {
      toast.error('Please wait while we load your information');
      return;
    }
    if (!currentUser) {
      toast.error('Please log in to create a post');
      return;
    }

    if (!companyName || !role) {
      toast.error('Please fill in company name and role');
      return;
    }

    setIsSubmitting(true);

    try {
      const postBody: any = {
        companyName,
        role,
        status,
      };

      if (ctc) postBody.ctc = ctc;
      if (cgpa) postBody.cgpa = cgpa;
      if (rounds) postBody.rounds = parseInt(rounds);
      if (experience) postBody.experience = experience;
      if (!isAnonymous) {
        postBody.username = currentUser?.username ? capitalizeName(currentUser.username) : "Anonymous";
      } else {
        postBody.username = "Anonymous";
      }

      await apiService.createPost(postBody);
      
      // Reset form
      setCompanyName('');
      setRole('');
      setCtc('');
      setCgpa('');
      setRounds('');
      setExperience('');
      setStatus('');
      setIsAnonymous(false);
      
      toast.success('Post created successfully! It will be reviewed by an admin.');
      router.push('/');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-white py-8 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
              <p className="text-gray-600 mt-2">Share your placement experience</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Section 1: Company & Role */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-black mb-4">Company & Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Building2 className="w-4 h-4" />
                  <span>Company Name *</span>
                </Label>
                <Input
                  id="company"
                  placeholder="Google, Microsoft, etc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Briefcase className="w-4 h-4" />
                  <span>Role/Position *</span>
                </Label>
                <Input
                  id="role"
                  placeholder="Software Engineer, Data Scientist, etc."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Section 2: Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-black mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ctc" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  <span>CTC (LPA)</span>
                </Label>
                <Input
                  id="ctc"
                  type="number"
                  placeholder="e.g., 12.5"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cgpa" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <GraduationCap className="w-4 h-4" />
                  <span>CGPA</span>
                </Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 8.5"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="rounds" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>Number of Rounds</span>
                </Label>
                <Input
                  id="rounds"
                  type="number"
                  placeholder="e.g., 3"
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>Status</span>
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="w-full mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Section 3: Experience */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-black mb-4">Experience & Interview Process</h2>
            <div className="border border-gray-200 rounded-lg">
              {isLoadingUser ? (
                // Editor skeleton while user context is loading
                <div>
                  <div className="border-b border-gray-200 p-2">
                    <div className="flex space-x-2">
                      {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="w-8 h-8 rounded" />
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <Skeleton className="w-full h-32" />
                  </div>
                </div>
              ) : (
                <Editor
                  onContentChange={setExperience}
                />
              )}
            </div>
          </div>

          {/* Section 4: Anonymous Toggle */}
          <div className="flex items-center mb-8">
            <input
              id="anonymous-toggle"
              type="checkbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              className="mr-2 h-4 w-4 accent-black"
            />
            <ShadLabel htmlFor="anonymous-toggle" className="text-sm text-gray-700 select-none cursor-pointer">
              Post as anonymous
            </ShadLabel>
          </div>

          {/* Section 5: Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoadingUser}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Post...</span>
                </div>
              ) : isLoadingUser ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
