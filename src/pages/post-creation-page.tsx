'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useState } from 'react';
import Editor from '@/components/editor';
import { UserContext } from '@/context/user-context';
import { apiService } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, DollarSign, GraduationCap, Clock, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const PostCreationForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [rounds, setRounds] = useState('');
  const [experience, setExperience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userContext = useContext(UserContext);
  const currentUser = userContext?.state;
  const dispatch = userContext?.dispatch;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      if (!dispatch)
        return
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }
  }, [dispatch]);

  const handleSubmit = async () => {
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
      };

      if (ctc) postBody.ctc = ctc;
      if (cgpa) postBody.cgpa = cgpa;
      if (rounds) postBody.rounds = parseInt(rounds);
      if (experience) postBody.experience = experience;

      await apiService.createPost(postBody);
      
      // Reset form
      setCompanyName('');
      setRole('');
      setCtc('');
      setCgpa('');
      setRounds('');
      setExperience('');
      
      toast.success('Post created successfully! It will be reviewed by an admin.');
      navigate('/');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Company Information */}
            <div className="space-y-4">
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

            {/* Additional Details */}
            <div className="space-y-4">
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
            </div>
          </div>

          {/* Experience Editor */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Experience & Interview Process
            </Label>
            <div className="border border-gray-200 rounded-lg">
              <Editor
                onContentChange={setExperience}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Post...</span>
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
};
