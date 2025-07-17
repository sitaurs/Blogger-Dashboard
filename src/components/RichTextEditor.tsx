import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = "Mulai menulis..."
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="rich-text-editor">
      <Editor
        apiKey="your-tinymce-api-key" // Ganti dengan API key TinyMCE Anda
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'template', 'codesample', 'hr', 'pagebreak', 'nonbreaking',
            'toc', 'imagetools', 'textpattern', 'noneditable', 'quickbars'
          ],
          toolbar: [
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            'forecolor backcolor | code codesample | hr pagebreak | insertdatetime | fullscreen preview | help'
          ].join(' | '),
          content_style: `
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              font-size: 14px;
              line-height: 1.6;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              font-weight: 600;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            h1 { font-size: 2.5em; }
            h2 { font-size: 2em; }
            h3 { font-size: 1.5em; }
            h4 { font-size: 1.25em; }
            h5 { font-size: 1.1em; }
            h6 { font-size: 1em; }
            p { margin-bottom: 1em; }
            blockquote {
              border-left: 4px solid #e5e7eb;
              margin: 1.5em 0;
              padding-left: 1em;
              font-style: italic;
              color: #6b7280;
            }
            code {
              background-color: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 0.25em;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.9em;
            }
            pre {
              background-color: #1f2937;
              color: #f9fafb;
              padding: 1em;
              border-radius: 0.5em;
              overflow-x: auto;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5em;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table th, table td {
              border: 1px solid #e5e7eb;
              padding: 0.5em;
              text-align: left;
            }
            table th {
              background-color: #f9fafb;
              font-weight: 600;
            }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          resize: true,
          elementpath: false,
          statusbar: true,
          paste_data_images: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              
              input.addEventListener('change', (e: any) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.addEventListener('load', () => {
                    callback(reader.result as string, {
                      alt: file.name,
                      title: file.name
                    });
                  });
                  reader.readAsDataURL(file);
                }
              });
              
              input.click();
            }
          },
          images_upload_handler: async (blobInfo, progress) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename());
              
              fetch('/api/content/upload', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
              })
              .then(response => response.json())
              .then(result => {
                if (result.success) {
                  resolve(result.data.url);
                } else {
                  reject(result.message || 'Upload failed');
                }
              })
              .catch(error => {
                reject('Upload failed: ' + error.message);
              });
            });
          },
          setup: (editor) => {
            editor.on('init', () => {
              // Custom styling untuk dark theme compatibility
              const iframe = editor.getDoc();
              if (iframe) {
                const style = iframe.createElement('style');
                style.textContent = `
                  .mce-content-body {
                    background-color: white;
                    color: #333;
                  }
                `;
                iframe.head.appendChild(style);
              }
            });
          }
        }}
      />
    </div>
  );
};

export default RichTextEditor;