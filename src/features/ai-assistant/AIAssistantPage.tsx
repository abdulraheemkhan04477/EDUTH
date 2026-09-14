import { useState } from 'react'
import { Button, Select, Textarea, FormField, Input } from '../../components/ui'
import { Sparkles, BookOpen, Brain, Send } from 'lucide-react'

const tools = [
  { id: 'tutor', label: 'AI Tutor', description: 'Personalized learning paths and concept breakdowns.', icon: Brain },
  { id: 'quiz', label: 'Quiz Generator', description: 'Instantly create assessments from lecture notes.', icon: Sparkles },
  { id: 'homework', label: 'Homework Helper', description: 'Analyze assignments and generate grading rubrics.', icon: BookOpen },
]

export function AIAssistantPage() {
  const [selectedTool, setSelectedTool] = useState('homework')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-ink-900 flex items-center gap-2"><Sparkles className="h-6 w-6 text-brand-600" /> AI Assistant</h1>
        <p className="text-sm text-ink-400 mt-1">Smart tools to streamline your academic workflow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool rail */}
        <div className="space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            const isActive = selectedTool === tool.id
            return (
              <button key={tool.id} onClick={() => setSelectedTool(tool.id)} className={`w-full flex items-start gap-3 p-4 rounded-[var(--radius-card)] border-2 text-left transition-all cursor-pointer ${isActive ? 'border-brand-600 bg-brand-100/50' : 'border-border hover:border-ink-400'}`}>
                <div className={`p-2 rounded-[var(--radius-btn)] shrink-0 ${isActive ? 'bg-brand-600 text-white' : 'bg-canvas text-ink-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{tool.label}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{tool.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Form panel */}
        <div className="lg:col-span-2 bg-surface rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6">
          <h2 className="text-lg font-display font-bold text-ink-900 mb-1 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-brand-600" />
            {tools.find((t) => t.id === selectedTool)?.label} Workspace
          </h2>
          <p className="text-sm text-ink-400 mb-6">{tools.find((t) => t.id === selectedTool)?.description}</p>

          <div className="space-y-4">
            {selectedTool === 'homework' && (
              <>
                <FormField label="Pick from assigned homework"><Select options={[{ value: '1', label: 'Quadratic Equations Practice' }, { value: '2', label: 'Essay Writing — Climate Change' }]} placeholder="Select an assignment..." /></FormField>
                <FormField label="Your Question"><Textarea placeholder="E.g., Generate a grading rubric for this assignment emphasizing critical thinking and formatting..." rows={6} /></FormField>
              </>
            )}
            {selectedTool === 'tutor' && (
              <>
                <FormField label="Subject"><Select options={[{ value: 'math', label: 'Mathematics' }, { value: 'science', label: 'Science' }, { value: 'english', label: 'English' }]} placeholder="Select subject" /></FormField>
                <FormField label="What would you like to learn?"><Textarea placeholder="Ask any question about your subject..." rows={6} /></FormField>
              </>
            )}
            {selectedTool === 'quiz' && (
              <>
                <FormField label="Topic"><Input placeholder="e.g. Photosynthesis, Quadratic Equations" /></FormField>
                <FormField label="Number of Questions"><Select options={[{ value: '5', label: '5 Questions' }, { value: '10', label: '10 Questions' }, { value: '20', label: '20 Questions' }]} value="10" onChange={() => {}} /></FormField>
                <FormField label="Difficulty"><Select options={[{ value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} value="medium" onChange={() => {}} /></FormField>
              </>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button><Send className="h-4 w-4" /> Get Help</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

