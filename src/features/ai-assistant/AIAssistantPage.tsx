import { useState } from 'react'
import { Button } from '../../components/ui'
import {
  Sparkles,
  CalendarCheck,
  FileText,
  IndianRupee,
  Briefcase,
  Users,
  GraduationCap,
  School,
  BookA,
  Send,
  MessageSquare,
  ChevronRight,
  Database,
  ArrowLeft,
} from 'lucide-react'

export interface AIModule {
  id: string
  name: string
  icon: React.ElementType
  description: string
  placeholder: string
  suggestedQuestions: string[]
}

export const AI_MODULES: AIModule[] = [
  {
    id: 'attendance',
    name: 'Attendance',
    icon: CalendarCheck,
    description: 'View attendance insights and attendance-related information.',
    placeholder: 'Ask about Attendance...',
    suggestedQuestions: [
      "What is today's attendance?",
      'Show students with low attendance',
      'What is the attendance percentage of my class?',
    ],
  },
  {
    id: 'exams',
    name: 'Test & Exam',
    icon: FileText,
    description: 'Explore exam schedules, marks, results and examination information.',
    placeholder: 'Ask about Test & Exam...',
    suggestedQuestions: [
      'What exams are upcoming?',
      'Show exam schedule',
      'Show marks information',
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: IndianRupee,
    description: 'Check fee and payment-related information.',
    placeholder: 'Ask about Finance...',
    suggestedQuestions: [
      'What is the total fee collection?',
      'Show pending fees',
      'Show fee payment information',
    ],
  },
  {
    id: 'tnp',
    name: 'TNP',
    icon: Briefcase,
    description: 'Explore training, placement, company and drive information.',
    placeholder: 'Ask about TNP & Placements...',
    suggestedQuestions: [
      'What placement drives are active?',
      'Show upcoming TNP activities',
      'Show placement information',
    ],
  },
  {
    id: 'student',
    name: 'Student',
    icon: Users,
    description: 'Access student-related information and insights.',
    placeholder: 'Ask about Students...',
    suggestedQuestions: [
      'How many students are there?',
      'Show student information',
      'Show students by class',
    ],
  },
  {
    id: 'teacher',
    name: 'Teacher',
    icon: GraduationCap,
    description: 'Access teacher and faculty-related information.',
    placeholder: 'Ask about Teachers...',
    suggestedQuestions: [
      'How many teachers are there?',
      'Show teacher information',
      'Show assigned classes',
    ],
  },
  {
    id: 'classes',
    name: 'Classes',
    icon: School,
    description: 'Explore class, section, branch and class-related information.',
    placeholder: 'Ask about Classes & Sections...',
    suggestedQuestions: [
      'Show available classes',
      'Show class information',
      'Show class teachers',
    ],
  },
  {
    id: 'academic',
    name: 'Academic Structure',
    icon: BookA,
    description: 'Explore courses, branches, years, semesters and subjects.',
    placeholder: 'Ask about Academic Structure...',
    suggestedQuestions: [
      'Show available courses',
      'Show branches',
      'Show semesters and subjects',
    ],
  },
]

export function AIAssistantPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('attendance')
  const [inputQuery, setInputQuery] = useState<string>('')
  const [activeTabMode, setActiveTabMode] = useState<'grid' | 'chat'>('grid')

  const activeModule = AI_MODULES.find((m) => m.id === selectedModuleId) || AI_MODULES[0]
  const ActiveIcon = activeModule.icon

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(moduleId)
    setInputQuery('')
    setActiveTabMode('chat')
  }

  const handleChipClick = (question: string) => {
    setInputQuery(question)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand-600" /> AI Assistant
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Ask questions and get insights from your college management data.
          </p>
        </div>

        {activeTabMode === 'chat' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTabMode('grid')}
            className="self-start sm:self-auto text-ink-600 hover:text-ink-900 border border-border"
          >
            <ArrowLeft className="h-4 w-4" /> All Context Panels
          </Button>
        )}
      </div>

      {/* 8 DATA CONTEXT PANELS (GRID VIEW) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-ink-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-brand-600" /> Select Data Context Module
          </h2>
          {activeTabMode === 'chat' && (
            <span className="text-xs text-brand-600 font-medium">
              Active Context: {activeModule.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_MODULES.map((module) => {
            const Icon = module.icon
            const isSelected = selectedModuleId === module.id && activeTabMode === 'chat'

            return (
              <button
                key={module.id}
                onClick={() => handleSelectModule(module.id)}
                className={`flex flex-col justify-between p-4 rounded-[var(--radius-card)] border-2 text-left transition-all duration-200 cursor-pointer group ${
                  isSelected
                    ? 'border-brand-600 bg-brand-100/40 dark:bg-brand-900/20 shadow-sm'
                    : 'border-border bg-surface hover:border-brand-400 hover:shadow-[var(--shadow-soft)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-surface-hover text-ink-700 group-hover:bg-brand-50 dark:group-hover:bg-brand-950 group-hover:text-brand-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        isSelected
                          ? 'text-brand-600 translate-x-0.5'
                          : 'text-ink-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink-900 group-hover:text-brand-600 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-xs text-ink-400 mt-1 line-clamp-2 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* AI ASSISTANT CHAT WORKSPACE */}
      <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-[var(--shadow-soft)] overflow-hidden flex flex-col min-h-[440px]">
        {/* Workspace Context Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface-hover/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-600 text-white rounded-lg shrink-0 shadow-xs">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ink-900">
                  {activeModule.name} Assistant
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/60 rounded-md uppercase tracking-wider">
                  UI Context Ready
                </span>
              </div>
              <p className="text-xs text-ink-400 mt-0.5">
                Ask questions about {activeModule.name.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-400">
            <Database className="h-3.5 w-3.5 text-brand-600" />
            <span>Target Domain: <strong className="text-ink-900 font-medium">{activeModule.name}</strong></span>
          </div>
        </div>

        {/* Workspace Body / Main Empty State */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between space-y-8">
          {/* Centered Empty State Banner */}
          <div className="max-w-md mx-auto text-center space-y-3 py-6">
            <div className="inline-flex items-center justify-center p-3.5 bg-brand-50 dark:bg-brand-950/50 text-brand-600 rounded-full border border-brand-200/50">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-ink-900">
              How can I help with {activeModule.name}?
            </h3>
            <p className="text-xs text-ink-400">
              Ask questions related to this section. Choose from suggested topics below or type your query into the workspace prompt.
            </p>
          </div>

          {/* Suggested Questions Chips */}
          <div className="max-w-2xl mx-auto w-full space-y-2">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider text-center sm:text-left">
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {activeModule.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(q)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-hover hover:bg-brand-50 hover:text-brand-700 border border-border hover:border-brand-300 rounded-full text-xs text-ink-700 font-medium transition-all duration-150 cursor-pointer text-left"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Chat Input Footer */}
        <div className="p-4 sm:p-5 border-t border-border bg-surface-hover/30 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            className="flex items-center gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={activeModule.placeholder}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-[var(--radius-btn)] text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-600/30 focus:border-brand-600 transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={!inputQuery.trim()}
              className="bg-brand-600 hover:bg-brand-700 text-white shrink-0 px-4 py-2.5"
            >
              <Send className="h-4 w-4" /> Send
            </Button>
          </form>

          <p className="text-[10px] text-ink-400 text-center sm:text-left">
            Note: This interface is prepared for future AI backend & data retrieval integration.
          </p>
        </div>
      </div>
    </div>
  )
}
