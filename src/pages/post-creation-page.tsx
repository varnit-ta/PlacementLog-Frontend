'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useContext, useEffect, useState } from 'react';
import Editor from '@/components/editor';
import { UserContext } from '@/context/user-context';

const uploadPost = async (
  userId: string,
  data: {
    companyName: string;
    user: string;
    role: string;
    ctc: string;
    cgpa: string;
    rounds: string;
    experience: string;
  }
) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId
      },
      body: JSON.stringify({
        post_body: data,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Upload failed: ${err}`);
    }

    const result = await res.json();
    console.log('Post added successfully:', result);
  } catch (error) {
    console.error('Error uploading post:', error);
  }
};

export const PostCreationForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [user, setUser] = useState('Anonymous');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [rounds, setRounds] = useState('');
  const [experience, setExperience] = useState('');

  const userContext = useContext(UserContext);
  const currentUser = userContext?.state;
  const dispatch = userContext?.dispatch;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      if (!dispatch)
        return
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }
  }, []);

  const handleSubmit = async () => {
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    await uploadPost(currentUser.userId, {
      companyName,
      user,
      role,
      ctc,
      cgpa,
      rounds,
      experience,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g., Google"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="user">User</Label>
        <Input
          id="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Anonymous"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g., SDE Intern"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="ctc">CTC (LPA)</Label>
        <Input
          id="ctc"
          type="number"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          placeholder="e.g., 12"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="cgpa">CGPA</Label>
        <Input
          id="cgpa"
          type="number"
          step="0.01"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
          placeholder="e.g., 8.5"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="rounds">Rounds</Label>
        <Input
          id="rounds"
          type="number"
          value={rounds}
          onChange={(e) => setRounds(e.target.value)}
          placeholder="e.g., 3"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="mb-2">Placement Experience</Label>
        <Editor onContentChange={setExperience} />
      </div>

      <Button className="w-full mt-4" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};
