// components/PostCard.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import "@/styles/tiptap.css"; // custom TipTap styles
import "prism-code-editor-lightweight/layout.css";
import "prism-code-editor-lightweight/themes/github-dark.css";
import "katex/dist/katex.min.css";
import "easydrawer/styles.css";
import "@excalidraw/excalidraw/index.css";
import { Building2, User, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface PostCardProps {
  post: {
    id?: string;
    user_id?: string;
    post_body: {
      companyName?: string;
      company?: string;
      role?: string;
      ctc?: string;
      cgpa?: string;
      rounds?: any;
      experience?: string;
      user?: string;
      [key: string]: any;
    };
    reviewed?: boolean;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const {
    companyName,
    company,
    role,
    ctc,
    cgpa,
    rounds,
    experience,
    user,
  } = post.post_body || {};

  // Use companyName if available, otherwise fall back to company
  const companyDisplay = companyName || company || "Unknown Company";

  // Decode HTML entities in experience content
  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const decodedExperience = experience ? decodeHtml(experience) : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden tiptap-content">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{companyDisplay}</h3>
                <p className="text-sm text-gray-600">{role || "Role not specified"}</p>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            {post.reviewed === false ? (
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>Pending</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Approved</span>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-gray-600" />
          </div>
          <span className="text-sm text-gray-600">by {post.user_id || user}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {ctc && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">CTC</p>
              <p className="text-lg font-semibold text-gray-900">{ctc} LPA</p>
            </div>
          )}
          
          {cgpa && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">CGPA</p>
              <p className="text-lg font-semibold text-gray-900">{cgpa}</p>
            </div>
          )}
          
          {rounds && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Rounds</p>
              <p className="text-lg font-semibold text-gray-900">{rounds}</p>
            </div>
          )}
        </div>

        {/* Experience Section */}
        {decodedExperience && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="experience" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>View Experience</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="prose prose-gray max-w-none bg-gray-50 rounded-lg shadow p-5 border border-gray-100">
                  <div
                    className="prose max-w-none"
                    style={{ wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{ __html: decodedExperience }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};
