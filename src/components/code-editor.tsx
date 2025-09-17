"use client"

import { useState, useEffect } from "react";
import { themes } from "prism-react-renderer";
import Editor from "react-simple-code-editor";

// This is a simplified version of a code editor.
// For a full-fledged editor, you might want to use something like Monaco Editor.
const highlight = (code: string, language: string) => {
    // A real implementation would use a proper syntax highlighter here.
    // For simplicity, we are returning the code as is.
    // You could integrate Prism.js or other libraries here.
    return code;
};

interface CodeEditorProps {
    value: string;
    language: string;
    onChange?: (value: string) => void;
}

export function CodeEditor({ value, language, onChange }: CodeEditorProps) {
    const [code, setCode] = useState(value);
    
    useEffect(() => {
        setCode(value);
    }, [value]);

    const handleChange = (newCode: string) => {
        setCode(newCode);
        if (onChange) {
            onChange(newCode);
        }
    };

    return (
        <div className="relative h-full w-full overflow-auto rounded-md border border-input bg-background font-code">
            <Editor
                value={code}
                onValueChange={handleChange}
                highlight={(code) => highlight(code, language)}
                padding={16}
                style={{
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    fontSize: 14,
                    outline: 'none',
                    border: 0,
                    backgroundColor: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    height: '100%',
                }}
            />
        </div>
    );
}
