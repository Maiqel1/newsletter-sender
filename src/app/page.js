"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { newsletterTemplates } from "./templates";

export default function Home() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Load saved content when component mounts
  useEffect(() => {
    const savedContent = localStorage.getItem("newsletterDraft");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // Save content to localStorage whenever it changes
  const handleEditorChange = (newContent) => {
    setContent(newContent);
    localStorage.setItem("newsletterDraft", newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm("Are you sure you are ready to send?");
    if (!userConfirmed) {
      return;
    }

    setIsLoading(true);
    setStatus("Sending newsletter...");

    try {
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to send newsletter");

      setStatus("Newsletter sent successfully!");
      setContent("");
      // Clear the saved draft after successful send
      localStorage.removeItem("newsletterDraft");
    } catch (error) {
      setStatus("Failed to send newsletter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to clear draft
  const clearDraft = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the draft? This cannot be undone."
      )
    ) {
      setContent("");
      localStorage.removeItem("newsletterDraft");
      setStatus("Draft cleared");
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mb-8 text-gray-900'>
          Newsletter Sender
        </h1>
        <div className='flex gap-4 mb-4'>
          <button
            type='button'
            onClick={() => setShowPreview(false)}
            className={`px-4 py-2 rounded-lg ${
              !showPreview
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Edit
          </button>
          <button
            type='button'
            onClick={() => setShowPreview(true)}
            className={`px-4 py-2 rounded-lg ${
              showPreview
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Preview
          </button>
          <button
            type='button'
            onClick={clearDraft}
            className='px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200'
          >
            Clear Draft
          </button>
        </div>

        {/* <select
          value={selectedTemplate}
          onChange={(e) => {
            setSelectedTemplate(e.target.value);
            if (e.target.value) {
              setContent(newsletterTemplates[e.target.value].content);
            }
          }}
          className='mb-4 p-2 border rounded-lg'
        >
          <option value=''>Select a template...</option>
          {Object.entries(newsletterTemplates).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </select> */}

        <form onSubmit={handleSubmit}>
          <div className='shadow-sm rounded-lg bg-white p-6'>
            {!showPreview ? (
              <Editor
                apiKey='3k9ddu9t4qj7v6a1qtne4qhjt4fs94ftbedbkpyik3n01cy9'
                value={content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style: `
                    body { 
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                      font-size: 16px;
                      line-height: 1.6;
                      margin: 1rem;
                    }
                  `,
                }}
              />
            ) : (
              <div className='preview-container bg-white rounded-lg shadow-sm'>
                <style jsx>{`
                  .preview-container :global(h1) {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 1rem;
                  }
                  .preview-container :global(h2) {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 0.75rem;
                  }
                  .preview-container :global(p) {
                    margin-bottom: 1rem;
                  }
                  .preview-container :global(ul) {
                    list-style-type: disc;
                    margin-bottom: 1rem;
                    padding-left: 2rem;
                  }
                  .preview-container :global(ol) {
                    list-style-type: decimal;
                    margin-bottom: 1rem;
                    padding-left: 2rem;
                  }
                  .preview-container :global(li) {
                    display: list-item;
                    margin-bottom: 0.5rem;
                  }
                  .preview-container :global(ul ul) {
                    list-style-type: circle;
                  }
                  .preview-container :global(ul ul ul) {
                    list-style-type: square;
                  }
                  .preview-container :global(table) {
                    border-collapse: collapse;
                    width: 100%;
                    margin-bottom: 1rem;
                  }
                  .preview-container :global(th),
                  .preview-container :global(td) {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                  }
                  .preview-container :global(a) {
                    color: #2563eb;
                    text-decoration: underline;
                  }
                `}</style>
                <div
                  className='min-h-[500px] p-8'
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}

            <div className='mt-4 flex items-center justify-between'>
              <p className='text-sm text-gray-600'>{status}</p>
              <div className='space-x-4'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
                >
                  {isLoading ? "Sending..." : "Send Newsletter"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
