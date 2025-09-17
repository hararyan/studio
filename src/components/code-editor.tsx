"use client"

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism-tomorrow.css'; // Using a dark theme

interface CodeEditorProps {
    value: string;
    language: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
}

export function CodeEditor({ value, language, onChange, readOnly = false }: CodeEditorProps) {
    const [code, setCode] = useState(value);
    
    useEffect(() => {
        setCode(value);
    }, [value]);

    const handleChange = (newCode: string) => {
        if(readOnly) return;
        setCode(newCode);
        if (onChange) {
            onChange(newCode);
        }
    };

    const highlighter = (code: string) => {
        const lang = language === 'c' ? 'clike' : language;
        if (languages[lang]) {
            return highlight(code, languages[lang], lang);
        }
        return code;
    }

    return (
        <div className="relative h-full w-full overflow-auto rounded-md border border-input bg-background font-code">
            <Editor
                value={code}
                onValueChange={handleChange}
                highlight={highlighter}
                padding={16}
                readOnly={readOnly}
                style={{
                    fontFamily: '"Source Code Pro", "Fira Mono", monospace',
                    fontSize: 14,
                    outline: 'none',
                    border: 0,
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    height: '100%',
                }}
                className="h-full"
            />
        </div>
    );
}
