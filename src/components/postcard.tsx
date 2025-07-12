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

interface PostCardProps {
  post: {
    id?: string;
    post_body: {
      companyName?: string;
      user?: string;
      role?: string;
      ctc?: string;
      cgpa?: string;
      rounds?: string;
      experience?: string;
    };
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const {
    companyName = "Unknown Company",
    user = "Anonymous",
    role,
    ctc,
    cgpa,
    rounds,
    experience,
  } = post.post_body || {};

  return (
    <Accordion type="single" collapsible className="w-full rounded-lg border mb-4 shadow-sm">
      <AccordionItem value={post.id || `${companyName}-${user}`}>
        <AccordionTrigger className="p-4">
          <div className="flex justify-between w-full text-left items-center">
            <div className="text-lg font-semibold">{companyName}</div>
            <span className="text-sm text-muted-foreground ml-4">by {user}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-5 bg-muted/20 text-muted-foreground rounded-b-md">
          <div className="space-y-2 text-sm leading-relaxed text-foreground">
            <p><strong>Role:</strong> {role || "N/A"}</p>
            <p><strong>CTC:</strong> {ctc || "N/A"} LPA</p>
            <p><strong>CGPA:</strong> {cgpa || "N/A"}</p>
            <p><strong>Rounds:</strong> {rounds || "N/A"}</p>

            {experience && (
              <div className="pt-3">
                <strong className="block mb-1">Experience:</strong>
                <div
                  className="prose prose-sm sm:prose-base max-w-none tiptap-content border border-border bg-background rounded-md p-4 shadow-inner"
                  dangerouslySetInnerHTML={{ __html: experience }}
                />
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
